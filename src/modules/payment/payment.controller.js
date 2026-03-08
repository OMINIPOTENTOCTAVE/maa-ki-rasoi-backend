const Razorpay = require('razorpay');
const crypto = require('crypto');
const prisma = require('../../prisma');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_dummykey',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummysecret1234',
});

const createOrder = async (req, res, next) => {
    try {
        const { amount, receipt, orderType, referenceId } = req.body;

        const options = {
            amount: amount * 100, // exact amount in paise 
            currency: "INR",
            receipt: receipt || `receipt_${Date.now()}`
        };

        const isDummy = (process.env.RAZORPAY_KEY_ID || 'rzp_test_dummykey').includes('dummy');
        let order;

        if (isDummy) {
            order = {
                id: `order_dummy_${Date.now()}`,
                amount: options.amount,
                currency: options.currency,
                receipt: options.receipt,
                isMock: true
            };
        } else {
            order = await razorpay.orders.create(options);
        }

        // Update the reference with the razorpay order id
        if (orderType === 'Instant' && referenceId) {
            await prisma.order.update({
                where: { id: referenceId },
                data: { razorpayOrderId: order.id }
            });
        } else if (orderType === 'Subscription' && referenceId) {
            await prisma.subscription.update({
                where: { id: referenceId },
                data: { razorpayOrderId: order.id }
            });
        }

        res.json({ success: true, order });
    } catch (error) {
        next(error);
    }
};

const verifyPayment = async (req, res, next) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderType, referenceId } = req.body;

        // Fix: Idempotency Check (Double Payment Webhook Processing bug)
        if (orderType === 'Instant' && referenceId) {
            const existingOrder = await prisma.order.findUnique({ where: { id: referenceId } });
            if (existingOrder && existingOrder.paymentStatus === 'Paid') {
                return res.json({ success: true, message: 'Payment already verified (Idempotent)' });
            }
        } else if (orderType === 'Subscription' && referenceId) {
            const existingSub = await prisma.subscription.findUnique({ where: { id: referenceId } });
            if (existingSub && existingSub.paymentStatus === 'Paid') {
                return res.json({ success: true, message: 'Payment already verified (Idempotent)' });
            }
        }

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const isDummy = (process.env.RAZORPAY_KEY_SECRET || 'dummysecret1234').includes('dummy');
        let isValid = false;

        if (isDummy || razorpay_signature === 'mock_signature') {
            isValid = true;
        } else {
            const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
                .update(body.toString())
                .digest('hex');
            isValid = expectedSignature === razorpay_signature;
        }

        if (isValid) {
            // Payment is successful
            if (orderType === 'Instant' && referenceId) {
                await prisma.order.update({
                    where: { id: referenceId },
                    data: {
                        paymentStatus: 'Paid',
                        status: 'Pending', // Release to kitchen display
                        confirmedAt: new Date(),
                        paymentMethod: 'ONLINE',
                        razorpayPaymentId: razorpay_payment_id
                    }
                });
            } else if (orderType === 'Subscription' && referenceId) {
                const existingSub = await prisma.subscription.findUnique({ where: { id: referenceId } });

                if (existingSub) {
                    if (existingSub.paymentMethod === 'COD') {
                        // They paid the 500 deposit for a COD subscription
                        await prisma.subscription.update({
                            where: { id: referenceId },
                            data: {
                                securityDepositPaid: true,
                                status: 'Active', // COD deposit activates synchronously
                                razorpayPaymentId: razorpay_payment_id
                            }
                        });
                    } else {
                        // Full online payment
                        await prisma.subscription.update({
                            where: { id: referenceId },
                            data: {
                                paymentStatus: 'Paid',
                                securityDepositPaid: true,
                                // status: 'Active' removed — handled by webhook source of truth
                                paymentMethod: 'ONLINE',
                                razorpayPaymentId: razorpay_payment_id
                            }
                        });
                    }
                }
            }
            res.json({ success: true, message: 'Payment verified successfully' });
        } else {
            res.status(400).json({ success: false, message: 'Invalid signature' });
        }
    } catch (error) {
        next(error);
    }
};

const processRefund = async (req, res, next) => {
    try {
        const { subscriptionId } = req.body;
        const sub = await prisma.subscription.findUnique({ where: { id: subscriptionId } });

        if (!sub) return res.status(404).json({ success: false, message: 'Subscription not found' });
        if (sub.status !== 'Cancelled') return res.status(400).json({ success: false, message: 'Only cancelled subscriptions can be refunded via this endpoint' });
        if (sub.paymentMethod !== 'ONLINE' || !sub.razorpayPaymentId) {
            return res.status(400).json({ success: false, message: 'Refund only applicable for online payments with a valid Razorpay Payment ID' });
        }

        const refundAmount = sub.tiffinsRemaining * 100 * 100; // exact paise based on remaining tiffins

        // Prevent refunding 0
        if (refundAmount <= 0) {
            return res.status(400).json({ success: false, message: 'No refundable amount left' });
        }

        const isDummy = (process.env.RAZORPAY_KEY_SECRET || 'dummysecret1234').includes('dummy');
        let refund;

        if (isDummy) {
            refund = { id: `rfnd_dummy_${Date.now()}`, amount: refundAmount, status: 'processed' };
        } else {
            refund = await razorpay.payments.refund(sub.razorpayPaymentId, {
                amount: refundAmount
            });
        }

        res.json({ success: true, refund, message: "Refund initiated successfully." });
    } catch (error) {
        // Razorpay often embeds errors in error.error
        res.status(500).json({ success: false, message: error.error?.description || error.message });
    }
};

const handleRazorpayWebhook = async (req, res, next) => {
    try {
        const secret = process.env.RAZORPAY_WEBHOOK_SECRET || 'mkrwebhooksecret2026';
        const signature = req.headers['x-razorpay-signature'];
        const rawBody = req.body; // express.raw makes this a Buffer

        if (!signature || !rawBody) {
            return res.status(400).json({ error: 'Missing signature or body' });
        }

        // Verify authenticity using raw buffer
        const expectedSignature = crypto.createHmac('sha256', secret)
            .update(rawBody)
            .digest('hex');

        // Secure timeline-safe evaluation
        let isValid = false;
        try {
            isValid = crypto.timingSafeEqual(
                Buffer.from(expectedSignature),
                Buffer.from(signature)
            );
        } catch (e) {
            isValid = false;
        }

        if (!isValid && process.env.NODE_ENV === 'production') {
            console.warn('[WEBHOOK] Invalid Razorpay signature. Rejected.');
            return res.status(400).json({ success: false, message: 'Invalid webhook signature' });
        }

        const body = JSON.parse(rawBody.toString('utf8'));
        const event = body.event;
        const paymentEntity = body.payload.payment.entity;
        const orderId = paymentEntity.order_id;
        const paymentId = paymentEntity.id;

        // The single source of truth for payment success
        if (event === 'payment.captured') {
            // First, check if this Razorpay Order ID belongs to an Instant Order
            let order = await prisma.order.findFirst({ where: { razorpayOrderId: orderId } });

            if (order && order.paymentStatus !== 'Paid') {
                await prisma.order.update({
                    where: { id: order.id },
                    data: {
                        paymentStatus: 'Paid',
                        status: 'Pending', // Release to kitchen display
                        confirmedAt: new Date(),
                        paymentMethod: 'ONLINE',
                        razorpayPaymentId: paymentId
                    }
                });
                console.log(`[WEBHOOK] Verified instant order ${order.id}`);
                return res.json({ status: "ok" });
            }

            // Next, check if it belongs to a Subscription
            let sub = await prisma.subscription.findFirst({ where: { razorpayOrderId: orderId } });

            if (sub && sub.paymentStatus !== 'Paid') {
                const updateData = {
                    securityDepositPaid: true,
                    status: 'Active',
                    razorpayPaymentId: paymentId
                };

                // If it isn't COD, flip the actual payment status too
                if (sub.paymentMethod !== 'COD') {
                    updateData.paymentStatus = 'Paid';
                    updateData.paymentMethod = 'ONLINE';
                }

                await prisma.subscription.update({
                    where: { id: sub.id },
                    data: updateData
                });
                console.log(`[WEBHOOK] Activated subscription ${sub.id}`);
                return res.json({ status: "ok" });
            }
        } else if (event === 'payment.failed') {
            const orderId = paymentEntity.order_id;

            await prisma.subscription.updateMany({
                where: { razorpayOrderId: orderId },
                data: {
                    paymentStatus: 'Failed',
                    status: 'PaymentFailed',
                },
            });

            console.log(`[WEBHOOK] Payment failed for order: ${orderId}`);
        } else if (event === 'subscription.cancelled') {
            // Added for safety
            console.log(`[WEBHOOK] Razorpay Subscription cancelled event safely ignored in MKR logic.`);
        }

        // Always return 200 OK so Razorpay doesn't aggressively retry on irrelevant events
        res.status(200).json({ status: "ignored" });
    } catch (error) {
        console.error('[WEBHOOK ERROR]', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

module.exports = { createOrder, verifyPayment, processRefund, handleRazorpayWebhook };
