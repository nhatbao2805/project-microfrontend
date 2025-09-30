// SidebarSubmenu.tsx
import React from 'react';
import { useLocation, Link } from 'react-router-dom';

interface SidebarSubmenuProps {
  label: string;
  icon: React.ReactNode;
  isOpen: boolean;
  expanded: boolean;
  onToggle: () => void;
  basePath: string;
  submenu: { label: string; to: string }[];
}

export const SidebarSubmenu = ({
  label,
  icon,
  isOpen,
  expanded,
  onToggle,
  basePath,
  submenu,
}: SidebarSubmenuProps) => {
  const location = useLocation();
  const isActive = location.pathname.startsWith(basePath);

  return (
    <>
      <button
        onClick={onToggle}
        className={`w-full flex items-center justify-between rounded-md px-3 py-2 transition-colors duration-200 ${
          isActive
            ? 'bg-blue-100 text-blue-700 font-semibold'
            : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
        }`}
      >
        <div className="flex items-center space-x-3">
          <div
            className={`w-5 h-5 ${
              isActive ? 'text-blue-700' : 'text-gray-500'
            }`}
          >
            {icon}
          </div>
          {isOpen && <span>{label}</span>}
        </div>
        {isOpen && (
          <svg
            className={`w-5 h-5 transition-transform duration-300 ${
              expanded ? 'rotate-90' : ''
            }`}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        )}
      </button>

      {expanded && isOpen && (
        <div className="flex flex-col pl-10 space-y-2">
          {submenu.map(({ to, label }) => {
            const isSubActive = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`rounded-md px-3 py-2 transition-colors duration-200 ${
                  isSubActive
                    ? 'bg-blue-200 text-blue-800 font-semibold'
                    : 'text-gray-600 hover:bg-blue-100 hover:text-blue-700'
                }`}
              >
                {label}
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
};
