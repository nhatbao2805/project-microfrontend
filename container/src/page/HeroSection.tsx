const HeroSection: React.FC = () => {
    return (
        <section className="relative bg-gradient-to-r from-blue-700 to-purple-800 text-white py-24 md:py-32 flex items-center justify-center min-h-screen rounded-b-3xl overflow-hidden">
            <div className="container mx-auto px-6 text-center z-10">
                <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
                    Manage Your Finances & Tasks <br className="hidden md:block" /> Smartly
                </h1>
                <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto animate-fadeIn" style={{ animationDelay: '0.4s' }}>
                    Take control of your money and get things done more efficiently with our comprehensive tool.
                </p>
                <div className="space-x-4 animate-fadeIn" style={{ animationDelay: '0.6s' }}>
                    <a href="#cta" className="bg-white text-indigo-700 hover:bg-indigo-100 px-8 py-4 rounded-full text-lg font-semibold shadow-lg transform hover:scale-105 transition duration-300 inline-block animate-pulse">
                        Start Free
                    </a>
                    <a href="#features" className="border border-white text-white hover:bg-white hover:text-indigo-700 px-8 py-4 rounded-full text-lg font-semibold transform hover:scale-105 transition duration-300 inline-block">
                        Learn More
                    </a>
                </div>
            </div>
            {/* Background elements for visual appeal */}
            <div className="absolute inset-0 z-0 opacity-30"> {/* Increased opacity */}
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="20" cy="20" r="15" fill="url(#grad1)" className="animate-float" style={{ animationDelay: '0s' }}></circle>
                    <circle cx="80" cy="30" r="20" fill="url(#grad2)" className="animate-float" style={{ animationDelay: '1s' }}></circle>
                    <circle cx="40" cy="70" r="10" fill="url(#grad3)" className="animate-float" style={{ animationDelay: '2s' }}></circle>
                    <circle cx="60" cy="90" r="18" fill="url(#grad4)" className="animate-float" style={{ animationDelay: '3s' }}></circle>
                    <defs>
                        <radialGradient id="grad1" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(20 20) scale(50)"> {/* Increased scale */}
                            <stop stopColor="#fff" stopOpacity="0.8"/>
                            <stop offset="1" stopColor="#fff" stopOpacity="0"/>
                        </radialGradient>
                        <radialGradient id="grad2" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(80 30) scale(60)"> {/* Increased scale */}
                            <stop stopColor="#fff" stopOpacity="0.8"/>
                            <stop offset="1" stopColor="#fff" stopOpacity="0"/>
                        </radialGradient>
                        <radialGradient id="grad3" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(40 70) scale(40)"> {/* Increased scale */}
                            <stop stopColor="#fff" stopOpacity="0.8"/>
                            <stop offset="1" stopColor="#fff" stopOpacity="0"/>
                        </radialGradient>
                        <radialGradient id="grad4" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(60 90) scale(55)"> {/* Increased scale */}
                            <stop stopColor="#fff" stopOpacity="0.8"/>
                            <stop offset="1" stopColor="#fff" stopOpacity="0"/>
                        </radialGradient>
                    </defs>
                </svg>
            </div>
        </section>
    );
};
export default HeroSection;