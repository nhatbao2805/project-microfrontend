import React from "react";
import { useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface SidebarSubmenuProps {
  label: string;
  icon: React.ReactNode;
  isOpen: boolean;
  expanded: boolean;
  onToggle: () => void;
  basePath: string;
  submenu: { label: string; to: string }[];
  badge?: string;
}

export const SidebarSubmenu = ({
  label,
  icon,
  isOpen,
  expanded,
  onToggle,
  basePath,
  submenu,
  badge,
}: SidebarSubmenuProps) => {
  const location = useLocation();
  const isActive = location.pathname.startsWith(basePath);

  return (
    <div className="space-y-1">
      <motion.button
        onClick={onToggle}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`
          w-full flex items-center justify-between rounded-xl px-3 py-2.5 transition-all duration-200 group relative
          ${
            isActive
              ? "bg-blue-50 text-blue-600 font-semibold"
              : "text-gray-700 hover:bg-blue-50/50 hover:text-blue-600"
          }
        `}
      >
        {/* Active indicator */}
        {isActive && (
          <motion.div
            layoutId="submenuActiveIndicator"
            className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-r-full"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}

        <div className="flex items-center space-x-3 flex-1">
          <div
            className={`flex-shrink-0 transition-colors duration-200 ${
              isActive
                ? "text-blue-600"
                : "text-gray-500 group-hover:text-blue-600"
            }`}
          >
            {icon}
          </div>

          <motion.span
            initial={false}
            animate={{ opacity: isOpen ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            className={`
              flex-1 truncate transition-colors duration-200
              ${!isOpen ? "absolute left-0 opacity-0" : ""}
            `}
          >
            {label}
          </motion.span>

          {/* Badge */}
          {badge && isOpen && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full font-medium"
            >
              {badge}
            </motion.span>
          )}
        </div>

        {isOpen && (
          <motion.div
            animate={{ rotate: expanded ? 90 : 0 }}
            transition={{ duration: 0.2 }}
            className="flex-shrink-0 ml-2"
          >
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </motion.div>
        )}

        {/* Tooltip for collapsed state */}
        {!isOpen && (
          <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
            {label}
            {badge && (
              <span className="ml-1 bg-blue-500 text-white text-xs px-1 py-0.5 rounded">
                {badge}
              </span>
            )}
          </div>
        )}
      </motion.button>

      <AnimatePresence>
        {expanded && isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="flex flex-col ml-6 space-y-1 border-l-2 border-gray-200 pl-4">
              {submenu.map(({ to, label }, index) => {
                const isSubActive = location.pathname === to;
                return (
                  <motion.div
                    key={to}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      to={to}
                      className={`
                        block rounded-lg px-3 py-2 text-sm transition-all duration-200 group relative
                        ${
                          isSubActive
                            ? "bg-blue-100 text-blue-700 font-medium border-l-2 border-blue-500 -ml-2 pl-5"
                            : "text-gray-600 hover:bg-blue-50 hover:text-blue-600 hover:border-l-2 hover:border-blue-300 -ml-2 hover:pl-5"
                        }
                      `}
                    >
                      <span className="flex items-center">
                        <div
                          className={`
                          w-1.5 h-1.5 rounded-full mr-3 transition-colors duration-200
                          ${
                            isSubActive
                              ? "bg-blue-500"
                              : "bg-gray-400 group-hover:bg-blue-400"
                          }
                        `}
                        />
                        {label}
                      </span>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
