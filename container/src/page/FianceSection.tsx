import { useState } from "react";

const FinanceSection: React.FC = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const financeSlides = [
        {
            image: "https://placehold.co/600x400/a78bfa/ffffff?text=Finance+Overview",
            title: "Comprehensive Financial Overview",
            description: "Gain a complete understanding of your financial health with our intuitive dashboard. Track all your income and expenses in one place.",
            features: [
                "Real-time income and expense tracking.",
                "Categorize transactions for clear insights.",
                "Visual dashboards for quick financial summaries."
            ]
        },
        {
            image: "https://placehold.co/600x400/a78bfa/ffffff?text=Budgeting+Goals",
            title: "Smart Budgeting & Goal Setting",
            description: "Set achievable financial goals and create custom budgets to manage your spending effectively. Stay on track with smart alerts.",
            features: [
                "Create and manage multiple budgets.",
                "Set savings goals for future plans.",
                "Receive alerts for budget overruns."
            ]
        },
        {
            image: "https://placehold.co/600x400/a78bfa/ffffff?text=Investment+Tracking",
            title: "Investment Tracking & Growth",
            description: "Monitor your investments and watch your wealth grow. Get insights into your portfolio performance.",
            features: [
                "Track various investment types.",
                "Visualize portfolio growth.",
                "Performance reports and analytics."
            ]
        }
    ];

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev === financeSlides.length - 1 ? 0 : prev + 1));
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev === 0 ? financeSlides.length - 1 : prev - 1));
    };

    return (
        <section id="finance" className="relative h-screen flex items-center justify-center bg-gradient-to-tl from-indigo-100 to-purple-200 overflow-hidden">
            {/* Background SVG animation */}
            <div className="absolute inset-0 z-0 opacity-20">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="10" cy="10" r="8" fill="url(#financeGrad1)" className="animate-float" style={{ animationDelay: '0s', animationDuration: '7s' }}></circle>
                    <circle cx="90" cy="50" r="12" fill="url(#financeGrad2)" className="animate-float" style={{ animationDelay: '2s', animationDuration: '8s' }}></circle>
                    <circle cx="30" cy="80" r="10" fill="url(#financeGrad3)" className="animate-float" style={{ animationDelay: '4s', animationDuration: '6s' }}></circle>
                    <defs>
                        <radialGradient id="financeGrad1" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(10 10) scale(30)">
                            <stop stopColor="#6366f1" stopOpacity="0.8"/> {/* Indigo-500 */}
                            <stop offset="1" stopColor="#6366f1" stopOpacity="0"/>
                        </radialGradient>
                        <radialGradient id="financeGrad2" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(90 50) scale(40)">
                            <stop stopColor="#a855f7" stopOpacity="0.8"/> {/* Purple-500 */}
                            <stop offset="1" stopColor="#a855f7" stopOpacity="0"/>
                        </radialGradient>
                        <radialGradient id="financeGrad3" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(30 80) scale(35)">
                            <stop stopColor="#8b5cf6" stopOpacity="0.8"/> {/* Violet-500 */}
                            <stop offset="1" stopColor="#8b5cf6" stopOpacity="0"/>
                        </radialGradient>
                    </defs>
                </svg>
            </div>

            <div className="relative w-full h-full flex items-center justify-center"> {/* Container for carousel */}
                {/* Navigation Arrows */}
                <button className="absolute left-4 z-20 p-3 rounded-full bg-white bg-opacity-70 hover:bg-opacity-100 transition-all duration-300 shadow-lg hidden md:block" onClick={prevSlide}>
                    <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                </button>
                <button className="absolute right-4 z-20 p-3 rounded-full bg-white bg-opacity-70 hover:bg-opacity-100 transition-all duration-300 shadow-lg hidden md:block" onClick={nextSlide}>
                    <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                </button>

               {/* Carousel Wrapper */}
                <div className="w-full h-full overflow-hidden">
                    <div
                        className="flex transition-transform duration-700 ease-in-out h-full"
                        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                    >
                        {financeSlides.map((slide, index) => (
                        <div
                            key={index}
                            className="min-w-full flex flex-col md:flex-row items-center justify-center gap-12 px-6 py-12"
                        >
                            {/* Text Content */}
                            <div className="md:w-1/2 reveal-on-scroll slide-left min-w-0">
                            <h2 className="text-3xl md:text-4xl font-extrabold mb-6 text-gray-900">
                                {slide.title}
                            </h2>
                            <p className="text-lg text-gray-700 mb-6">{slide.description}</p>
                            <ul className="list-disc list-inside text-gray-800 space-y-2">
                                {slide.features.map((feature, i) => (
                                <li key={i}>{feature}</li>
                                ))}
                            </ul>
                            </div>

                            {/* Image Content */}
                            <div className="md:w-1/2 flex justify-center reveal-on-scroll slide-right">
                            <img
                                src={slide.image}
                                alt={slide.title}
                                className="rounded-xl shadow-2xl transform hover:scale-105 transition-transform duration-500 max-w-full h-auto"
                            />
                            </div>
                        </div>
                        ))}
                    </div>
                </div>
                {/* Pagination Dots */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
                    {financeSlides.map((_, index) => (
                        <button
                            key={index}
                            className={`w-3 h-3 rounded-full ${currentSlide === index ? 'bg-indigo-600' : 'bg-gray-400'} transition-colors duration-300`}
                            onClick={() => setCurrentSlide(index)}
                        ></button>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FinanceSection
