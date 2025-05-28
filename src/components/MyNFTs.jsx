import React, { useEffect, useState } from "react";
import Web3 from "web3";
import contractABI from "../abi/CreativeRightsNFT.json";

const CONTRACT_ADDRESS = "0x3dcA48ac92CE02979685c4018a6DD787b18c2887";

function MyNFTs() {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [myNFTs, setMyNFTs] = useState([]);

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        setAccount(accounts[0]);

        const instance = new web3.eth.Contract(contractABI, CONTRACT_ADDRESS);
        setContract(instance);

        await loadMyNFTs(instance, accounts[0]);
      }
    };

    init();
  }, []);

  const loadMyNFTs = async (contract, account) => {
    try {
      const tokenIds = await contract.methods.getMyTokenIds().call({ from: account });
      const nfts = await Promise.all(
        tokenIds.map(async (tokenId) => {
          const info = await contract.methods.getArtworkInfo(tokenId).call();
          return {
            tokenId,
            name: info[0],
            description: info[1],
            ipfsHash: info[2],
            owner: info[3],
          };
        })
      );
      setMyNFTs(nfts);
    } catch (err) {
      console.error("Lỗi khi tải NFT:", err);
    }
  };

  const handleDelete = async (tokenId) => {
    if (!contract || !account) return;
    try {
      const confirm = window.confirm(`Bạn có chắc muốn xoá NFT #${tokenId}?`);
      if (!confirm) return;

      await contract.methods.deleteArtwork(tokenId).send({ from: account });
      alert(`Đã xoá NFT #${tokenId}`);
      await loadMyNFTs(contract, account);
    } catch (err) {
      alert("Lỗi khi xoá NFT");
      console.error(err);
    }
  };

  return (
    <div className="card">
      <h2>📦 NFT của tôi</h2>
      {myNFTs.length === 0 ? (
        <p className="status-error">Bạn chưa có NFT nào.</p>
      ) : (
        <div className="grid">
          {myNFTs.map((nft) => (
            <div key={nft.tokenId} className="card">
              <img
                src={`https://ipfs.io/ipfs/${nft.ipfsHash}`}
                alt={nft.name}
                className="image-preview"
                onError={(e) => (e.target.style.display = "none")}
              />
              <h3>{nft.name}</h3>
              <p className="text-sm text-gray-600">{nft.description}</p>
              <p className="text-sm">Token ID: {nft.tokenId}</p>
              <button
                onClick={() => handleDelete(nft.tokenId)}
                className="button button-danger mt-4"
              >
                🗑️ Xoá
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyNFTs;