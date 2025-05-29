import React from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();

  const tabs = [
    { to: "/allnfts", label: "🌍 Tất cả NFT" },
    { to: "/upload", label: "🖼️ Đăng ký tác phẩm" },
    { to: "/buy", label: "💸 Mua / Chuyển nhượng" },
    { to: "/history", label: "📜 Lịch sử giao dịch" },
    { to: "/mynfts", label: "👛 NFT của tôi" },
  ];

  return (
    <>
      {tabs.map((tab) => (
        <Link
          key={tab.to}
          to={tab.to}
          className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
            location.pathname === tab.to
              ? "bg-indigo-600 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          {tab.label}
        </Link>
      ))}
    </>
  );
};

export default Navbar;