import { useNavigate } from "react-router-dom";

const CallToAction: React.FC = () => {
    const nav = useNavigate();
    return (
        <section id="cta" className="bg-gradient-to-r from-indigo-700 to-purple-800 text-white py-16 md:py-20 text-center rounded-t-3xl">
            <div className="container mx-auto px-6">
                <h2 className="text-3xl md:text-5xl font-extrabold mb-6 reveal-on-scroll">Ready to transform how you manage?</h2>
                <p className="text-lg md:text-xl mb-10 max-w-3xl mx-auto reveal-on-scroll">
                    Join thousands of users who have simplified their lives with our financial and task management tool.
                </p>
                <a onClick={() => {nav('/auth')}} className="cursor-pointer bg-white text-indigo-700 hover:bg-indigo-100 px-10 py-5 rounded-full text-xl font-bold shadow-lg transform hover:scale-110 transition duration-300 inline-block animate-pulse">
                    Sign Up Now
                </a>
            </div>
        </section>
    );
};
export default CallToAction
