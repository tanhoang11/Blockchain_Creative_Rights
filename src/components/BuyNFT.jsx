import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Web3 from "web3";
import contractABI from "../abi/CreativeRightsNFT.json";

const CONTRACT_ADDRESS = "0x3dcA48ac92CE02979685c4018a6DD787b18c2887";

const BuyNFT = ({ wallet }) => {
  const location = useLocation();
  const [tokenId, setTokenId] = useState("");
  const [currentOwner, setCurrentOwner] = useState("");
  const [tokenIdBuy, setTokenIdBuy] = useState("");
  const [recipient, setRecipient] = useState("");
  const [priceEth, setPriceEth] = useState("");
  const [status, setStatus] = useState("");

  // Pre-fill form with data from navigation state
  useEffect(() => {
    if (location.state) {
      setTokenIdBuy(location.state.tokenId || "");
      setRecipient(location.state.recipient || wallet || "");
    }
  }, [location.state, wallet]);

  const handleCheckOwner = async () => {
    if (!tokenId) return alert("Vui lòng nhập Token ID");

    try {
      const web3 = new Web3(window.ethereum);
      const contract = new web3.eth.Contract(contractABI, CONTRACT_ADDRESS);
      const owner = await contract.methods.ownerOf(tokenId).call();
      setCurrentOwner(owner);
    } catch (err) {
      console.error(err);
      setCurrentOwner("❌ Không tìm thấy Token ID");
    }
  };

  const handleTransfer = async () => {
    if (!tokenIdBuy || !recipient || !priceEth) return alert("Vui lòng nhập đầy đủ thông tin!");

    try {
      const web3 = new Web3(window.ethereum);
      if (!web3.utils.isAddress(recipient)) return alert("Địa chỉ ví không hợp lệ!");

      const valueInWei = web3.utils.toWei(priceEth, "ether");
      const contract = new web3.eth.Contract(contractABI, CONTRACT_ADDRESS);

      setStatus("⏳ Đang gửi giao dịch...");

      await contract.methods
        .transferWithPayment(tokenIdBuy, recipient)
        .send({ from: wallet, value: valueInWei });

      setStatus("✅ Chuyển nhượng thành công!");
      setTokenIdBuy("");
      setRecipient("");
      setPriceEth("");
    } catch (err) {
      console.error(err);
      setStatus("❌ Lỗi khi chuyển nhượng.");
    }
  };

  return (
    <div className="card">
      <h2 className="text-xl font-semibold">🎨 Quản lý NFT bản quyền</h2>
      <div className="upload-form">
        <div className="form-group">
          <h3 className="text-lg font-medium">🔍 Kiểm tra chủ sở hữu NFT</h3>
          <input
            type="number"
            className="input"
            placeholder="Nhập Token ID"
            value={tokenId}
            onChange={(e) => setTokenId(e.target.value)}
          />
          <button className="button button-indigo" onClick={handleCheckOwner}>
            Kiểm tra
          </button>
          {currentOwner && (
            <p className={currentOwner.includes("Không") ? "status-error" : "status-success"}>
              👑 Chủ sở hữu: {currentOwner}
            </p>
          )}
        </div>
        <hr className="my-4 border-gray-700" />
        <div className="form-group">
          <h3 className="text-lg font-medium">💸 Chuyển nhượng quyền sở hữu</h3>
          <input
            type="number"
            className="input"
            placeholder="Token ID muốn chuyển"
            value={tokenIdBuy}
            onChange={(e) => setTokenIdBuy(e.target.value)}
          />
          <input
            type="text"
            className="input"
            placeholder="Địa chỉ ví người nhận"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
          />
          <input
            type="text"
            className="input"
            placeholder="Giá chuyển nhượng (ETH)"
            value={priceEth}
            onChange={(e) => setPriceEth(e.target.value)}
          />
          <button className="button button-primary" onClick={handleTransfer}>
            Thực hiện chuyển nhượng
          </button>
          {status && (
            <p
              className={
                status.includes("thành công")
                  ? "status-success"
                  : status.includes("lỗi")
                  ? "status-error"
                  : "status-loading"
              }
            >
              {status.includes("Đang") && <span className="spinner"></span>}
              {status}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BuyNFT;