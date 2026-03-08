const prisma = require('../src/prisma');
const timeUtils = require('../src/utils/timeUtils');
const { generateOrdersForNextDelivery } = require('../src/modules/order/order.generator');

async function testCron() {
    console.log("\n=== Starting Cron Dry Run Simulation ===");

    try {
        const now = timeUtils.getISTTimestamp();
        const targetDate = await timeUtils.getNextDeliveryDate(timeUtils.startOfISTDay(now));

        console.log(`\n1. Creating Dummy Data for Target Date: ${targetDate.toISOString()}`);

        // Create dummy Menu Items
        const i1 = await prisma.menuItem.create({ data: { name: 'Dal', description: 'Yellow Dal', price: 50, category: 'Gravy' } });
        const i2 = await prisma.menuItem.create({ data: { name: 'Paneer', description: 'Kadai Paneer', price: 50, category: 'Gravy' } });

        // Create published Daily Menu for Target Date
        const menu = await prisma.dailyMenu.create({
            data: {
                date: targetDate,
                item1Id: i1.id,
                item2Id: i2.id,
                status: 'PUBLISHED',
                saladNote: 'Cucumber'
            }
        });

        // Create Dummy Customer
        const customer = await prisma.customer.create({
            data: {
                name: 'Cron Test User',
                phone: '9999999999',
                address: 'Test Phase 1'
            }
        });

        // Create Active Subscription
        const sub = await prisma.subscription.create({
            data: {
                customerId: customer.id,
                planType: 'Weekly',
                mealSlot: 'LUNCH',
                dietaryPreference: 'VEG',
                startDate: targetDate,
                endDate: await timeUtils.addDeliveryDays(targetDate, 5),
                totalTiffins: 6,
                tiffinsRemaining: 6,
                totalPrice: 600,
                paymentMethod: 'COD',
                paymentStatus: 'Pending',
                securityDepositPaid: true,
                status: 'Active'
            }
        });

        console.log("\n2. Calling generateOrdersForNextDelivery() natively");
        await generateOrdersForNextDelivery();

        console.log("\n3. Validating Spawning...");
        const orders = await prisma.order.findMany({
            where: { dailyMenuId: menu.id, subscriptionId: sub.id }
        });

        console.log(`Found ${orders.length} generated physical orders.`);
        if (orders.length > 0) {
            console.log(orders[0]);
        }

        console.log("\n=== Cleaning Up ===");
        await prisma.order.deleteMany({ where: { dailyMenuId: menu.id } });
        await prisma.subscription.delete({ where: { id: sub.id } });
        await prisma.dailyMenu.delete({ where: { id: menu.id } });
        await prisma.menuItem.deleteMany({ where: { id: { in: [i1.id, i2.id] } } });
        await prisma.customer.delete({ where: { id: customer.id } });

        console.log("Cleanup and Test Complete.\n");
        process.exit(0);

    } catch (e) {
        console.error("Test Error:", e);
        process.exit(1);
    }
}

testCron();
