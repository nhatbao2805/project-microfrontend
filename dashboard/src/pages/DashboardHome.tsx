import React from "react";
import { motion } from "framer-motion";
import {
  FileText,
  FolderOpen,
  Kanban,
  TrendingUp,
  Users,
  DollarSign,
  Activity,
  ArrowUpRight,
  Plus,
  Eye,
  BarChart3,
  Calendar,
  Clock,
} from "lucide-react";

const DashboardHome: React.FC = () => {
  const stats = [
    {
      title: "Total Invoices",
      value: "1,234",
      change: "+12%",
      changeType: "positive" as const,
      icon: FileText,
      color: "blue",
    },
    {
      title: "Revenue",
      value: "$45,678",
      change: "+8.2%",
      changeType: "positive" as const,
      icon: DollarSign,
      color: "green",
    },
    {
      title: "Active Projects",
      value: "89",
      change: "-2.1%",
      changeType: "negative" as const,
      icon: Kanban,
      color: "purple",
    },
    {
      title: "Team Members",
      value: "24",
      change: "+4",
      changeType: "positive" as const,
      icon: Users,
      color: "orange",
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: "invoice",
      title: "New invoice created",
      description: "Invoice #INV-001 for $2,500",
      time: "2 minutes ago",
      icon: FileText,
    },
    {
      id: 2,
      type: "payment",
      title: "Payment received",
      description: "Payment of $1,250 from John Doe",
      time: "1 hour ago",
      icon: DollarSign,
    },
    {
      id: 3,
      type: "project",
      title: "Project completed",
      description: "Website redesign project finished",
      time: "3 hours ago",
      icon: Kanban,
    },
    {
      id: 4,
      type: "user",
      title: "New team member",
      description: "Sarah Johnson joined the team",
      time: "1 day ago",
      icon: Users,
    },
  ];

  const quickActions = [
    {
      title: "Create Invoice",
      description: "Generate a new invoice",
      icon: Plus,
      color: "blue",
      href: "/dashboard/invoice/new",
    },
    {
      title: "View Analytics",
      description: "Check performance metrics",
      icon: BarChart3,
      color: "green",
      href: "/dashboard/analytics",
    },
    {
      title: "Manage Categories",
      description: "Organize invoice categories",
      icon: FolderOpen,
      color: "purple",
      href: "/dashboard/invoice/category/list",
    },
    {
      title: "View Boards",
      description: "Check project boards",
      icon: Kanban,
      color: "orange",
      href: "/dashboard/board/list",
    },
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: {
        bg: "bg-blue-50",
        icon: "bg-blue-500",
        text: "text-blue-600",
        border: "border-blue-200",
      },
      green: {
        bg: "bg-green-50",
        icon: "bg-green-500",
        text: "text-green-600",
        border: "border-green-200",
      },
      purple: {
        bg: "bg-purple-50",
        icon: "bg-purple-500",
        text: "text-purple-600",
        border: "border-purple-200",
      },
      orange: {
        bg: "bg-orange-50",
        icon: "bg-orange-500",
        text: "text-orange-600",
        border: "border-orange-200",
      },
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="p-6 space-y-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Welcome back, John! 👋
            </h1>
            <p className="text-gray-600 mt-2 text-lg">
              Here's what's happening with your business today.
            </p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Calendar className="h-4 w-4" />
            <span>{new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</span>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat, index) => {
          const colors = getColorClasses(stat.color);
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
              className={`${colors.bg} ${colors.border} border rounded-2xl p-6 hover:shadow-lg transition-all duration-300 group`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mb-2">
                    {stat.value}
                  </p>
                  <div className="flex items-center space-x-1">
                    <span
                      className={`text-sm font-medium ${
                        stat.changeType === "positive"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-500">vs last month</span>
                  </div>
                </div>
                <div className={`${colors.icon} p-3 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1">
              <span>View all</span>
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                className="flex items-start space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <activity.icon className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.title}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {activity.description}
                  </p>
                  <div className="flex items-center space-x-1 mt-2">
                    <Clock className="h-3 w-3 text-gray-400" />
                    <span className="text-xs text-gray-500">{activity.time}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Quick Actions
          </h2>
          <div className="space-y-4">
            {quickActions.map((action, index) => {
              const colors = getColorClasses(action.color);
              return (
                <motion.a
                  key={action.title}
                  href={action.href}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                  className={`${colors.bg} ${colors.border} border rounded-xl p-4 hover:shadow-md transition-all duration-200 group block`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`${colors.icon} p-2 rounded-lg group-hover:scale-110 transition-transform duration-200`}>
                      <action.icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium ${colors.text}`}>
                        {action.title}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {action.description}
                      </p>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                  </div>
                </motion.a>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Performance Chart Placeholder */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Performance Overview
          </h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Revenue</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Invoices</span>
            </div>
          </div>
        </div>
        <div className="h-64 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl flex items-center justify-center">
          <div className="text-center">
            <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">Chart visualization would go here</p>
            <p className="text-sm text-gray-400 mt-1">
              Connect your analytics service to display real data
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardHome;