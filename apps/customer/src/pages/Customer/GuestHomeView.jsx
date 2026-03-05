import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Leaf, Truck, ChefHat, Shield, Check, ChevronRight,
    Quote, Star, HelpCircle
} from 'lucide-react';

export default function GuestHomeView({ onExploreClick }) {
    const navigate = useNavigate();

    const features = [
        { icon: Leaf, title: '100% Pure Veg', desc: 'Authentic vegetarian meals made with fresh ingredients' },
        { icon: Truck, title: 'Daily Delivery', desc: 'Hot meals delivered to your doorstep on time' },
        { icon: ChefHat, title: 'Home Style', desc: 'Recipes passed down through generations of home cooks' },
        { icon: Shield, title: 'Zero Preservatives', desc: 'No chemicals, no shortcuts, just pure goodness' },
    ];

    const testimonials = [
        { name: 'Priya Sharma', role: 'Working Professional', text: 'Finally, food that reminds me of home! The dal and sabzi are exactly like my mom makes.', rating: 5 },
        { name: 'Rahul Verma', role: 'Student', text: 'Affordable, healthy, and tasty. Perfect for us students living away from home.', rating: 5 },
        { name: 'Anita Gupta', role: 'Homemaker', text: 'I order for my elderly parents. The portion sizes are perfect and the taste is authentic.', rating: 5 },
    ];

    const howItWorks = [
        { step: '1', title: 'Choose Your Plan', desc: 'Select weekly or monthly subscription for lunch, dinner, or both' },
        { step: '2', title: 'Pay Security Deposit', desc: '₹500 refundable deposit + plan amount. That\'s it!' },
        { step: '3', title: 'Enjoy Daily Meals', desc: 'Fresh, home-cooked meals delivered daily at your preferred time' },
    ];

    const faqs = [
        { q: 'What time do you deliver?', a: 'Lunch is delivered between 12-1 PM and dinner between 7-8 PM. You can customize your delivery slot.' },
        { q: 'Can I pause my subscription?', a: 'Yes! You can pause anytime from your dashboard. Unused meals will be credited to your account.' },
        { q: 'Is the security deposit refundable?', a: 'Absolutely! The ₹500 security deposit is 100% refundable when you end your subscription.' },
        { q: 'What areas do you deliver to?', a: 'We currently deliver across major residential areas. Enter your pincode to check availability.' },
    ];

    const [openFaq, setOpenFaq] = useState(null);

    return (
        <div className="page-transition -mt-8">
            {/* Hero Section */}
            <section className="relative flex items-center pt-8 md:pt-16 pb-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-secondary/30 to-background z-0"></div>
                <div className="w-full relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-border">
                                <span className="text-sm font-medium text-muted-foreground">AUTHENTIC</span>
                                <span className="w-1 h-1 bg-primary rounded-full"></span>
                                <span className="text-sm font-medium text-muted-foreground">PURE VEG</span>
                                <span className="w-1 h-1 bg-primary rounded-full"></span>
                                <span className="text-sm font-medium text-muted-foreground">DAILY</span>
                            </div>

                            <h1 className="text-5xl md:text-7xl font-heading font-bold text-foreground leading-tight">
                                Ghar Ka Khana,<br />
                                <span className="text-primary italic">Har Din.</span>
                            </h1>

                            <p className="text-xl text-muted-foreground max-w-lg">
                                Fresh, wholesome meals made with love — delivered to your doorstep daily. Starting at just <strong className="text-foreground">₹100/meal</strong>.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={onExploreClick}
                                    className="px-8 py-4 bg-primary text-white rounded-full font-semibold text-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/30 flex items-center justify-center gap-2"
                                >
                                    View Plans
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => navigate('/menu')}
                                    className="px-8 py-4 border-2 border-primary text-primary rounded-full font-semibold text-lg hover:bg-primary/5 transition-all flex items-center justify-center gap-2"
                                >
                                    Today's Menu
                                </button>
                            </div>
                        </div>

                        <div className="relative mt-12 lg:mt-0">
                            <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white">
                                <img
                                    src="https://images.unsplash.com/photo-1672477179695-7276b0602fa9?w=800"
                                    alt="Delicious Indian Thali"
                                    className="w-full h-[350px] md:h-[500px] object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent"></div>
                            </div>
                            {/* Floating badge */}
                            <div className="absolute -bottom-6 -left-2 md:-left-6 bg-white rounded-2xl p-4 shadow-xl animate-float border border-border">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
                                        <Check className="w-6 h-6 text-success" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-foreground">500+ Families</p>
                                        <p className="text-sm text-muted-foreground">Trust us daily</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-white rounded-[2.5rem] -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 mt-4 shadow-sm border border-border/50">
                <div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, i) => (
                            <div
                                key={i}
                                className="p-6 rounded-3xl bg-background border border-border hover:border-primary/30 transition-all card-hover text-center"
                                style={{ animationDelay: `${i * 100}ms` }}
                            >
                                <div className="w-14 h-14 mx-auto mb-4 bg-primary/10 rounded-xl flex items-center justify-center">
                                    <feature.icon className="w-7 h-7 text-primary" />
                                </div>
                                <h3 className="font-heading font-semibold text-foreground mb-2">{feature.title}</h3>
                                <p className="text-sm text-muted-foreground">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-24">
                <div>
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
                            How It Works
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Getting started is as easy as ordering your favorite dish
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 relative">
                        {howItWorks.map((item, i) => (
                            <div key={i} className="relative z-10">
                                <div className="bg-white rounded-[2rem] p-8 shadow-md border border-border card-hover h-full">
                                    <div className="w-16 h-16 bg-primary text-white rounded-2xl flex items-center justify-center text-2xl font-heading font-bold mb-6 shadow-md shadow-primary/20">
                                        {item.step}
                                    </div>
                                    <h3 className="text-xl font-heading font-semibold text-foreground mb-3">{item.title}</h3>
                                    <p className="text-muted-foreground">{item.desc}</p>
                                </div>
                                {i < 2 && (
                                    <div className="hidden md:block absolute top-1/2 -right-6 transform -translate-y-1/2 z-0">
                                        <ChevronRight className="w-10 h-10 text-primary/20" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-primary rounded-[2.5rem] -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 mt-4 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl -ml-32 -mb-32"></div>
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">
                        Start Your Healthy Journey
                    </h2>
                    <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
                        Join hundreds of happy families enjoying authentic home-cooked meals every day.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => navigate('/login')}
                            className="px-8 py-4 bg-white text-primary rounded-full font-semibold text-lg hover:bg-white/90 transition-all flex items-center justify-center gap-2 shadow-lg"
                        >
                            Sign Up Now
                        </button>
                        <button
                            onClick={() => navigate('/menu')}
                            className="px-8 py-4 border-2 border-white/50 text-white rounded-full font-semibold text-lg hover:bg-white/10 transition-all"
                        >
                            Learn More
                        </button>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-24">
                <div>
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
                            What Our Customers Say
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {testimonials.map((t, i) => (
                            <div key={i} className="bg-white rounded-[2rem] p-8 border border-border shadow-sm card-hover">
                                <Quote className="w-10 h-10 text-primary/20 mb-4" />
                                <p className="text-foreground mb-6 italic text-lg leading-relaxed">"{t.text}"</p>
                                <div className="flex items-center gap-4 mt-auto">
                                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-heading font-bold text-xl">
                                        {t.name[0]}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-foreground">{t.name}</p>
                                        <p className="text-sm text-muted-foreground">{t.role}</p>
                                    </div>
                                </div>
                                <div className="flex gap-1 mt-4">
                                    {[...Array(t.rating)].map((_, j) => (
                                        <Star key={j} className="w-4 h-4 fill-primary text-primary" />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="pb-24 pt-8">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
                            Frequently Asked Questions
                        </h2>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq, i) => (
                            <div
                                key={i}
                                className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm hover:border-primary/30 transition-colors"
                            >
                                <button
                                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                    className="w-full flex items-center justify-between p-6 text-left hover:bg-background/50 transition-colors"
                                >
                                    <span className="font-semibold text-foreground flex items-center gap-3 text-lg">
                                        <HelpCircle className="w-5 h-5 text-primary flex-shrink-0" />
                                        {faq.q}
                                    </span>
                                    <span className={`transform transition-transform ${openFaq === i ? 'rotate-180' : ''}`}>
                                        <ChevronRight className="w-5 h-5 text-muted-foreground rotate-90" />
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



