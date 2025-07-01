import React from "react";
import ReactDOM from "react-dom/client";
import AuthApp from "./AuthApp";

// ✅ Cho phép container import component
const mount = (el: HTMLElement) => {
  const root = ReactDOM.createRoot(el);
  root.render(<AuthApp />);
};

// ✅ Khi chạy độc lập (localhost:3001)
if (process.env.NODE_ENV === "development") {
  const el = document.getElementById("root");
  if (el) {
    mount(el);
  }
}

// ✅ Export để container dùng
export { mount };
export default AuthApp;
