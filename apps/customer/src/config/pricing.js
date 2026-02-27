/**
 * Maa Ki Rasoi — Single Source of Truth for Pricing
 * 
 * ALL plan prices, durations, and discounts are defined here.
 * Every component must import from this file instead of hardcoding prices.
 */

export const PLANS = {
    Weekly: {
        id: 'Weekly',
        title: 'Weekly Trial',
        subtitle: 'Perfect for testing the taste',
        duration: 7,
        perMealPrice: 114,
        totalPrice: 800,
        description: '7 days of daily meals',
        badge: null,
        features: [
            '7 meals included',
            'Daily doorstep delivery',
            'Pure veg home-style food',
        ],
    },
    Monthly: {
        id: 'Monthly',
        title: 'Monthly Standard',
        subtitle: 'Our most popular plan',
        duration: 30,
        perMealPrice: 100,
        totalPrice: 3000,
        description: '30 days — Maximum savings',
        badge: 'Best Value',
        features: [
            '30 meals included',
            'Free delivery every day',
            'Save ₹420 vs weekly',
            'Priority delivery slot',
        ],
    },
};

export const MEAL_TYPES = {
    Lunch: { id: 'Lunch', label: 'Lunch', icon: '☀️' },
    Dinner: { id: 'Dinner', label: 'Dinner', icon: '🌙' },
    Both: { id: 'Both', label: 'Lunch + Dinner', icon: '🍽️' },
};

/**
 * Compute the final price for a given plan + meal combination.
 * Both meals = 1.85x (15% combo discount)
 */
export function computePrice(planType, mealType) {
    const plan = PLANS[planType];
    if (!plan) return 0;
    const mealsPerDay = mealType === 'Both' ? 2 : 1;
    const comboDiscount = mealType === 'Both' ? 0.85 : 1;
    return Math.round(plan.totalPrice * mealsPerDay * comboDiscount);
}

/**
 * GST rate applied at checkout (5%)
 */
export const GST_RATE = 0.05;

/**
 * Format a price with GST for display.
 * Returns { subtotal, gst, total } — all as formatted strings.
 */
export function computePriceWithGST(planType, mealType) {
    const subtotal = computePrice(planType, mealType);
    const gst = Math.round(subtotal * GST_RATE);
    const total = subtotal + gst;
    return {
        subtotal: subtotal.toFixed(2),
        gst: gst.toFixed(2),
        total: total.toFixed(2),
        subtotalRaw: subtotal,
        gstRaw: gst,
        totalRaw: total,
    };
}

/**
 * WhatsApp support number — used across the app
 */
export const SUPPORT_WHATSAPP = '917428020104';

/**
 * Dietary preference (hardcoded to Pure Veg)
 */
export const DIETARY_PREFERENCE = 'Veg';
