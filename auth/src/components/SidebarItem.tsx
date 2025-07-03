// SidebarItem.tsx
import { Link, useLocation } from 'react-router-dom';

interface SidebarItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isOpen: boolean;
}

export const SidebarItem = ({ to, icon, label, isOpen }: SidebarItemProps) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`flex items-center space-x-3 rounded-md px-3 py-2 transition-colors duration-200 ${
        isActive
          ? 'bg-blue-100 text-blue-700 font-semibold'
          : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
      }`}
    >
      <div
        className={`w-5 h-5 ${isActive ? 'text-blue-700' : 'text-gray-500'}`}
      >
        {icon}
      </div>
      {isOpen && <span>{label}</span>}
    </Link>
  );
};
