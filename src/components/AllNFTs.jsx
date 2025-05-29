import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Web3 from "web3";
import contractABI from "../abi/CreativeRightsNFT.json";

const contractAddress = "0x3dcA48ac92CE02979685c4018a6DD787b18c2887";

function AllNFTs({ wallet }) {
  const [account, setAccount] = useState(null);
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      if (window.ethereum) {
        try {
          const web3 = new Web3(window.ethereum);
          const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
          setAccount(accounts[0]);

          const contract = new web3.eth.Contract(contractABI, contractAddress);

          setLoading(true);
          const tokenIds = await contract.methods.getAllRegisteredTokenIds().call();

          const nftData = await Promise.all(
            tokenIds.map(async (tokenId) => {
              const artwork = await contract.methods.getArtworkInfo(tokenId).call();
              return {
                tokenId,
                name: artwork[0],
                description: artwork[1],
                ipfsHash: artwork[2],
                owner: artwork[3],
              };
            })
          );

          setNfts(nftData);
          setLoading(false);
        } catch (error) {
          console.error(error);
          setLoading(false);
        }
      } else {
        alert("Please install MetaMask!");
      }
    }

    load();
  }, []);

  const handleBuy = (tokenId) => {
    navigate("/buy", { state: { tokenId, recipient: wallet } });
  };

  return (
    <div className="card">
      <h2 className="text-xl font-semibold">🌍 Danh sách sản phẩm</h2>
      {!account && <p className="status-error">Vui lòng kết nối MetaMask để xem sản phẩm</p>}
      {loading && (
        <p className="status-loading flex items-center gap-2">
          <span className="spinner"></span>Đang tải dữ liệu...
        </p>
      )}
      {!loading && nfts.length === 0 && (
        <p className="status-error">Chưa có sản phẩm nào được đăng ký.</p>
      )}
      <div className="grid">
        {nfts.map((nft) => (
          <div key={nft.tokenId} className="card">
            <img
              src={`https://ipfs.io/ipfs/${nft.ipfsHash}`}
              alt={nft.name}
              className="image-preview"
              onError={(e) => (e.target.style.display = "none")}
            />
            <h3 className="text-lg font-medium">{nft.name}</h3>
            <p><strong>Mô tả:</strong> {nft.description}</p>
            <p><strong>Token ID:</strong> {nft.tokenId}</p>
            <p><strong>Chủ sở hữu:</strong> {nft.owner.slice(0, 6)}...{nft.owner.slice(-4)}</p>
            {nft.owner.toLowerCase() !== wallet?.toLowerCase() && (
              <button
                className="button button-primary mt-4"
                onClick={() => handleBuy(nft.tokenId)}
              >
                💸 Mua
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default AllNFTs;