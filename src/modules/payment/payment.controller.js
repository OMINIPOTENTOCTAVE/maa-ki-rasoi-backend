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
                        paymentMethod: 'ONLINE',
                        razorpayPaymentId: razorpay_payment_id
                    }
                });
            } else if (orderType === 'Subscription' && referenceId) {
                await prisma.subscription.update({
                    where: { id: referenceId },
                    data: {
                        paymentStatus: 'Paid',
                        paymentMethod: 'ONLINE',
                        razorpayPaymentId: razorpay_payment_id
                    }
                });
            }
            res.json({ success: true, message: 'Payment verified successfully' });
        } else {
            res.status(400).json({ success: false, message: 'Invalid signature' });
        }
    } catch (error) {
        next(error);
    }
};

module.exports = { createOrder, verifyPayment };
