import React, { useState, useEffect } from "react";
import ReusableTable, {
  TableColumn,
  TableAction,
} from "../../components/ReusableTable";
import { getInvoices } from "../../services/invoice.service";
import { motion } from "framer-motion";
import Loading, { TableSkeleton } from "../../components/Loading";
import {
  FileText,
  DollarSign,
  CheckCircle,
  XCircle,
  Plus,
  Search,
  Filter,
  Download,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Calendar,
  Tag,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Invoice {
  id: string;
  title: string;
  amount: number;
  category?: string;
  note?: string;
  invoiceDate: string;
  dueDate?: string;
  isPaid: boolean;
  createdAt: string;
  updatedAt: string;
}

const columns: TableColumn<Invoice>[] = [
  {
    key: "title",
    header: "Invoice Details",
    sortable: true,
    className: "font-medium text-gray-900",
    render: (invoice) => (
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0">
          <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
            <FileText className="h-5 w-5 text-white" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {invoice.title}
          </p>
          <p className="text-sm text-gray-500">#{invoice.id.slice(-8)}</p>
        </div>
      </div>
    ),
  },
  {
    key: "amount",
    header: "Amount",
    sortable: true,
    render: (invoice) => (
      <div className="text-right">
        <span className="text-lg font-bold text-gray-900">
          ${invoice.amount.toLocaleString()}
        </span>
        <p className="text-sm text-gray-500">USD</p>
      </div>
    ),
    align: "right",
  },
  {
    key: "category",
    header: "Category",
    sortable: true,
    render: (invoice) => (
      <div className="flex items-center space-x-2">
        <Tag className="h-4 w-4 text-blue-500" />
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200">
          {invoice.category || "Uncategorized"}
        </span>
      </div>
    ),
  },
  {
    key: "invoiceDate",
    header: "Invoice Date",
    sortable: true,
    render: (invoice) => (
      <div className="flex items-center space-x-2">
        <Calendar className="h-4 w-4 text-gray-400" />
        <div>
          <p className="text-sm font-medium text-gray-900">
            {new Date(invoice.invoiceDate).toLocaleDateString()}
          </p>
          <p className="text-xs text-gray-500">
            {new Date(invoice.invoiceDate).toLocaleDateString("en-US", {
              weekday: "short",
            })}
          </p>
        </div>
      </div>
    ),
  },
  {
    key: "dueDate",
    header: "Due Date",
    sortable: true,
    render: (invoice) => {
      if (!invoice.dueDate)
        return (
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-300" />
            <span className="text-gray-400">No due date</span>
          </div>
        );

      const dueDate = new Date(invoice.dueDate);
      const today = new Date();
      const isOverdue = dueDate < today && !invoice.isPaid;

      return (
        <div className="flex items-center space-x-2">
          <Calendar
            className={`h-4 w-4 ${
              isOverdue ? "text-red-500" : "text-gray-400"
            }`}
          />
          <div>
            <p
              className={`text-sm font-medium ${
                isOverdue ? "text-red-600" : "text-gray-900"
              }`}
            >
              {dueDate.toLocaleDateString()}
            </p>
            <p
              className={`text-xs ${
                isOverdue ? "text-red-500" : "text-gray-500"
              }`}
            >
              {isOverdue ? "Overdue" : "Pending"}
            </p>
          </div>
        </div>
      );
    },
  },
  {
    key: "isPaid",
    header: "Status",
    sortable: true,
    render: (invoice) => (
      <div className="flex items-center space-x-2">
        {invoice.isPaid ? (
          <>
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span className="text-sm font-medium text-green-700">Paid</span>
          </>
        ) : (
          <>
            <XCircle className="h-5 w-5 text-red-500" />
            <span className="text-sm font-medium text-red-700">Unpaid</span>
          </>
        )}
      </div>
    ),
    align: "center",
  },
];

export default function ListInvoice() {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "paid" | "unpaid">(
    "all"
  );
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getInvoices();
      setInvoices(response.data || response);
    } catch (err) {
      console.error("Error fetching invoices:", err);
      setError("Failed to load invoices");
    } finally {
      setLoading(false);
    }
  };

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.category?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "paid" && invoice.isPaid) ||
      (statusFilter === "unpaid" && !invoice.isPaid);
    return matchesSearch && matchesStatus;
  });

  const totalAmount = invoices.reduce(
    (sum, invoice) => sum + +invoice.amount,
    0
  );
  const paidAmount = invoices
    .filter((inv) => inv.isPaid)
    .reduce((sum, invoice) => sum + invoice.amount, 0);
  const unpaidAmount = totalAmount - paidAmount;

  const handleRowClick = (invoice: Invoice, index: number) => {
    console.log("Row clicked:", invoice);
    // Navigate to invoice detail
  };

  const handleSelectionChange = (selectedIds: string[]) => {
    setSelectedRows(selectedIds);
    console.log("Selected invoices:", selectedIds);
  };

  const handleSearch = (searchTerm: string) => {
    setSearchTerm(searchTerm);
  };

  // Table actions (inside component to access navigate)
  const tableActions: TableAction<Invoice>[] = [
    {
      label: "View Details",
      icon: <Eye className="w-4 h-4" />,
      onClick: (invoice) => {
        console.log("View invoice:", invoice.id);
      },
    },
    {
      label: "Edit Invoice",
      icon: <Edit className="w-4 h-4" />,
      onClick: (invoice) => {
        navigate(`/invoice/${invoice.id}/edit`);
      },
    },
    {
      label: "Download PDF",
      icon: <Download className="w-4 h-4" />,
      onClick: (invoice) => {
        console.log("Download invoice:", invoice.id);
      },
    },
    {
      label: "Delete Invoice",
      icon: <Trash2 className="w-4 h-4" />,
      onClick: (invoice) => {
        console.log("Delete invoice:", invoice.id);
      },
      variant: "danger",
      show: (invoice) => !invoice.isPaid,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="bg-gray-50">
          <Loading size="lg" text="Loading invoices..." className="h-64" />
          <div className="mt-8">
            <TableSkeleton rows={8} columns={6} />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4"
        >
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Error Loading Invoices
            </h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={fetchInvoices}
              className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-2 px-4 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 font-medium"
            >
              Try Again
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

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
              Invoice Management
            </h1>
            <p className="text-gray-600 mt-2">Manage and track your invoices</p>
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
                Total Invoices
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {invoices.length}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-xl">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Paid Invoices</p>
              <p className="text-3xl font-bold text-green-600">
                {invoices.filter((inv) => inv.isPaid).length}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-xl">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Value</p>
              <p className="text-3xl font-bold text-gray-900">
                ${totalAmount.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-xl">
              <DollarSign className="h-6 w-6 text-purple-600" />
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
          data={filteredInvoices}
          columns={columns}
          actions={tableActions.filter((a) => a.label !== "View Details")}
          editPath={(invoice) => `/invoice/${invoice.id}/edit`}
          selectable={true}
          selectedRows={selectedRows}
          onSelectionChange={handleSelectionChange}
          onRowClick={handleRowClick}
          searchable={true}
          onSearch={handleSearch}
          searchPlaceholder="Search invoices by title or category..."
          emptyMessage="No invoices found. Create your first invoice!"
          hoverable={true}
          striped={true}
          stickyHeader={true}
          pagination={{
            page: currentPage,
            pageSize: pageSize,
            total: filteredInvoices.length,
            onPageChange: setCurrentPage,
            onPageSizeChange: setPageSize,
          }}
        />
      </motion.div>
    </div>
  );
}
