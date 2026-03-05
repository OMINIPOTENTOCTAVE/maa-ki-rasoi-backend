const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const MENU_ITEMS = [
    // FIXED GRAVY
    { name: 'Rajma', description: 'North Indian style red kidney beans gravy cooked with aromatic spices', price: 100, category: 'FIXED_GRAVY', isVeg: true, isAvailable: true },
    { name: 'Chole', description: 'Classic Punjabi chickpeas dish simmered gently with special chole masala', price: 100, category: 'FIXED_GRAVY', isVeg: true, isAvailable: true },
    { name: 'Kadhi', description: 'Traditional yogurt and besan curry with soft pakoras', price: 100, category: 'FIXED_GRAVY', isVeg: true, isAvailable: true },

    // PANEER
    { name: 'Kadahi Paneer', description: 'Fresh cottage cheese tossed with bell peppers and crushed coriander seeds', price: 100, category: 'PANEER', isVeg: true, isAvailable: true },
    { name: 'Shahi Paneer', description: 'Rich and creamy paneer preparation in tomato-cashew gravy', price: 100, category: 'PANEER', isVeg: true, isAvailable: true },
    { name: 'Matar Paneer', description: 'Home-style cottage cheese and green peas curry', price: 100, category: 'PANEER', isVeg: true, isAvailable: true },

    // VEGETABLE
    { name: 'Mix Veg', description: 'Assorted seasonal vegetables tossed in dry masala', price: 100, category: 'VEGETABLE', isVeg: true, isAvailable: true },
    { name: 'Seasonal Veg', description: 'Fresh local vegetable of the day (e.g. Aloo Gobi, Bhindi Masala, etc.)', price: 100, category: 'VEGETABLE', isVeg: true, isAvailable: true },
];

async function main() {
    console.log('Clearing existing MenuItems...');
    await prisma.menuItem.deleteMany(); // Since it's a fresh DB, this just ensures safety

    console.log('Seeding V4.0 MenuItems...');
    for (const item of MENU_ITEMS) {
        const createdItem = await prisma.menuItem.create({
            data: item
        });
        console.log(`Created: ${createdItem.category} - ${createdItem.name}`);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        console.log('Seeding complete. V4.0 DB structure ready.');
    });
