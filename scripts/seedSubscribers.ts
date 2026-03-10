import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const CLUSTERS = ['South Delhi', 'Lajpat Nagar', 'Nehru Place'];

async function seedOneSubscriber(scenario: string, index: number) {
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(now.getDate() + 30);

    const phone = `9${Math.floor(100000000 + Math.random() * 900000000)}`;
    const email = `testuser_${scenario.toLowerCase()}_${index}_${Date.now()}@example.com`;

    try {
        // Create Customer
        const customer = await prisma.customer.create({
            data: {
                name: `Test User ${scenario} ${index}`,
                phone,
                email,
                address: `House No ${index}, ${CLUSTERS[Math.floor(Math.random() * CLUSTERS.length)]}, New Delhi`,
            }
        });

        const planType = Math.random() > 0.5 ? "BASIC" : "STANDARD";
        const mealSlot = Math.random() > 0.5 ? "LUNCH" : "DINNER";

        // Create Subscription
        await prisma.subscription.create({
            data: {
                customerId: customer.id,
                planType,
                mealSlot,
                dietaryPreference: 'VEG',
                status: 'Active',
                startDate: now,
                endDate: futureDate,
                totalTiffins: planType === 'STANDARD' ? 26 : 6,
                tiffinsRemaining: planType === 'STANDARD' ? 26 : 6,
                tiffinsDelivered: 0,
                totalPrice: (planType === 'STANDARD' ? 26 : 6) * 100,
                paymentMethod: 'RAZORPAY',
                paymentStatus: 'Paid',
                deliveryZoneId: CLUSTERS[Math.floor(Math.random() * CLUSTERS.length)].toUpperCase().replace(/\s/g, '_'),
            }
        });
    } catch (e) {
        // Silent catch for unique constraints if any, continue seeding
    }
}

async function seedSubscribers(count: number, scenario: string) {
    console.log(`\n[SEEDER] Starting seed for Scenario ${scenario} (${count} subscribers)...`);

    const BATCH_SIZE = 10;
    for (let i = 0; i < count; i += BATCH_SIZE) {
        const batch = [];
        for (let j = 0; j < BATCH_SIZE && (i + j) < count; j++) {
            batch.push(seedOneSubscriber(scenario, i + j));
        }
        await Promise.all(batch);
        if (i % 100 === 0) process.stdout.write(`${i}`); else process.stdout.write('.');
    }

    console.log(`\n[SEEDER] Completed Scenario ${scenario}.`);
}

async function main() {
    try {
        // Target 1000 for Scenario C
        await seedSubscribers(1000, 'C');

        console.log('\n[SEEDER] Scenario C seeded successfully! ✅');
    } catch (error) {
        console.error('\n[SEEDER] FATAL ERROR during seeding:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
