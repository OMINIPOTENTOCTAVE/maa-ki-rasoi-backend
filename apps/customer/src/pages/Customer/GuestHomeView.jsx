import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Leaf, Truck, ChefHat, Shield, Check, ChevronRight,
    Quote, Star, HelpCircle, Heart
} from 'lucide-react';

// Real images from the ui-updates design guidelines
const IMAGES = {
    hero: 'https://images.unsplash.com/photo-1672477179695-7276b0602fa9?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1ODh8MHwxfHNlYXJjaHwxfHxkZWxpY2lvdXMlMjBpbmRpYW4lMjB0aGFsaSUyMGx1bmNoJTIwZGlubmVyfGVufDB8fHx8MTc3MjcwNjY0MHww&ixlib=rb-4.1.0&q=85',
    heroSecondary: 'https://images.unsplash.com/photo-1591022132290-26a8144bd9c4?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1ODh8MHwxfHNlYXJjaHw0fHxkZWxpY2lvdXMlMjBpbmRpYW4lMjB0aGFsaSUyMGx1bmNoJTIwZGlubmVyfGVufDB8fHx8MTc3MjcwNjY0MHww&ixlib=rb-4.1.0&q=85',
    about: 'https://images.pexels.com/photos/3772534/pexels-photo-3772534.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    menuItem: 'https://images.unsplash.com/photo-1666251214795-a1296307d29c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1ODh8MHwxfHNlYXJjaHwyfHxkZWxpY2lvdXMlMjBpbmRpYW4lMjB0aGFsaSUyMGx1bmNoJTIwZGlubmVyfGVufDB8fHx8MTc3MjcwNjY0MHww&ixlib=rb-4.1.0&q=85',
    testimonialAvatar: 'https://images.unsplash.com/photo-1552901274-4440b5ca43a9?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjY2NjV8MHwxfHNlYXJjaHwzfHxpbmRpYW4lMjBtb3RoZXIlMjBjb29raW5nJTIwa2l0Y2hlbiUyMGhhcHB5fGVufDB8fHx8MTc3MjcwNjY0MXww&ixlib=rb-4.1.0&q=85',
};

export default function GuestHomeView({ onExploreClick }) {
    const navigate = useNavigate();

    const features = [
        { icon: Leaf, title: '100% Pure Veg', desc: 'Authentic vegetarian meals made with fresh ingredients', color: 'text-green-600', bg: 'bg-green-50' },
        { icon: Truck, title: 'Daily Delivery', desc: 'Hot meals delivered to your doorstep on time', color: 'text-blue-600', bg: 'bg-blue-50' },
        { icon: ChefHat, title: 'Home Style', desc: 'Recipes passed down through generations of home cooks', color: 'text-primary', bg: 'bg-primary/10' },
        { icon: Shield, title: 'Zero Preservatives', desc: 'No chemicals, no shortcuts, just pure goodness', color: 'text-purple-600', bg: 'bg-purple-50' },
    ];

    const testimonials = [
        {
            name: 'Priya Sharma',
            role: 'Working Professional',
            text: 'Finally, food that reminds me of home! The dal and sabzi are exactly like my mom makes.',
            rating: 5,
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
        },
        {
            name: 'Rahul Verma',
            role: 'Student',
            text: 'Affordable, healthy, and tasty. Perfect for us students living away from home.',
            rating: 5,
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
        },
        {
            name: 'Anita Gupta',
            role: 'Homemaker',
            text: 'I order for my elderly parents. The portion sizes are perfect and the taste is authentic.',
            rating: 5,
            avatar: IMAGES.testimonialAvatar + '&w=100&h=100&fit=crop',
        },
    ];

    const howItWorks = [
        { step: '1', title: 'Choose Your Plan', desc: 'Select weekly or monthly subscription for lunch, dinner, or both', emoji: '📋' },
        { step: '2', title: 'Pay Security Deposit', desc: '₹500 refundable deposit + plan amount. That\'s it!', emoji: '💳' },
        { step: '3', title: 'Enjoy Daily Meals', desc: 'Fresh, home-cooked meals delivered daily at your preferred time', emoji: '🍱' },
    ];

    const faqs = [
        { q: 'What time do you deliver?', a: 'Lunch is delivered between 12-2 PM and dinner between 7-9 PM. You can customize your delivery slot.' },
        { q: 'Can I pause my subscription?', a: 'Yes! You can pause anytime from your dashboard. Unused meals will be credited to your account.' },
        { q: 'Is the security deposit refundable?', a: 'Absolutely! The ₹500 security deposit is 100% refundable when you end your subscription.' },
        { q: 'What areas do you deliver to?', a: 'We currently deliver across major residential areas. Enter your pincode to check availability.' },
    ];

    const [openFaq, setOpenFaq] = useState(null);

    return (
        <div className="page-transition -mt-8">

            {/* ── HERO ────────────────────────────────────── */}
            <section className="relative flex items-center pt-8 md:pt-16 pb-24 overflow-hidden">
                <div className="absolute inset-0 gradient-warm z-0 opacity-60" />
                {/* Decorative blobs */}
                <div className="absolute top-10 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary/40 rounded-full blur-2xl pointer-events-none" />

                <div className="w-full relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        {/* Left: Copy */}
                        <div className="space-y-8">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 rounded-full shadow-sm border border-border backdrop-blur-sm">
                                <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                                <span className="text-sm font-bold text-muted-foreground tracking-wider uppercase">Authentic · Pure Veg · Daily</span>
                            </div>

                            <h1 className="text-5xl md:text-7xl font-heading font-bold text-foreground leading-[1.05] tracking-tight">
                                Ghar Ka Khana,<br />
                                <span className="text-primary italic">Har Din.</span>
                            </h1>

                            <p className="text-xl text-muted-foreground max-w-lg leading-relaxed">
                                Fresh, wholesome meals made with love — delivered to your doorstep daily.
                                Starting at just <strong className="text-foreground font-bold">₹100/meal</strong>.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    data-testid="cta-view-plans"
                                    onClick={onExploreClick}
                                    className="px-8 py-4 bg-primary text-white rounded-full font-bold text-lg hover:bg-primary/90 active:scale-95 transition-all shadow-xl shadow-primary/30 flex items-center justify-center gap-2 group"
                                >
                                    View Plans
                                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                                <button
                                    data-testid="cta-todays-menu"
                                    onClick={() => navigate('/menu')}
                                    className="px-8 py-4 border-2 border-primary text-primary rounded-full font-bold text-lg hover:bg-primary/5 active:scale-95 transition-all flex items-center justify-center gap-2"
                                >
                                    Today's Menu
                                </button>
                            </div>

                            {/* Social proof pills */}
                            <div className="flex flex-wrap gap-4 pt-2">
                                {['500+ families served', '4.9★ rating', '100% fresh daily'].map((item, i) => (
                                    <span key={i} className="text-sm font-medium text-muted-foreground bg-white/70 border border-border rounded-full px-4 py-1.5 flex items-center gap-1.5 backdrop-blur-sm">
                                        <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Right: Hero image stack */}
                        <div className="relative mt-12 lg:mt-0">
                            {/* Main image */}
                            <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white img-zoom">
                                <img
                                    src={IMAGES.hero}
                                    alt="Delicious Indian Thali"
                                    className="w-full h-[380px] md:h-[520px] object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent" />
                            </div>

                            {/* Secondary floating image */}
                            <div className="absolute -bottom-8 -right-4 md:-right-8 w-36 md:w-48 rounded-2xl overflow-hidden shadow-2xl border-4 border-white img-zoom">
                                <img
                                    src={IMAGES.heroSecondary}
                                    alt="Freshly cooked meal"
                                    className="w-full h-28 md:h-36 object-cover"
                                />
                            </div>

                            {/* Floating badge */}
                            <div className="absolute -bottom-6 -left-2 md:-left-6 bg-white rounded-2xl p-4 shadow-xl animate-float border border-border z-10">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
                                        <Check className="w-6 h-6 text-success" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-foreground">500+ Families</p>
                                        <p className="text-sm text-muted-foreground">Trust us daily</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── FEATURES ────────────────────────────────── */}
            <section className="py-20 bg-white rounded-[2.5rem] -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 shadow-sm border border-border/50">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, i) => (
                        <div
                            key={i}
                            className="p-6 rounded-3xl bg-background border border-border hover:border-primary/30 card-hover text-center group cursor-default"
                            style={{ animationDelay: `${i * 100}ms` }}
                        >
                            <div className={`w-14 h-14 mx-auto mb-4 ${feature.bg} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                                <feature.icon className={`w-7 h-7 ${feature.color}`} />
                            </div>
                            <h3 className="font-heading font-bold text-foreground mb-2">{feature.title}</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── HOW IT WORKS ────────────────────────────── */}
            <section className="py-24">
                <div className="text-center mb-16">
                    <span className="inline-block px-4 py-1.5 bg-secondary text-secondary-foreground text-xs font-bold uppercase tracking-wider rounded-full mb-6">
                        Simple Process
                    </span>
                    <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
                        How It Works
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Getting started is as easy as ordering your favorite dish
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 relative">
                    {/* Connector line on desktop */}
                    <div className="hidden md:block absolute top-16 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-transparent via-border to-transparent" />

                    {howItWorks.map((item, i) => (
                        <div key={i} className="relative z-10 text-center group">
                            <div className="bg-white rounded-[2rem] p-8 shadow-md border border-border card-hover h-full">
                                <div className="w-16 h-16 bg-primary text-white rounded-2xl flex items-center justify-center text-2xl font-heading font-bold mb-6 shadow-lg shadow-primary/25 mx-auto group-hover:scale-110 transition-transform duration-300">
                                    {item.step}
                                </div>
                                <div className="text-3xl mb-4">{item.emoji}</div>
                                <h3 className="text-xl font-heading font-bold text-foreground mb-3">{item.title}</h3>
                                <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── ABOUT / STORY IMAGE ─────────────────────── */}
            <section className="py-20 bg-white rounded-[2.5rem] -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 shadow-sm border border-border/50">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div className="relative rounded-[2rem] overflow-hidden shadow-xl img-zoom order-2 lg:order-1 aspect-[4/3]">
                        <img
                            src={IMAGES.about}
                            alt="Mother cooking with love"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 to-transparent" />
                        <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-sm rounded-2xl p-4 border border-border/50">
                            <div className="flex items-center gap-3">
                                <Heart className="w-6 h-6 text-primary fill-primary" />
                                <div>
                                    <p className="font-bold text-foreground text-sm">Made with Mother's Love</p>
                                    <p className="text-xs text-muted-foreground">Every meal cooked fresh, never frozen</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-6 order-1 lg:order-2">
                        <span className="inline-block px-4 py-1.5 bg-secondary text-secondary-foreground text-xs font-bold uppercase tracking-wider rounded-full">
                            Our Story
                        </span>
                        <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground leading-tight">
                            Ghar ka swaad,<br />
                            <span className="text-primary italic">ab aapke paas.</span>
                        </h2>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            We started Maa Ki Rasoi because we missed the warmth of home-cooked food.
                            Every recipe is authentic, every ingredient is fresh, and every meal is made
                            with the same care a mother gives to her family.
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                            {[['500+', 'Happy Families'], ['100%', 'Pure Veg'], ['5★', 'Avg Rating'], ['0', 'Preservatives']].map(([num, label]) => (
                                <div key={label} className="bg-background rounded-2xl p-4 border border-border text-center">
                                    <p className="text-2xl font-heading font-bold text-primary">{num}</p>
                                    <p className="text-sm text-muted-foreground font-medium">{label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── CTA ─────────────────────────────────────── */}
            <section className="py-20 bg-primary rounded-[2.5rem] -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 mt-8 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -mr-40 -mt-40" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl -ml-32 -mb-32" />
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <div className="text-4xl mb-6">🍱</div>
                    <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">
                        Start Your Healthy Journey
                    </h2>
                    <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
                        Join hundreds of happy families enjoying authentic home-cooked meals every day.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            data-testid="cta-sign-up"
                            onClick={() => navigate('/login')}
                            className="px-8 py-4 bg-white text-primary rounded-full font-bold text-lg hover:bg-white/90 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-xl"
                        >
                            Start Free Trial
                            <ChevronRight className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => navigate('/menu')}
                            className="px-8 py-4 border-2 border-white/50 text-white rounded-full font-bold text-lg hover:bg-white/10 active:scale-95 transition-all"
                        >
                            See Today's Menu
                        </button>
                    </div>
                </div>
            </section>

            {/* ── TESTIMONIALS ────────────────────────────── */}
            <section className="py-24">
                <div className="text-center mb-16">
                    <span className="inline-block px-4 py-1.5 bg-secondary text-secondary-foreground text-xs font-bold uppercase tracking-wider rounded-full mb-6">
                        Customer Love
                    </span>
                    <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
                        What Our Customers Say
                    </h2>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((t, i) => (
                        <div key={i} className="bg-white rounded-[2rem] p-8 border border-border shadow-sm card-hover flex flex-col">
                            <Quote className="w-10 h-10 text-primary/20 mb-4 flex-shrink-0" />
                            <p className="text-foreground mb-6 italic text-lg leading-relaxed flex-1">"{t.text}"</p>
                            <div className="flex gap-1 mb-4">
                                {[...Array(t.rating)].map((_, j) => (
                                    <Star key={j} className="w-4 h-4 fill-primary text-primary" />
                                ))}
                            </div>
                            <div className="flex items-center gap-4 pt-4 border-t border-border">
                                <img
                                    src={t.avatar}
                                    alt={t.name}
                                    className="w-12 h-12 rounded-full object-cover border-2 border-border"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        const fallback = e.target.parentElement.querySelector('.avatar-placeholder');
                                        if (fallback) fallback.style.display = 'flex';
                                    }}
                                />
                                <div
                                    className="avatar-placeholder w-12 h-12 bg-primary/10 rounded-full items-center justify-center text-primary font-heading font-bold text-xl hidden"
                                    aria-hidden="true"
                                >
                                    {t.name ? t.name[0] : '?'}
                                </div>
                                <div>
                                    <p className="font-bold text-foreground">{t.name}</p>
                                    <p className="text-sm text-muted-foreground">{t.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── FAQ ─────────────────────────────────────── */}
            <section className="pb-24 pt-8">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-16">
                        <span className="inline-block px-4 py-1.5 bg-secondary text-secondary-foreground text-xs font-bold uppercase tracking-wider rounded-full mb-6">
                            Got Questions?
                        </span>
                        <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
                            Frequently Asked Questions
                        </h2>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq, i) => (
                            <div
                                key={i}
                                className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm hover:border-primary/30 hover:shadow-md transition-all duration-200"
                            >
                                <button
                                    data-testid={`faq-${i}`}
                                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                    className="w-full flex items-center justify-between p-6 text-left"
                                >
                                    <span className="font-bold text-foreground flex items-center gap-3 text-lg">
                                        <HelpCircle className="w-5 h-5 text-primary flex-shrink-0" />
                                        {faq.q}
                                    </span>
                                    <span className={`transform transition-transform duration-300 flex-shrink-0 ml-4 ${openFaq === i ? 'rotate-90' : ''}`}>
                                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                                    </span>
                                </button>
                                {openFaq === i && (
                                    <div className="px-6 pb-6 text-muted-foreground animate-fade-in text-base leading-relaxed pl-14">
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
