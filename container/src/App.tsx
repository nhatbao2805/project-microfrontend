import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingLayout from "./layout/LadingLayout";
const RemoteAuth = lazy(() => import("auth/AuthApp"));
const RemoteDashboard = lazy(() => import("dashboard/DashboardApp"));
const App = () => (
    <BrowserRouter>
      <Routes>
        <Route path="/auth/*" element={<RemoteAuth />} />
        <Route path="/dashboard/*" element={<RemoteDashboard />} />
        <Route path="/" element={<LandingLayout/>} />
      </Routes>
    </BrowserRouter>
);

export default App;
