import React from 'react';
import { Column, Table } from '../../components/Table';

interface User {
  id: number;
  name: string;
  email: string;
  isAdmin: boolean;
}

const columns: Column<User>[] = [
  { key: 'id', header: 'ID' },
  { key: 'name', header: 'Tên' },
  { key: 'email', header: 'Email' },
  {
    key: 'isAdmin',
    header: 'Quyền admin',
    render: (user) => (user.isAdmin ? '✔️' : '❌'),
    className: 'text-center',
  },
];

const users: User[] = [
  { id: 1, name: 'Nguyễn Văn A', email: 'a@example.com', isAdmin: true },
  { id: 2, name: 'Trần Thị B', email: 'b@example.com', isAdmin: false },
];

export default function CategoryList() {
  return (
    <div className="p-4">
      <Table columns={columns} data={users} />
    </div>
  );
}
