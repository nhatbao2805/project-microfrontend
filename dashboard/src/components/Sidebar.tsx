import React, { useState } from 'react';
import { SidebarItem } from './SidebarItem';
import { SidebarSubmenu } from './SidebarSubmenu';
import { HomeIcon, FileTextIcon, ListIcon } from 'lucide-react';

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [submenuOpen, setSubmenuOpen] = useState<Record<string, boolean>>({
    invoice: false,
    category: false,
    board: false,
  });

  const toggleSubmenu = (key: string) => {
    setSubmenuOpen((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const sidebarMenus = [
    {
      key: 'invoice',
      label: 'Hóa đơn',
      icon: <FileTextIcon />,
      basePath: '/dashboard/invoice',
      submenu: [
        { to: '/invoice/list', label: 'Danh sách' },
        { to: '/invoice/new', label: 'Tạo mới' },
      ],
    },
    {
      key: 'category',
      label: 'Danh mục',
      icon: <ListIcon />,
      basePath: '/invoice/category',
      submenu: [
        { to: '/invoice/category/list', label: 'Danh sách' },
        { to: '/invoice/category/new', label: 'Tạo mới' },
      ],
    },
    {
      key: 'board',
      label: 'Board',
      icon: <ListIcon />,
      basePath: '/board',
      submenu: [
        { to: '/board/list', label: 'Danh sách' },
        { to: '/board/new', label: 'Tạo mới' },
      ],
    },
  ];

  return (
    <div
      className={`bg-white h-screen p-4 shadow-md transition-[width] duration-300 ${
        isOpen ? 'w-64' : 'w-16'
      }`}
    >
      <div className="flex items-center justify-between mb-6">
        {isOpen && <h2 className="text-xl font-bold">Quản lý</h2>}
        <button
          onClick={() => setIsOpen(!isOpen)}
          title={isOpen ? 'Thu gọn' : 'Mở rộng'}
        >
          {isOpen ? <span>&larr;</span> : <span>&rarr;</span>}
        </button>
      </div>

      <nav className="flex flex-col space-y-3">
        <SidebarItem
          to="/dashboard"
          label="Tổng quan"
          icon={<HomeIcon />}
          isOpen={isOpen}
        />

        {sidebarMenus.map((menu) => (
          <SidebarSubmenu
            key={menu.key}
            label={menu.label}
            icon={menu.icon}
            isOpen={isOpen}
            expanded={submenuOpen[menu.key]}
            onToggle={() => toggleSubmenu(menu.key)}
            basePath={menu.basePath}
            submenu={menu.submenu}
          />
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
