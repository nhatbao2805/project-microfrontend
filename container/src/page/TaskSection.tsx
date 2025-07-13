import { useState } from "react";

const TaskSection: React.FC = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const taskSlides = [
        {
            image: "https://placehold.co/600x400/818cf8/ffffff?text=Task+Board+View",
            title: "Flexible Task Boards",
            description: "Organize your personal and team projects with highly customizable boards, lists, and cards. Drag and drop tasks effortlessly.",
            features: [
                "Unlimited boards and lists for any project.",
                "Intuitive drag-and-drop interface.",
                "Visualizing workflow progress."
            ]
        },
        {
            image: "https://placehold.co/600x400/818cf8/ffffff?text=Reminders+Collaboration",
            title: "Reminders & Seamless Collaboration",
            description: "Never miss a deadline with smart reminders. Collaborate effectively by assigning tasks and attaching files directly to cards.",
            features: [
                "Smart reminder system for due dates.",
                "Attach files and add detailed notes.",
                "Assign tasks and collaborate with ease."
            ]
        },
        {
            image: "https://placehold.co/600x400/818cf8/ffffff?text=Custom+Workflows",
            title: "Custom Workflows & Automation",
            description: "Tailor your task management to fit your unique needs with custom workflows and automation rules.",
            features: [
                "Define custom stages for tasks.",
                "Automate repetitive actions.",
                "Integrate with other tools."
            ]
        }
    ];

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev === taskSlides.length - 1 ? 0 : prev + 1));
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev === 0 ? taskSlides.length - 1 : prev - 1));
    };

    return (
        <section id="tasks" className="relative h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-200 overflow-hidden">
            {/* Background SVG animation */}
            <div className="absolute inset-0 z-0 opacity-20">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="85" cy="15" r="10" fill="url(#taskGrad1)" className="animate-float" style={{ animationDelay: '0s', animationDuration: '6s' }}></circle>
                    <circle cx="15" cy="60" r="14" fill="url(#taskGrad2)" className="animate-float" style={{ animationDelay: '3s', animationDuration: '7s' }}></circle>
                    <circle cx="70" cy="95" r="9" fill="url(#taskGrad3)" className="animate-float" style={{ animationDelay: '1s', animationDuration: '8s' }}></circle>
                    <defs>
                        <radialGradient id="taskGrad1" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(85 15) scale(35)">
                            <stop stopColor="#a855f7" stopOpacity="0.8"/> {/* Purple-500 */}
                            <stop offset="1" stopColor="#a855f7" stopOpacity="0"/>
                        </radialGradient>
                        <radialGradient id="taskGrad2" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(15 60) scale(45)">
                            <stop stopColor="#6366f1" stopOpacity="0.8"/> {/* Indigo-500 */}
                            <stop offset="1" stopColor="#6366f1" stopOpacity="0"/>
                        </radialGradient>
                        <radialGradient id="taskGrad3" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(70 95) scale(30)">
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

                {/* Carousel Content */}
                <div className="w-full h-full overflow-hidden">
                    <div className="flex transition-transform duration-500 ease-in-out h-full" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                        {taskSlides.map((slide, index) => (
                            <div key={index} className="w-full flex-shrink-0 container mx-auto px-6 flex flex-col md:flex-row-reverse items-center gap-12 z-10 relative h-full justify-center">
                                {/* Slide content (image and text) */}
                                <div className="md:w-1/2 reveal-on-scroll slide-right">
                                    <h2 className="text-3xl md:text-4xl font-extrabold mb-6 text-gray-900">{slide.title}</h2>
                                    <p className="text-lg text-gray-700 mb-6">{slide.description}</p>
                                    <ul className="list-disc list-inside text-gray-800 space-y-2">
                                        {slide.features.map((feature, i) => <li key={i}>{feature}</li>)}
                                    </ul>
                                </div>
                                <div className="md:w-1/2 flex justify-center reveal-on-scroll slide-left">
                                    <img src={slide.image} alt={slide.title} className="rounded-xl shadow-2xl transform hover:scale-105 transition-transform duration-500" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Pagination Dots */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
                    {taskSlides.map((_, index) => (
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
export default TaskSection
