import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
const RemoteAuth = lazy(() => import("auth/AuthApp"));
const RemoteDashboard = lazy(() => import("dashboard/DashboardApp"));
const App = () => (
    <BrowserRouter>
      <Routes>
        <Route path="/auth/*" element={<RemoteAuth />} />
        <Route path="/dashboard/*" element={<RemoteDashboard />} />
        {/* Các route khác */}
        <Route path="/" element={<div className="text-[20px] text-red-900">Home Page</div>} />
      </Routes>
    </BrowserRouter>
);

export default App;
