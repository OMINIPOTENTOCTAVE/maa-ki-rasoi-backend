const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const subs = await prisma.subscription.count();
        const activeSubs = await prisma.subscription.count({ where: { status: 'Active' } });
        const orders = await prisma.order.count();
        const lastOrder = await prisma.order.findFirst({ orderBy: { createdAt: 'desc' } });
        const deliveryPartners = await prisma.deliveryPartner.findMany({ where: { status: 'Active' } });

        console.log('--- DATABASE STATUS ---');
        console.log(`Total Subscriptions: ${subs}`);
        console.log(`Active Subscriptions: ${activeSubs}`);
        console.log(`Total Orders: ${orders}`);
        if (lastOrder) {
            console.log(`Last Order ID: ${lastOrder.id}`);
            console.log(`      Status: ${lastOrder.status}`);
            console.log(`      Meal Name: ${lastOrder.menuItemName}`);
            console.log(`      Customer: ${lastOrder.customerName}`);
            console.log(`      Address: ${lastOrder.address}`);
        }
        console.log(`Active Delivery Partners: ${deliveryPartners.length}`);
        if (deliveryPartners.length > 0) console.log(`      Partner: ${deliveryPartners[0].name} (${deliveryPartners[0].id})`);
        console.log('-----------------------');
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await prisma.$disconnect();
    }
}

main();
