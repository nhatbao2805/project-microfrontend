// auth/src/AuthApp.tsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DashboardHome from "./pages/DashboardHome";
import CreateInvoice from "./pages/Invoice/CreateInvoice";
import ListInvoice from "./pages/Invoice/ListInvoice";
import CategoryList from "./pages/Category/CategoryList";
import CreateCategory from "./pages/Category/CreateCategory";
import BoardList from "./pages/Board/BoardList";
import BoardDetail from "./pages/Board/BoardDetail";
import DashboardLayout from "./layout/DashboardLayout";
import SchedulePage from "./pages/Schedule/SchedulePage";

export default function DashboardApp() {
  return (
    <BrowserRouter basename="/dashboard">
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="invoice/new" element={<CreateInvoice />} />
          <Route path="invoice/list" element={<ListInvoice />} />
          <Route path="invoice/:invoiceId/edit" element={<CreateInvoice />} />
          <Route path="invoice/category/list" element={<CategoryList />} />
          <Route path="invoice/category/new" element={<CreateCategory />} />
          <Route path="board/list" element={<BoardList />} />
          <Route path="board/:boardId" element={<BoardDetail />} />
          <Route path="schedule" element={<SchedulePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
