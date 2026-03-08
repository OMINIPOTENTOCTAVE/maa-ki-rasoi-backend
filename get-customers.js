const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const customers = await prisma.customer.findMany();
        console.log(`Total Customers: ${customers.length}`);
        customers.forEach(c => console.log(`- ${c.name} (${c.phone})`));
    } finally {
        await prisma.$disconnect();
    }
}

main();
