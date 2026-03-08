const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const order = await prisma.order.findFirst({ orderBy: { createdAt: 'desc' } });
        const partner = await prisma.deliveryPartner.findFirst({ where: { status: 'Active' } });

        if (!order || !partner) {
            console.error('Missing order or partner.');
            return;
        }

        console.log(`Assigning Order ${order.id} to Partner ${partner.id}...`);

        const updated = await prisma.order.update({
            where: { id: order.id },
            data: {
                deliveryPartnerId: partner.id,
                status: 'Assigned',
                assignedAt: new Date(),
            },
        });

        console.log(`Success! New status: ${updated.status}, Partner ID: ${updated.deliveryPartnerId}`);
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await prisma.$disconnect();
    }
}

main();
