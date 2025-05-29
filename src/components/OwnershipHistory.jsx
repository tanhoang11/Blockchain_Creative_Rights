import React, { useState } from "react";
import Web3 from "web3";
import contractABI from "../abi/CreativeRightsNFT.json";

const CONTRACT_ADDRESS = "0xAf639869074F5D24eF5eCDf10fBeB63BA5A7F922";

const OwnershipHistory = () => {
  const [tokenId, setTokenId] = useState("");
  const [history, setHistory] = useState([]);
  const [status, setStatus] = useState("");

  const fetchHistory = async () => {
    if (!tokenId) return alert("Vui lòng nhập Token ID");

    try {
      const web3 = new Web3(window.ethereum);
      const contract = new web3.eth.Contract(contractABI, CONTRACT_ADDRESS);

      setStatus("⏳ Đang truy vấn lịch sử...");

      const logs = await contract.getPastEvents("Transfer", {
        filter: { tokenId },
        fromBlock: 0,
        toBlock: "latest",
      });

      const formatted = logs.map((event) => ({
        from: event.returnValues.from,
        to: event.returnValues.to,
        txHash: event.transactionHash,
      }));

      setHistory(formatted);
      setStatus("✅ Truy vấn hoàn tất!");
    } catch (err) {
      console.error(err);
      setStatus("❌ Lỗi khi lấy lịch sử.");
    }
  };

  return (
    <div className="card">
      <h2 className="text-xl font-semibold">📜 Lịch sử chuyển nhượng NFT</h2>
      <div className="upload-form">
        <div className="form-group">
          <input
            type="number"
            className="input"
            placeholder="Nhập Token ID"
            value={tokenId}
            onChange={(e) => setTokenId(e.target.value)}
          />
          <button className="button button-indigo" onClick={fetchHistory}>
            Xem lịch sử
          </button>
        </div>
        {status && (
          <p className={status.includes("thành") ? "status-success" : status.includes("lỗi") ? "status-error" : "status-loading"}>
            {status.includes("Đang") && <span className="spinner"></span>}
            {status}
          </p>
        )}
        {history.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-medium">🧾 Danh sách giao dịch:</h3>
            <ul className="mt-4 space-y-4">
              {history.map((item, index) => (
                <li key={index} className="border-b border-gray-700 pb-2">
                  <p>
                    <strong>Từ:</strong> <span className="text-red-400">{item.from.slice(0, 6)}...{item.from.slice(-4)}</span>
                  </p>
                  <p>
                    <strong>Đến:</strong> <span className="text-green-400">{item.to.slice(0, 6)}...{item.to.slice(-4)}</span>
                  </p>
                  <p className="text-sm break-all">
                    <strong>TxHash:</strong> {item.txHash}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnershipHistory;