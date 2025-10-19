import React, { useState } from "react";
import { motion } from "framer-motion";
import ReusableTable, {
  TableColumn,
  TableAction,
} from "../../components/ReusableTable";
import {
  FolderOpen,
  Plus,
  Edit,
  Trash2,
  Eye,
  Tag,
  Calendar,
  FileText,
  MoreHorizontal,
} from "lucide-react";

interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
  invoiceCount: number;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

const categories: Category[] = [
  {
    id: "1",
    name: "Office Supplies",
    description: "Stationery and office equipment",
    color: "#3B82F6",
    invoiceCount: 45,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-20",
    isActive: true,
  },
  {
    id: "2",
    name: "Utilities",
    description: "Electricity, water, and internet bills",
    color: "#10B981",
    invoiceCount: 23,
    createdAt: "2024-01-10",
    updatedAt: "2024-01-18",
    isActive: true,
  },
  {
    id: "3",
    name: "Marketing",
    description: "Advertising and promotional expenses",
    color: "#F59E0B",
    invoiceCount: 12,
    createdAt: "2024-01-08",
    updatedAt: "2024-01-15",
    isActive: true,
  },
  {
    id: "4",
    name: "Travel",
    description: "Business travel and transportation",
    color: "#EF4444",
    invoiceCount: 8,
    createdAt: "2024-01-05",
    updatedAt: "2024-01-12",
    isActive: false,
  },
];

const columns: TableColumn<Category>[] = [
  {
    key: "name",
    header: "Category Details",
    sortable: true,
    render: (category) => (
      <div className="flex items-center space-x-3">
        <div
          className="h-10 w-10 rounded-lg flex items-center justify-center shadow-sm"
          style={{ backgroundColor: category.color }}
        >
          <FolderOpen className="h-5 w-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {category.name}
          </p>
          <p className="text-sm text-gray-500 truncate">
            {category.description}
          </p>
        </div>
      </div>
    ),
  },
  {
    key: "invoiceCount",
    header: "Invoices",
    sortable: true,
    render: (category) => (
      <div className="flex items-center space-x-2">
        <FileText className="h-4 w-4 text-gray-400" />
        <span className="font-medium text-gray-900">
          {category.invoiceCount}
        </span>
      </div>
    ),
    align: "center",
  },
  {
    key: "color",
    header: "Color",
    render: (category) => (
      <div className="flex items-center space-x-2">
        <div
          className="h-6 w-6 rounded-full border-2 border-gray-200"
          style={{ backgroundColor: category.color }}
        />
        <span className="text-sm text-gray-600 font-mono">
          {category.color}
        </span>
      </div>
    ),
  },
  {
    key: "createdAt",
    header: "Created",
    sortable: true,
    render: (category) => (
      <div className="flex items-center space-x-2">
        <Calendar className="h-4 w-4 text-gray-400" />
        <span className="text-sm text-gray-900">
          {new Date(category.createdAt).toLocaleDateString()}
        </span>
      </div>
    ),
  },
  {
    key: "isActive",
    header: "Status",
    sortable: true,
    render: (category) => (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          category.isActive
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800"
        }`}
      >
        {category.isActive ? "Active" : "Inactive"}
      </span>
    ),
    align: "center",
  },
];

const tableActions: TableAction<Category>[] = [
  {
    label: "View Details",
    icon: <Eye className="w-4 h-4" />,
    onClick: (category) => {
      console.log("View category:", category.id);
    },
  },
  {
    label: "Edit Category",
    icon: <Edit className="w-4 h-4" />,
    onClick: (category) => {
      console.log("Edit category:", category.id);
    },
  },
  {
    label: "Delete Category",
    icon: <Trash2 className="w-4 h-4" />,
    onClick: (category) => {
      console.log("Delete category:", category.id);
    },
    variant: "danger",
    show: (category) => category.invoiceCount === 0, // Only show delete if no invoices
  },
];

export default function CategoryList() {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const totalCategories = categories.length;
  const activeCategories = categories.filter((cat) => cat.isActive).length;
  const totalInvoices = categories.reduce(
    (sum, cat) => sum + cat.invoiceCount,
    0
  );

  const handleRowClick = (category: Category) => {
    console.log("Row clicked:", category);
  };

  const handleSelectionChange = (selectedIds: string[]) => {
    setSelectedRows(selectedIds);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-blue-600 bg-clip-text text-transparent">
              Category Management
            </h1>
            <p className="text-gray-600 mt-2">
              Organize and manage your invoice categories
            </p>
          </div>
          <div className="mt-4 lg:mt-0">
            <button className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center space-x-2">
              <Plus className="h-5 w-5" />
              <span>Add Category</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Categories
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {totalCategories}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-xl">
              <FolderOpen className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Active Categories
              </p>
              <p className="text-3xl font-bold text-green-600">
                {activeCategories}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-xl">
              <Tag className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Invoices
              </p>
              <p className="text-3xl font-bold text-purple-600">
                {totalInvoices}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-xl">
              <FileText className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <ReusableTable
          data={categories}
          columns={columns}
          actions={tableActions.filter((a) => a.label !== "View Details")}
          editPath={(category) => `/invoice/category/${category.id}/edit`}
          selectable={true}
          selectedRows={selectedRows}
          onSelectionChange={handleSelectionChange}
          onRowClick={handleRowClick}
          searchable={true}
          searchPlaceholder="Search categories by name or description..."
          emptyMessage="No categories found. Create your first category!"
          hoverable={true}
          striped={true}
          stickyHeader={true}
        />
      </motion.div>
    </div>
  );
}
