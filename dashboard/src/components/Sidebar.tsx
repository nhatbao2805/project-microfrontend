import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SidebarItem } from "./SidebarItem";
import { SidebarSubmenu } from "./SidebarSubmenu";
import {
  Home,
  FileText,
  FolderOpen,
  Kanban,
  Settings,
  BarChart3,
  Users,
  Package,
  ChevronLeft,
  ChevronRight,
  Zap,
  ListIcon,
  FileTextIcon,
  Calendar,
} from "lucide-react";

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

interface SidebarMenuItem {
  key: string;
  label: string;
  icon: React.ReactNode;
  basePath: string;
  submenu: { to: string; label: string }[];
  badge?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed = false, onToggle }) => {
  const [submenuOpen, setSubmenuOpen] = useState<Record<string, boolean>>({
    invoice: false,
    category: false,
    board: false,
    schedule: false,
  });

  const toggleSubmenu = (key: string) => {
    setSubmenuOpen((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const sidebarMenus: SidebarMenuItem[] = [
    {
      key: "invoice",
      label: "Hóa đơn",
      icon: <FileTextIcon />,
      basePath: "/dashboard/invoice",
      submenu: [
        { to: "/invoice/list", label: "Danh sách" },
        { to: "/invoice/new", label: "Tạo mới" },
      ],
    },
    {
      key: "category",
      label: "Danh mục",
      icon: <ListIcon />,
      basePath: "/invoice/category",
      submenu: [
        { to: "/invoice/category/list", label: "Danh sách" },
        { to: "/invoice/category/new", label: "Tạo mới" },
      ],
    },
    {
      key: "board",
      label: "Kanban Board",
      icon: <Kanban className="h-5 w-5" />,
      basePath: "/dashboard/board",
      submenu: [
        { to: "/board/list", label: "All Boards" },
        { to: "/board/new", label: "Create Board" },
      ],
    },
    {
      key: "schedule",
      label: "Schedule",
      icon: <Calendar className="h-5 w-5" />,
      basePath: "/dashboard/schedule",
      submenu: [{ to: "/schedule", label: "Calendar" }],
    },
    {
      key: "analytics",
      label: "Analytics",
      icon: <BarChart3 className="h-5 w-5" />,
      basePath: "/dashboard/analytics",
      submenu: [
        { to: "/analytics/overview", label: "Overview" },
        { to: "/analytics/reports", label: "Reports" },
        { to: "/analytics/insights", label: "Insights" },
      ],
    },
  ];

  const quickActions = [
    {
      to: "/dashboard/users",
      label: "Users",
      icon: <Users className="h-4 w-4" />,
    },
    {
      to: "/dashboard/products",
      label: "Products",
      icon: <Package className="h-4 w-4" />,
    },
    {
      to: "/dashboard/settings",
      label: "Settings",
      icon: <Settings className="h-4 w-4" />,
    },
  ];

  return (
    <motion.div
      initial={false}
      animate={{ width: collapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={`bg-gradient-to-b from-white to-gray-50/50 h-screen border-r border-gray-200/50 flex flex-col shadow-lg`}
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-200/50">
        <div className="flex items-center justify-between">
          <AnimatePresence mode="wait">
            {!collapsed ? (
              <motion.div
                key="expanded"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="flex items-center space-x-3"
              >
                <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    Dashboard
                  </h2>
                  <p className="text-xs text-gray-500">Management System</p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="collapsed"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="flex justify-center"
              >
                <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Zap className="h-5 w-5 text-white" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={onToggle}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors group"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4 text-gray-600 group-hover:text-gray-900" />
            ) : (
              <ChevronLeft className="h-4 w-4 text-gray-600 group-hover:text-gray-900" />
            )}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {/* Main Navigation */}
        <nav className="space-y-1">
          <SidebarItem
            to="/dashboard"
            label="Overview"
            icon={<Home className="h-5 w-5" />}
            isOpen={!collapsed}
            isActive={true}
          />

          {sidebarMenus.map((menu) => (
            <SidebarSubmenu
              key={menu.key}
              label={menu.label}
              icon={menu.icon}
              isOpen={!collapsed}
              expanded={submenuOpen[menu.key]}
              onToggle={() => toggleSubmenu(menu.key)}
              basePath={menu.basePath}
              submenu={menu.submenu}
              badge={menu.badge}
            />
          ))}
        </nav>

        {/* Quick Actions */}
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 pt-6 border-t border-gray-200/50"
          >
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">
              Quick Actions
            </h3>
            <div className="space-y-1">
              {quickActions.map((action) => (
                <SidebarItem
                  key={action.to}
                  to={action.to}
                  label={action.label}
                  icon={action.icon}
                  isOpen={true}
                  variant="quick"
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200/50">
        <AnimatePresence mode="wait">
          {!collapsed ? (
            <motion.div
              key="expanded-footer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
              className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100"
            >
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Zap className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Upgrade Pro
                  </p>
                  <p className="text-xs text-gray-600">Get more features</p>
                </div>
              </div>
              <button className="w-full mt-3 bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium py-2 px-3 rounded-lg transition-colors">
                Upgrade Now
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="collapsed-footer"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="flex justify-center"
            >
              <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <Zap className="h-4 w-4 text-white" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Sidebar;
