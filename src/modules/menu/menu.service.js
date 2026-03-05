const prisma = require('../../prisma');
const { getISTTimestamp, toIST, startOfISTDay, PAUSE_CUTOFF_HOUR, isAfterCutoff, isISTSunday, addDeliveryDays } = require('../../utils/timeUtils');

/**
 * Gets today's published menu for public consumption.
 * Used by Customer app. Returns formatted JSON.
 */
async function getTodayMenu() {
    const today = startOfISTDay(getISTTimestamp());

    // Safety: If today is Sunday, there is no menu.
    if (isISTSunday(today)) {
        return null;
    }

    const menu = await prisma.dailyMenu.findUnique({
        where: { date: today },
        include: { item1: true, item2: true }
    });

    if (!menu || menu.status !== 'PUBLISHED') {
        return null;
    }

    return {
        date: today.toISOString().split('T')[0],
        tiffin: {
            container1: { name: "Steamed Rice", qty: "1 bowl" },
            container2: { name: "Phulka Roti", qty: "4 pieces" },
            container3: { name: menu.item1.name, qty: "1 bowl" },
            container4: { name: menu.item2.name, qty: "1 bowl" },
            extras: { name: menu.saladNote || "Kachumber Salad", qty: "1 pouch" }
        },
        tag: "100% Pure Veg · Made Fresh · Zero Preservatives"
    };
}

/**
 * Admin: Create a draft DailyMenu
 */
async function createDraftMenu(dateString, item1Id, item2Id, saladNote) {
    // 1. Validate inputs
    if (item1Id === item2Id) throw new Error("Cannot select the same item twice for a daily menu.");

    // Parse date ensuring it's at midnight UTC exactly which maps to the date field
    const date = new Date(dateString);

    if (isNaN(date.getTime())) throw new Error("Invalid date string.");
    if (isISTSunday(date)) throw new Error("Cannot create a menu for Sunday.");

    // 2. Validate items
    const [item1, item2] = await Promise.all([
        prisma.menuItem.findUnique({ where: { id: item1Id } }),
        prisma.menuItem.findUnique({ where: { id: item2Id } })
    ]);

    if (!item1 || !item2) throw new Error("One or both items not found.");
    if (!item1.isActive || !item2.isActive || item1.isArchived || item2.isArchived) throw new Error("One or both items are inactive.");
    if (!item1.isVeg || !item2.isVeg) throw new Error("100% Pure Veg rule violated. Selected item is marked non-veg.");

    // 3. Upsert Draft Menu
    return await prisma.dailyMenu.upsert({
        where: { date },
        update: {
            item1Id,
            item2Id,
            saladNote,
            status: 'DRAFT' // Revert to draft if they edit it
        },
        create: {
            date,
            item1Id,
            item2Id,
            saladNote,
            status: 'DRAFT'
        }
    });
}

/**
 * Admin: Update a draft
 */
async function updateDailyMenu(id, data) {
    if (data.item1Id && data.item2Id && data.item1Id === data.item2Id) {
        throw new Error("Cannot select the same item twice.");
    }

    // Must enforce veg rule if switching items
    if (data.item1Id || data.item2Id) {
        const itemIds = [data.item1Id, data.item2Id].filter(Boolean);
        const items = await prisma.menuItem.findMany({ where: { id: { in: itemIds } } });
        if (items.some(i => !i.isVeg || !i.isActive)) {
            throw new Error("Cannot use inactive or non-veg items.");
        }
    }

    return await prisma.dailyMenu.update({
        where: { id },
        data: {
            ...data,
            status: 'DRAFT' // Always draft when updated
        }
    });
}

/**
 * Admin: Publish Menu
 */
async function publishMenu(id, adminId) {
    return await prisma.dailyMenu.update({
        where: { id },
        data: {
            status: 'PUBLISHED',
            publishedAt: new Date(),
            publishedBy: adminId
        }
    });
}

/**
 * Admin: Get unpublished dates from tomorrow up to next 7 days
 */
async function getUnpublishedDates() {
    const today = startOfISTDay(getISTTimestamp());
    let nextDate = await addDeliveryDays(today, 1);
    const endWindow = await addDeliveryDays(nextDate, 6); // Look a week ahead

    // Fetch existing menus in that window
    const menus = await prisma.dailyMenu.findMany({
        where: {
            date: { gte: nextDate, lte: endWindow }
        }
    });

    const publishedDates = menus.filter(m => m.status === 'PUBLISHED').map(m => m.date.getTime());

    let unpublished = [];
    let current = new Date(nextDate);

    while (current <= endWindow) {
        if (!isISTSunday(current)) {
            if (!publishedDates.includes(current.getTime())) {
                unpublished.push(new Date(current)); // Clone date
            }
        }
        current.setDate(current.getDate() + 1);
    }

    return unpublished;
}

/**
 * Get all Daily menus
 */
async function getDailyMenus(startDate, endDate) {
    return await prisma.dailyMenu.findMany({
        where: {
            date: { gte: startDate, lte: endDate }
        },
        include: { item1: true, item2: true },
        orderBy: { date: 'asc' }
    });
}

module.exports = {
    getTodayMenu,
    createDraftMenu,
    updateDailyMenu,
    publishMenu,
    getUnpublishedDates,
    getDailyMenus
};
