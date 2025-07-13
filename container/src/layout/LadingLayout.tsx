import { useCallback, useEffect } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import CallToAction from "../page/CallSection";
import FeaturesSection from "../page/FeaturesSection";
import FinanceSection from "../page/FianceSection";
import HeroSection from "../page/HeroSection";
import TaskSection from "../page/TaskSection";
const GlobalStyles: React.FC = () => (
    <style>
        {`
        body {
            font-family: 'Inter', sans-serif;
            background-color: #f8fafc; /* Light blue-gray background */
            overflow-x: hidden; /* Prevent horizontal scroll */
        }
        /* Custom animations */
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInLeft {
            from { opacity: 0; transform: translateX(-50px); }
            to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInRight {
            from { opacity: 0; transform: translateX(50px); }
            to { opacity: 1; transform: translateX(0); }
        }
        @keyframes scaleUp {
            from { transform: scale(0.9); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
        }
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
        @keyframes float {
            0% { transform: translateY(0px) translateX(0px); }
            25% { transform: translateY(-5px) translateX(5px); }
            50% { transform: translateY(0px) translateX(0px); }
            75% { transform: translateY(5px) translateX(-5px); }
            100% { transform: translateY(0px) translateX(0px); }
        }

        .animate-fadeIn { animation: fadeIn 0.8s ease-out forwards; }
        .animate-slideInLeft { animation: slideInLeft 0.8s ease-out forwards; }
        .animate-slideInRight { animation: slideInRight 0.8s ease-out forwards; }
        .animate-scaleUp { animation: scaleUp 0.6s ease-out forwards; }
        .animate-pulse { animation: pulse 2s infinite ease-in-out; }
        .animate-float { animation: float 6s infinite ease-in-out; } /* Animation for floating circles */

        /* Initial hidden state for scroll animations */
        .reveal-on-scroll {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }
        .reveal-on-scroll.is-visible {
            opacity: 1;
            transform: translateY(0);
        }
        .reveal-on-scroll.slide-left {
            transform: translateX(-50px);
        }
        .reveal-on-scroll.slide-left.is-visible {
            transform: translateX(0);
        }
        .reveal-on-scroll.slide-right {
            transform: translateX(50px);
        }
        .reveal-on-scroll.slide-right.is-visible {
            transform: translateX(0);
        }
        `}
    </style>
);

export interface NavProps {
    onSmoothScroll: (event: React.MouseEvent<HTMLDivElement>, targetId: string) => void;
}

const LandingLayout: React.FC = () => {
    const handleScrollAnimation = useCallback(() => {
        const elements = document.querySelectorAll('.reveal-on-scroll');
        elements.forEach(el => {
            const rect = el.getBoundingClientRect();
            // Check if element is in viewport
            if (rect.top < window.innerHeight - 100 && rect.bottom > 100) {
                el.classList.add('is-visible');
            } else {
                // Optional: remove class if out of view to allow re-animation on scroll back
                // el.classList.remove('is-visible');
            }
        });
    }, []);
    // Callback to handle scroll animations for elements with 'reveal-on-scroll' class
    const handleSmoothScroll = useCallback((event: React.MouseEvent<HTMLDivElement | HTMLAnchorElement>, targetId: string) => {
        event.preventDefault(); // Prevent default anchor click behavior
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80, // Adjust for fixed header height
                behavior: 'smooth'
            });
        }
    }, []);

    // Effect to add and clean up scroll event listener
    useEffect(() => {
        window.addEventListener('scroll', handleScrollAnimation);
        // Initial check on mount
        handleScrollAnimation();
        return () => {
            window.removeEventListener('scroll', handleScrollAnimation);
        };
    }, [handleScrollAnimation]);

    return (
        <div className="text-gray-800">
            <GlobalStyles />
            <Header onSmoothScroll={handleSmoothScroll} />
            <HeroSection />
            <FeaturesSection />
            <FinanceSection />
            <TaskSection />
            <CallToAction />
            <Footer />
        </div>
    );
};

export default LandingLayout;