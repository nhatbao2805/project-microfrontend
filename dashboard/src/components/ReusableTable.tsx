import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronUp,
  ChevronDown,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Download,
  Check,
  X,
} from "lucide-react";

export interface TableColumn<T> {
  key: keyof T;
  header: string;
  sortable?: boolean;
  render?: (item: T, index: number) => React.ReactNode;
  className?: string;
  headerClassName?: string;
  width?: string | number;
  align?: "left" | "center" | "right";
}

export interface TableAction<T> {
  label: string;
  icon?: React.ReactNode;
  onClick: (item: T) => void;
  className?: string;
  variant?: "default" | "danger" | "success";
  show?: (item: T) => boolean;
}

export interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
  rowClassName?: string | ((item: T, index: number) => string);
  onRowClick?: (item: T, index: number) => void;
  editPath: string | ((item: T, index: number) => string);
  selectable?: boolean;
  selectedRows?: string[];
  onSelectionChange?: (selectedIds: string[]) => void;
  getRowId?: (item: T) => string;
  actions?: TableAction<T>[];
  sortable?: boolean;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
  };
  searchable?: boolean;
  onSearch?: (searchTerm: string) => void;
  searchPlaceholder?: string;
  stickyHeader?: boolean;
  hoverable?: boolean;
  striped?: boolean;
}

export function ReusableTable<T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  emptyMessage = "No data available",
  className = "",
  rowClassName = "",
  onRowClick,
  editPath,
  selectable = false,
  selectedRows = [],
  onSelectionChange,
  getRowId = (item: T) => String(item.id || Math.random()),
  actions = [],
  sortable = true,
  pagination,
  searchable = false,
  onSearch,
  searchPlaceholder = "Search...",
  stickyHeader = false,
  hoverable = true,
  striped = false,
}: TableProps<T>) {
  const navigate = useNavigate();
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T | null;
    direction: "asc" | "desc";
  }>({ key: null, direction: "asc" });
  const [showActions, setShowActions] = useState<Record<string, boolean>>({});

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortable || !sortConfig.key) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key!];
      const bValue = b[sortConfig.key!];

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortConfig.direction === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortConfig.direction === "asc"
          ? aValue - bValue
          : bValue - aValue;
      }

      return 0;
    });
  }, [data, sortConfig, sortable]);

  // Handle sorting
  const handleSort = (key: keyof T) => {
    if (!sortable) return;

    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  // Handle row selection
  const handleSelectRow = (rowId: string) => {
    if (!selectable || !onSelectionChange) return;

    const newSelection = selectedRows.includes(rowId)
      ? selectedRows.filter((id) => id !== rowId)
      : [...selectedRows, rowId];

    onSelectionChange(newSelection);
  };

  // Handle select all
  const handleSelectAll = () => {
    if (!selectable || !onSelectionChange) return;

    const allIds = sortedData.map((item) => getRowId(item));
    const isAllSelected = allIds.every((id) => selectedRows.includes(id));

    onSelectionChange(isAllSelected ? [] : allIds);
  };

  // Check if all rows are selected
  const isAllSelected = useMemo(() => {
    const allIds = sortedData.map((item) => getRowId(item));
    return allIds.length > 0 && allIds.every((id) => selectedRows.includes(id));
  }, [sortedData, selectedRows, getRowId]);

  // Get sort icon
  const getSortIcon = (key: keyof T) => {
    if (!sortable) return null;
    if (sortConfig.key !== key)
      return <ChevronUp className="w-4 h-4 opacity-30" />;
    return sortConfig.direction === "asc" ? (
      <ChevronUp className="w-4 h-4 text-blue-600" />
    ) : (
      <ChevronDown className="w-4 h-4 text-blue-600" />
    );
  };

  // Get action variant styles
  const getActionStyles = (variant: TableAction<T>["variant"] = "default") => {
    switch (variant) {
      case "danger":
        return "text-red-600 hover:text-red-700 hover:bg-red-50";
      case "success":
        return "text-green-600 hover:text-green-700 hover:bg-green-50";
      default:
        return "text-gray-600 hover:text-gray-700 hover:bg-gray-50";
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <div className="animate-pulse">
          {/* Header skeleton */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3">
            <div className="flex space-x-4">
              {columns.map((_, index) => (
                <div
                  key={index}
                  className="h-4 bg-white bg-opacity-20 rounded w-20"
                />
              ))}
            </div>
          </div>
          {/* Body skeleton */}
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="px-6 py-4 border-b border-gray-100">
              <div className="flex space-x-4">
                {columns.map((_, colIndex) => (
                  <div
                    key={colIndex}
                    className="h-4 bg-gray-200 rounded w-16"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const handleRootClick = () => {
    // Close any open action menus when clicking outside
    if (Object.keys(showActions).length > 0) {
      setShowActions({});
    }
  };

  return (
    <div
      className={`bg-white rounded-lg shadow border border-gray-200 overflow-hidden ${className}`}
      onClick={handleRootClick}
    >
      {/* Search Bar */}
      {searchable && onSearch && (
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="relative">
            <input
              type="text"
              placeholder={searchPlaceholder}
              onChange={(e) => onSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-blue"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          {/* Header */}
          <thead
            className={`bg-gradient-to-r from-blue-600 to-indigo-600 text-white ${
              stickyHeader ? "sticky top-0 z-10" : ""
            }`}
          >
            <tr>
              {/* Selection checkbox */}
              {selectable && (
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                    className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                  />
                </th>
              )}

              {/* Column headers */}
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={`px-6 py-3 text-sm font-semibold tracking-wide uppercase ${
                    column.headerClassName || ""
                  } ${
                    column.sortable !== false
                      ? "cursor-pointer hover:bg-blue-700 transition-colors"
                      : ""
                  }`}
                  style={{ width: column.width }}
                  onClick={() =>
                    column.sortable !== false && handleSort(column.key)
                  }
                >
                  <div
                    className={`flex items-center space-x-1 ${
                      column.align === "center"
                        ? "justify-center"
                        : column.align === "right"
                        ? "justify-end"
                        : ""
                    }`}
                  >
                    <span>{column.header}</span>
                    {getSortIcon(column.key)}
                  </div>
                </th>
              ))}

              {/* Actions column */}
              {actions.length > 0 && (
                <th className="px-6 py-3 text-right text-sm font-semibold tracking-wide uppercase">
                  Actions
                </th>
              )}
            </tr>
          </thead>

          {/* Body */}
          <tbody className="divide-y divide-gray-100">
            <AnimatePresence>
              {sortedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={
                      columns.length +
                      (selectable ? 1 : 0) +
                      (actions.length > 0 ? 1 : 0)
                    }
                    className="px-6 py-12 text-center"
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <svg
                        className="w-12 h-12 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <p className="text-gray-500 text-sm">{emptyMessage}</p>
                    </div>
                  </td>
                </tr>
              ) : (
                sortedData.map((item, index) => {
                  const rowId = getRowId(item);
                  const isSelected = selectedRows.includes(rowId);
                  const rowClass =
                    typeof rowClassName === "function"
                      ? rowClassName(item, index)
                      : rowClassName;

                  return (
                    <motion.tr
                      key={rowId}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.2 }}
                      className={`
                        ${isSelected ? "bg-blue-50" : ""}
                        ${striped && index % 2 === 0 ? "bg-gray-50" : ""}
                        ${hoverable ? "hover:bg-blue-50 transition-colors" : ""}
                        ${onRowClick ? "cursor-pointer" : ""}
                        ${rowClass}
                      `}
                      onClick={() => {
                        if (editPath) {
                          const path =
                            typeof editPath === "function"
                              ? editPath(item, index)
                              : editPath;
                          if (path) {
                            navigate(path);
                            return;
                          }
                        }
                        onRowClick?.(item, index);
                      }}
                    >
                      {/* Selection checkbox */}
                      {selectable && (
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleSelectRow(rowId)}
                            onClick={(e) => e.stopPropagation()}
                            className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                          />
                        </td>
                      )}

                      {/* Data cells */}
                      {columns.map((column) => (
                        <td
                          key={String(column.key)}
                          className={`px-6 py-4 whitespace-nowrap text-sm ${
                            column.className || ""
                          }`}
                        >
                          <div
                            className={`${
                              column.align === "center"
                                ? "text-center"
                                : column.align === "right"
                                ? "text-right"
                                : ""
                            }`}
                          >
                            {column.render
                              ? column.render(item, index)
                              : String(item[column.key] || "")}
                          </div>
                        </td>
                      ))}

                      {/* Actions */}
                      {actions.length > 0 && (
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                          <div className="relative">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowActions((prev) => ({
                                  ...prev,
                                  [rowId]: !prev[rowId],
                                }));
                              }}
                              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </button>

                            <AnimatePresence>
                              {showActions[rowId] && (
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                  animate={{ opacity: 1, scale: 1, y: 0 }}
                                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                  className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {actions
                                    .filter(
                                      (action) =>
                                        !action.show || action.show(item)
                                    )
                                    .map((action, actionIndex) => (
                                      <button
                                        key={actionIndex}
                                        onClick={() => {
                                          action.onClick(item);
                                          setShowActions((prev) => ({
                                            ...prev,
                                            [rowId]: false,
                                          }));
                                        }}
                                        className={`w-full flex items-center space-x-2 px-4 py-2 text-sm hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg ${getActionStyles(
                                          action.variant
                                        )}`}
                                      >
                                        {action.icon}
                                        <span>{action.label}</span>
                                      </button>
                                    ))}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </td>
                      )}
                    </motion.tr>
                  );
                })
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">
              Showing{" "}
              {Math.min(
                (pagination.page - 1) * pagination.pageSize + 1,
                pagination.total
              )}{" "}
              to{" "}
              {Math.min(
                pagination.page * pagination.pageSize,
                pagination.total
              )}{" "}
              of {pagination.total} results
            </span>
            <select
              value={pagination.pageSize}
              onChange={(e) =>
                pagination.onPageSizeChange(Number(e.target.value))
              }
              className="ml-2 border border-gray-300 rounded px-2 py-1 text-sm"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              Previous
            </button>
            <span className="text-sm text-gray-700">
              Page {pagination.page} of{" "}
              {Math.ceil(pagination.total / pagination.pageSize)}
            </span>
            <button
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              disabled={
                pagination.page >=
                Math.ceil(pagination.total / pagination.pageSize)
              }
              className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReusableTable;
