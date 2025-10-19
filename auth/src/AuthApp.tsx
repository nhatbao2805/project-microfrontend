// auth/src/AuthApp.tsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import FormRegister from "./pages/auth/FormRegister";

export default function AuthApp() {
  return (
    <BrowserRouter basename="/auth">
      <Routes>
        {/* <Route path="/" element={<Navigate to="login" />} /> */}
        <Route path="login" element={<Login />} />
        <Route path="register" element={<FormRegister />} />
      </Routes>
    </BrowserRouter>
  );
}
