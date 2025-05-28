import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ConnectWallet from "./components/ConnectWallet";
import UploadArtwork from "./components/UploadArtwork";
import BuyNFT from "./components/BuyNFT";
import OwnershipHistory from "./components/OwnershipHistory";
import AllNFTs from "./components/AllNFTs";
import MyNFTs from "./components/MyNFTs";
import "./style.css"
function App() {
  const [walletAddress, setWalletAddress] = useState("");

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <header>
          <div className="container">
            <h1>🎨 Creative Rights DApp</h1>
            <ConnectWallet onWalletConnected={setWalletAddress} />
          </div>
        </header>
        {walletAddress && (
          <nav className="navbar">
            <div className="container">
              <Navbar />
            </div>
          </nav>
        )}
        <div className="page-container">
          <div className="container">
          {walletAddress ? (
            <Routes>
              <Route path="/upload" element={<UploadArtwork wallet={walletAddress} />} />
              <Route path="/buy" element={<BuyNFT wallet={walletAddress} />} />
              <Route path="/history" element={<OwnershipHistory />} />
              <Route path="/allnfts" element={<AllNFTs />} />
              <Route path="/mynfts" element={<MyNFTs wallet={walletAddress} />} />
              <Route path="*" element={<UploadArtwork wallet={walletAddress} />} />
            </Routes>
          ) : (
            <div className="card text-center mt-6">
              <p className="text-gray-600">Please connect your MetaMask wallet to continue.</p>
            </div>
          )}
        </div>
        </div>
        
      </div>
    </Router>
  );
}

export default App;