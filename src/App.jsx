import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ConnectWallet from "./components/ConnectWallet";
import UploadArtwork from "./components/UploadArtwork";
import BuyNFT from "./components/BuyNFT";
import OwnershipHistory from "./components/OwnershipHistory";
import AllNFTs from "./components/AllNFTs";
import MyNFTs from "./components/MyNFTs";

function App() {
  const [walletAddress, setWalletAddress] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());

  // Log walletAddress to debug
  useEffect(() => {
    console.log("Wallet Address:", walletAddress);
  }, [walletAddress]);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format date and time for Vietnamese locale
  const formattedDate = currentTime.toLocaleDateString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const formattedTime = currentTime.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'Asia/Ho_Chi_Minh',
  });

  return (
    <Router>
      <div className="min-h-screen bg-gray-900">
        <header className="fixed top-0 left-0 right-0 bg-gray-800 shadow-lg z-50">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-indigo-400"> Creative Rights DApp</h1>
            <div className="flex items-center gap-4">
              <div className="date-time text-sm text-gray-300">
                <span>{formattedDate}</span> | <span>{formattedTime}</span>
              </div>
              <ConnectWallet onWalletConnected={setWalletAddress} />
            </div>
          </div>
        </header>
        {/* Temporarily remove walletAddress condition to test navbar rendering */}
        <nav className="navbar fixed top-16 left-0 right-0 bg-gray-800 shadow-md z-40">
          <div className="container mx-auto px-4 py-3 flex flex-wrap gap-4 justify-center">
            <Navbar />
          </div>
        </nav>
        <div className="page-container mt-28">
          <div className="container mx-auto px-4">
            {walletAddress ? (
              <Routes>
                <Route path="/allnfts" element={<AllNFTs />} />
                <Route path="/upload" element={<UploadArtwork wallet={walletAddress} />} />
                <Route path="/buy" element={<BuyNFT wallet={walletAddress} />} />
                <Route path="/history" element={<OwnershipHistory />} />
                <Route path="/mynfts" element={<MyNFTs wallet={walletAddress} />} />
                <Route path="/" element={<AllNFTs />} />

              </Routes>
            ) : (
              <div className="card text-center mt-6">
                <p className="text-gray-400">Please connect your MetaMask wallet to continue.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;