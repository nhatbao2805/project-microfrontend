import React from "react";

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow px-4 py-3 flex justify-between items-center">
      <h1 className="text-lg font-bold">Dashboard</h1>
      <button
        className="text-sm bg-red-500 text-white px-3 py-1 rounded"
        onClick={() => {
          localStorage.removeItem("access_token");
          window.location.href = "/login";
        }}
      >
        Đăng xuất
      </button>
    </header>
  );
};

export default Header;
