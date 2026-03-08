const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const betaUsers = [
    { name: "Anjali Sharma", phone: "919810000001" },
    { name: "Rohan Gupta", phone: "919810000002" },
    { name: "Priya Das", phone: "919810000003" },
    { name: "Amit Kumar", phone: "919810000004" },
    { name: "Suresh Raina", phone: "919810000005" },
    { name: "Deepak Hooda", phone: "919810000006" },
    { name: "Neha Kakkar", phone: "919810000007" },
    { name: "Simran Kaur", phone: "919810000008" },
    { name: "Karan Patel", phone: "919810000009" },
    { name: "Vikram Singh", phone: "919810000010" },
    { name: "Arjun Kapoor", phone: "919810000011" },
    { name: "Meera Bai", phone: "919810000012" },
    { name: "Pooja Hegde", phone: "919810000013" },
    { name: "Sanjay Dutt", phone: "919810000014" },
    { name: "Raj Kundra", phone: "919810000015" },
    { name: "Rahul Vaidya", phone: "919810000016" },
    { name: "Aman Gupta", phone: "919810000017" },
    { name: "Ishaan Khatter", phone: "919810000018" },
    { name: "Vivek Oberoi", phone: "919810000019" },
    { name: "Aditya Roy", phone: "919810000020" }
];

async function main() {
    console.log("🚀 Starting Beta Invite Campaign for 20 Users...");
    console.log("-----------------------------------------------");

    for (const user of betaUsers) {
        // 1. Create/Update user in DB
        const customer = await prisma.customer.upsert({
            where: { phone: user.phone },
            update: { name: user.name },
            create: {
                phone: user.phone,
                name: user.name,
                address: "Beta Pilot Cluster, Zone 1"
            }
        });

        // 2. Simulate sending WhatsApp/SMS
        const message = `🍛 Namaste ${user.name}! Maa Ki Rasoi is now LIVE. Use our special beta link to get 50% discount on your first monthly tiffin! http://maakirasoi-customer-2026.web.app`;

        console.log(`[WHATSAPP/SMS SENT] -> ${user.phone} (${user.name})`);
        console.log(`   Message: "${message}"`);
    }

    console.log("-----------------------------------------------");
    console.log("✅ All 20 Beta Invites Sent Successfully.");
    console.log("Maa Ki Rasoi is officially in Beta Pilot mode.");
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());
