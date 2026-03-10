/**
 * Maa Ki Rasoi — Single Source of Truth for Pricing
 */

export const PLANS = {
    Basic: {
        id: 'Basic',
        title: 'Basic Plan',
        subtitle: '1 meal per day',
        duration: 30,
        totalPrice: 1999,
        badge: null,
        features: [
            '30 meals included',
            'Daily doorstep delivery',
            'Pure veg home-style food',
        ],
    },
    Standard: {
        id: 'Standard',
        title: 'Standard Plan',
        subtitle: '2 meals per day',
        duration: 30,
        totalPrice: 3499,
        badge: 'Most Popular',
        features: [
            '60 meals included',
            'Lunch & Dinner delivery',
            'Save ₹499 vs Basic',
        ],
    },
    Premium: {
        id: 'Premium',
        title: 'Premium Plan',
        subtitle: '3 meals per day',
        duration: 30,
        totalPrice: 5999,
        badge: 'Best Value',
        features: [
            '90 meals included',
            'Morning, Lunch & Dinner',
            'Maximum savings',
        ],
    }
};

export const MEAL_TYPES = {
    Lunch: { id: 'Lunch', label: 'Lunch', icon: '☀️' },
    Dinner: { id: 'Dinner', label: 'Dinner', icon: '🌙' },
};

export function computePrice(planType) {
    const plan = PLANS[planType];
    return plan ? plan.totalPrice : 0;
}

export const GST_RATE = 0; // GST is omitted for now or you can put 0.05 

export const SUPPORT_WHATSAPP = '917428020104';

export const DIETARY_PREFERENCE = 'Veg';
