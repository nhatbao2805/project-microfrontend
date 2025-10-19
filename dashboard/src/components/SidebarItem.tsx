import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

interface SidebarItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isOpen: boolean;
  isActive?: boolean;
  variant?: "default" | "quick";
  badge?: string;
}

export const SidebarItem = ({
  to,
  icon,
  label,
  isOpen,
  isActive: forceActive,
  variant = "default",
  badge,
}: SidebarItemProps) => {
  const location = useLocation();
  const isActive = forceActive || location.pathname === to;

  const getVariantStyles = () => {
    if (variant === "quick") {
      return {
        base: "text-gray-600 hover:text-gray-900 hover:bg-gray-100",
        active: "text-blue-600 bg-blue-50",
        icon: "text-gray-500",
        iconActive: "text-blue-600",
      };
    }

    return {
      base: "text-gray-700 hover:text-blue-600 hover:bg-blue-50/50",
      active: "text-blue-600 bg-blue-50 font-semibold",
      icon: "text-gray-500",
      iconActive: "text-blue-600",
    };
  };

  const styles = getVariantStyles();

  return (
    <Link to={to} className="block">
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`
          relative flex items-center space-x-3 rounded-xl px-3 py-2.5 transition-all duration-200 group
          ${isActive ? styles.active : styles.base}
          ${variant === "quick" ? "text-sm" : ""}
        `}
      >
        {/* Active indicator */}
        {isActive && variant === "default" && (
          <motion.div
            layoutId="activeIndicator"
            className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-r-full"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}

        {/* Icon */}
        <div
          className={`
          flex-shrink-0 transition-colors duration-200
          ${isActive ? styles.iconActive : styles.icon}
        `}
        >
          {icon}
        </div>

        {/* Label */}
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
      </motion.div>
    </Link>
  );
};
