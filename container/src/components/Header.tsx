import { NavProps } from "src/layout/LadingLayout";

const Header: React.FC<NavProps> = ({ onSmoothScroll }) => {
    return (
        <header className="bg-white shadow-sm py-4 px-6 md:px-12 flex justify-between items-center fixed w-full z-50 rounded-b-lg">
        <div className="flex items-center space-x-2">
            <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2-1.343-2-3-2zM12 14c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5z"></path>
            </svg>
            <span className="text-2xl font-bold text-gray-900">Smart Manager</span>
        </div>
        <nav className="hidden md:flex space-x-6">
            <div onClick={(e) => onSmoothScroll(e, 'features')} className="text-gray-600 hover:text-indigo-600 transition duration-300 cursor-pointer">Features</div>
            <div onClick={(e) => onSmoothScroll(e, 'finance')} className="text-gray-600 hover:text-indigo-600 transition duration-300 cursor-pointer">Finance</div>
            <div onClick={(e) => onSmoothScroll(e, 'tasks')} className="text-gray-600 hover:text-indigo-600 transition duration-300 cursor-pointer">Tasks</div>
            <div onClick={(e) => onSmoothScroll(e, 'cta')} className="bg-transparent text-gray-600 hover:text-indigo-600 transition duration-300 cursor-pointer">Get Started</div>
        </nav>
        <button className="md:hidden p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
        </button>
    </header>
    );
};
export default Header
