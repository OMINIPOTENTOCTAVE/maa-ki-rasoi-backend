const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
    try {
        const customers = await prisma.customer.count();
        const subs = await prisma.subscription.count();
        console.log(`Customers: ${customers}`);
        console.log(`Subscriptions: ${subs}`);
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await prisma.$disconnect();
    }
}

check();
