const prisma = require('../../prisma');

// GET /content/menu — Today's available menu items
const getMenu = async (req, res) => {
    try {
        const items = await prisma.menuItem.findMany({
            where: { isAvailable: true, isArchived: false },
            orderBy: { category: 'asc' }
        });
        res.json({ success: true, data: items });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET /content/testimonials — Static testimonials (hardcoded for MVP)
const getTestimonials = async (req, res) => {
    const testimonials = [
        { id: 1, name: 'Priya Sharma', city: 'Pune', text: 'Best home-cooked food I\'ve ever had. Reminds me of my mother\'s cooking!', rating: 5 },
        { id: 2, name: 'Rahul Mehta', city: 'Mumbai', text: 'Healthy, affordable and always on time. My office lunch game changed completely.', rating: 5 },
        { id: 3, name: 'Sunita Patel', city: 'Pune', text: 'The pause feature is a lifesaver when I travel. No wasted meals!', rating: 5 },
    ];
    res.json({ success: true, data: testimonials });
};

// GET /content/faqs — Static FAQs
const getFAQs = async (req, res) => {
    const faqs = [
        { q: 'What are the delivery timings?', a: 'Lunch is delivered between 12-2 PM and Dinner between 7-9 PM IST.' },
        { q: 'Can I pause my subscription?', a: 'Yes! Pause anytime before 10 PM IST and it takes effect the next day.' },
        { q: 'Is the food 100% vegetarian?', a: 'Yes. Maa Ki Rasoi is strictly pure vegetarian — no eggs, no meat.' },
        { q: 'How do I cancel?', a: 'Contact support via WhatsApp and we\'ll process your refund for remaining meals within 24 hours.' },
    ];
    res.json({ success: true, data: faqs });
};

module.exports = { getMenu, getTestimonials, getFAQs };
