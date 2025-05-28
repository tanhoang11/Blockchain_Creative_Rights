import React from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();

  const tabs = [
    { to: "/upload", label: "🖼️ Đăng ký tác phẩm" },
    { to: "/buy", label: "💸 Mua / Chuyển nhượng" },
    { to: "/history", label: "📜 Lịch sử giao dịch" },
    { to: "/allnfts", label: "🌍 Tất cả NFT" },
    { to: "/mynfts", label: "👛 NFT của tôi" },
  ];

  return (
    <>
      {tabs.map((tab) => (
        <Link
          key={tab.to}
          to={tab.to}
          className={`px-4 py-2 ${location.pathname === tab.to ? "active" : "inactive"}`}
        >
          {tab.label}
        </Link>
      ))}
    </>
  );
};

export default Navbar;