import React from 'react';

export interface Column<T> {
  key: keyof T; // key dữ liệu trong object
  header: string; // tiêu đề cột
  render?: (item: T) => React.ReactNode; // tùy chỉnh render cell (nếu có)
  className?: string; // class riêng cho cột
}

interface Table<T> {
  columns: Column<T>[];
  data: T[];
  className?: string;
  tableClassName?: string;
  noDataMessage?: string;
}

export function Table<T>({
  columns,
  data,
  className = '',
  tableClassName = 'min-w-full divide-y divide-gray-200',
  noDataMessage = 'Không có dữ liệu',
}: Table<T>) {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table
        className={`min-w-full divide-y divide-gray-200 bg-white shadow-md rounded-lg overflow-hidden ${tableClassName}`}
      >
        <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <tr>
            {columns.map(({ header, key, className }) => (
              <th
                key={String(key)}
                className={`px-6 py-3 text-left text-sm font-semibold tracking-wide uppercase ${
                  className ?? ''
                }`}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center py-6 text-gray-400 italic"
              >
                {noDataMessage}
              </td>
            </tr>
          ) : (
            data.map((item, rowIndex) => (
              <tr
                key={rowIndex}
                className="transition-colors hover:bg-blue-50 cursor-pointer"
              >
                {columns.map(({ key, render, className }, colIndex) => (
                  <td
                    key={String(key)}
                    className={`px-6 py-4 whitespace-nowrap text-gray-700 text-sm ${
                      className ?? ''
                    }`}
                  >
                    {render ? render(item) : String(item[key])}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
