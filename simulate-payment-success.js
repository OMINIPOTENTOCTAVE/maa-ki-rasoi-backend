const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const orderId = 'order_test_123'; // The one we created in create-pending-sub.js
        const paymentId = 'pay_test_payment_456';

        console.log(`Simulating payment capture for Razorpay Order ID: ${orderId}...`);

        // Exact logic from payment.controller.js handleRazorpayWebhook
        let sub = await prisma.subscription.findFirst({ where: { razorpayOrderId: orderId } });

        if (sub && sub.paymentStatus !== 'Paid') {
            const updateData = {
                securityDepositPaid: true,
                status: 'Active',
                razorpayPaymentId: paymentId,
                paymentStatus: 'Paid',
                paymentMethod: 'ONLINE'
            };

            const updatedSub = await prisma.subscription.update({
                where: { id: sub.id },
                data: updateData
            });

            console.log(`[SIMULATION] SUCCESS: Subscription ${updatedSub.id} is now ${updatedSub.status}.`);
            console.log(`[SIMULATION] Payment Status: ${updatedSub.paymentStatus}`);
        } else {
            console.log('[SIMULATION] Subscription not found or already paid.');
        }

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await prisma.$disconnect();
    }
}

main();
