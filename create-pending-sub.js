const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const customer = await prisma.customer.findFirst({ where: { phone: '8888888888' } });
        if (!customer) {
            console.error('Customer not found.');
            return;
        }

        const sub = await prisma.subscription.create({
            data: {
                customerId: customer.id,
                planType: 'TRIAL',
                dietaryPreference: 'VEG',
                status: 'Pending',
                startDate: new Date(),
                endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                totalTiffins: 6,
                tiffinsDelivered: 0,
                tiffinsRemaining: 6,
                totalPrice: 600,
                paymentStatus: 'Pending',
                paymentMethod: 'ONLINE',
                razorpayOrderId: 'order_test_123'
            }
        });

        console.log(`Created PENDING subscription: ${sub.id}, Razorpay Order ID: ${sub.razorpayOrderId}`);

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await prisma.$disconnect();
    }
}

main();
