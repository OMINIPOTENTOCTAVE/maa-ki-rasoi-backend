const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { startOfISTDay, getNextDeliveryDate, getISTTimestamp } = require('./src/utils/timeUtils');

async function main() {
    try {
        const now = getISTTimestamp();
        const baseDate = startOfISTDay(now);
        const targetDate = await getNextDeliveryDate(baseDate);

        console.log(`Current IST: ${now.toISOString()}`);
        console.log(`Base Date: ${baseDate.toISOString()}`);
        console.log(`Target Delivery Date: ${targetDate.toISOString()}`);

        // 1. Get Items
        const items = await prisma.menuItem.findMany({ take: 2 });
        if (items.length < 2) {
            console.error('Not enough menu items. Run seed_menu.js first.');
            return;
        }

        // 2. Create Daily Menu for target date
        const dailyMenu = await prisma.dailyMenu.upsert({
            where: { date: targetDate },
            update: { status: 'PUBLISHED', item1Id: items[0].id, item2Id: items[1].id },
            create: {
                date: targetDate,
                item1Id: items[0].id,
                item2Id: items[1].id,
                status: 'PUBLISHED',
                publishedAt: new Date()
            }
        });
        console.log(`Daily Menu for ${targetDate.toISOString()} is PUBLISHED.`);

        // 3. Create Delivery Partner
        const partner = await prisma.deliveryPartner.upsert({
            where: { phone: '9999999999' },
            update: { status: 'Active' },
            create: {
                name: 'Test Partner',
                phone: '9999999999',
                status: 'Active'
            }
        });
        console.log(`Delivery Partner created: ${partner.name} (${partner.id})`);

        // 4. Create Customer
        const customer = await prisma.customer.upsert({
            where: { phone: '8888888888' },
            update: {},
            create: {
                name: 'Beta User',
                phone: '8888888888',
                address: 'Beta Street, House 1'
            }
        });
        console.log(`Customer created: ${customer.name} (${customer.id})`);

        // 5. Create Active Subscription
        const subscription = await prisma.subscription.create({
            data: {
                customerId: customer.id,
                planType: 'MONTHLY',
                dietaryPreference: 'VEG',
                status: 'Active',
                startDate: targetDate,
                endDate: new Date(targetDate.getTime() + 30 * 24 * 60 * 60 * 1000), // 30 days later
                totalTiffins: 24,
                tiffinsDelivered: 0,
                tiffinsRemaining: 24,
                totalPrice: 2400,
                paymentStatus: 'Paid',
                paymentMethod: 'ONLINE'
            }
        });
        console.log(`Subscription created: ${subscription.id}, Status: ${subscription.status}`);

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await prisma.$disconnect();
    }
}

main();
