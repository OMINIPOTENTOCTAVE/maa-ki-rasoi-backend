const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seed() {
    console.log('--- Force Seeding Target Daily Menu ---');

    const items = await prisma.menuItem.findMany({ where: { isAvailable: true, isArchived: false } });
    if (items.length < 2) return console.error('Need MenuItems');

    // Target: 2026-03-10 18:30 UTC = 2026-03-11 00:00 IST
    const targetDate = new Date('2026-03-10T18:30:00.000Z');

    const item1 = items[0];
    const item2 = items[1];

    await prisma.dailyMenu.upsert({
        where: { date: targetDate },
        update: {
            item1Id: item1.id,
            item2Id: item2.id,
            status: 'PUBLISHED',
            publishedAt: new Date()
        },
        create: {
            date: targetDate,
            item1Id: item1.id,
            item2Id: item2.id,
            status: 'PUBLISHED',
            publishedAt: new Date(),
            publishedBy: 'system-qa'
        }
    });

    console.log(`✅ Menu PUBLISHED for ${targetDate.toISOString()}`);
}

seed().catch(console.error).finally(() => prisma.$disconnect());
