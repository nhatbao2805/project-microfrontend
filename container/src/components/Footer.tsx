const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-900 text-gray-300 py-10 px-6 md:px-12">
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
                <div>
                    <h3 className="text-xl font-semibold text-white mb-4">Smart Manager</h3>
                    <p className="text-gray-400">Your all-in-one solution for personal finance and efficient task management.</p>
                </div>
                <div>
                    <h3 className="text-xl font-semibold text-white mb-4">Quick Links</h3>
                    <ul className="space-y-2">
                        <li><a href="#features" className="text-gray-400 hover:text-indigo-400 transition duration-300">Features</a></li>
                        <li><a href="#finance" className="text-gray-400 hover:text-indigo-400 transition duration-300">Finance Management</a></li>
                        <li><a href="#tasks" className="text-gray-400 hover:text-indigo-400 transition duration-300">Task Management</a></li>
                        <li><a href="#cta" className="text-gray-400 hover:text-indigo-400 transition duration-300">Get Started</a></li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-xl font-semibold text-white mb-4">Contact Us</h3>
                    <p className="text-gray-400">Email: support@smartmanager.com</p>
                    <p className="text-gray-400">Phone: (123) 456-7890</p>
                    <div className="flex justify-center md:justify-start space-x-4 mt-4">
                        {/* Social Media Icons (placeholders) */}
                        <a href="#" className="text-gray-400 hover:text-indigo-400 transition duration-300">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.776-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.247 0-1.649.773-1.649 1.57V12h2.773l-.443 2.89h-2.33V22C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                            </svg>
                        </a>
                        <a href="#" className="text-gray-400 hover:text-indigo-400 transition duration-300">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M8.29 20.251c-1.091.597-2.35 1.01-3.69 1.01-3.321 0-6-2.679-6-6 0-1.295.402-2.493 1.09-3.473C.683 10.373 0 9.278 0 8.051c0-2.203 1.797-4 4-4 1.173 0 2.233.513 2.973 1.343C7.457 4.93 8.163 4.5 9 4.5c2.203 0 4 1.797 4 4 0 1.295-.402 2.493-1.09 3.473.683 1.002 1.09 2.157 1.09 3.473 0 3.321-2.679 6-6 6zM12 12c0-3.321-2.679-6-6-6s-6 2.679-6 6 2.679 6 6 6 6-2.679 6-6z" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
            <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-500 text-sm">
                &copy; {new Date().getFullYear()} Smart Manager. All rights reserved.
            </div>
        </footer>
    );
};
export default Footer
