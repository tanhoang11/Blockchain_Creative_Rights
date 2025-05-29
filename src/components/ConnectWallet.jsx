import React, { useEffect, useState } from "react";

const ConnectWallet = ({ onWalletConnected }) => {
  const [currentAccount, setCurrentAccount] = useState("");

  const checkWallet = async () => {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({ method: "eth_accounts" });
      if (accounts.length > 0) {
        setCurrentAccount(accounts[0]);
        onWalletConnected(accounts[0]);
      }
    }
  };

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        setCurrentAccount(accounts[0]);
        onWalletConnected(accounts[0]);
      } catch (err) {
        console.error("Người dùng từ chối kết nối", err);
      }
    } else {
      alert("Vui lòng cài đặt MetaMask!");
    }
  };

  useEffect(() => {
    checkWallet();
    window.ethereum?.on("accountsChanged", (accounts) => {
      if (accounts.length > 0) {
        setCurrentAccount(accounts[0]);
        onWalletConnected(accounts[0]);
      } else {
        setCurrentAccount("");
      }
    });
  }, []);

  return (
    <div className="flex items-center">
      {currentAccount ? (
        <p className="status-success flex items-center gap-2">
          <span className="spinner"></span>
          Ví đang dùng: {currentAccount.slice(0, 6)}...{currentAccount.slice(-4)}
        </p>
      ) : (
        <button className="button button-secondary" onClick={connectWallet}>
          Kết nối ví MetaMask
        </button>
      )}
    </div>
  );
};

export default ConnectWallet;