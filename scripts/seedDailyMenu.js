const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seed() {
    console.log('--- Seeding Daily Menus (7 Days) ---');

    // 1. Get some MenuItems
    const items = await prisma.menuItem.findMany({ where: { isAvailable: true, isArchived: false } });
    if (items.length < 2) {
        console.error('Not enough MenuItems. Run node seed_menu.js first.');
        return;
    }

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setUTCDate(today.getUTCDate() + i);

        // Skip Sundays
        if (date.getUTCDay() === 0) continue;

        const item1 = items[Math.floor(Math.random() * items.length)];
        const item2 = items[Math.floor(Math.random() * items.length)];

        await prisma.dailyMenu.upsert({
            where: { date },
            update: {
                item1Id: item1.id,
                item2Id: item2.id,
                status: 'PUBLISHED',
                publishedAt: new Date()
            },
            create: {
                date,
                item1Id: item1.id,
                item2Id: item2.id,
                status: 'PUBLISHED',
                publishedAt: new Date(),
                publishedBy: 'system-qa'
            }
        });
        console.log(`Seeded Menu for ${date.toISOString().split('T')[0]}: ${item1.name} & ${item2.name}`);
    }
    console.log('✅ Daily Menus seeded and PUBLISHED.');
}

seed().catch(console.error).finally(() => prisma.$disconnect());
