import React, { useState } from "react";
import axios from "axios";
import Web3 from "web3";
import contractABI from "../abi/CreativeRightsNFT.json";

const CONTRACT_ADDRESS = "0x3dcA48ac92CE02979685c4018a6DD787b18c2887";
const PINATA_JWT = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJlMDM1ZTY0ZS0xYTg2LTQ5Y2QtYTcxNS03NGMwZDlhZWYyNzYiLCJlbWFpbCI6ImhvYW5nMTAwMzMzQGRvbmdhLmVkdS52biIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6IkZSQTEifSx7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6Ik5ZQzEifV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiIyOTRiYWNkNDFjMTY1ZmE0MzUwYSIsInNjb3BlZEtleVNlY3JldCI6IjNlNGE3YzQ0NDI4Y2RlNWZhZTAzNmI3MDk0MWY1Njg0M2EzZDBhMGQzZjE3NTM2MTJjOWNkZWE4NWJjNGU5ZjMiLCJleHAiOjE3Nzk5Mzk3NDF9.E2VhYnHhlkzzlOkmJB5Asdoa8HtFsb9XcUxH1Kb32MI "

const UploadArtwork = ({ wallet }) => {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      setPreview(URL.createObjectURL(selectedFile));
    } else {
      setPreview(null);
    }
  };

  const handleUpload = async () => {
    if (!file || !wallet || !name || !desc) {
      return alert("Vui lòng điền đầy đủ thông tin và chọn file.");
    }

    try {
      setStatus("Đang upload file lên IPFS...");
      const formData = new FormData();
      formData.append("file", file);

      const resFile = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
        maxContentLength: "Infinity",
        headers: {
          "Content-Type": `multipart/form-data`,
          Authorization: PINATA_JWT,
        },
      });

      const ipfsHash = resFile.data.IpfsHash;
      setStatus("Gửi giao dịch đến blockchain...");

      const web3 = new Web3(window.ethereum);
      const contract = new web3.eth.Contract(contractABI, CONTRACT_ADDRESS);

      await contract.methods.registerArtwork(name, desc, ipfsHash).send({ from: wallet });

      setStatus("✅ Đăng ký thành công!");
      setName("");
      setDesc("");
      setFile(null);
      setPreview(null);
    } catch (err) {
      console.error(err);
      setStatus("❌ Đã có lỗi xảy ra.");
    }
  };

  return (
    <div className="card">
      <h2>📤 Đăng ký tác phẩm mới</h2>
      <form className="upload-form">
        <div className="form-group">
          <label>Tên tác phẩm</label>
          <input
            type="text"
            className="input"
            placeholder="Nhập tên tác phẩm"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Mô tả</label>
          <textarea
            className="input"
            placeholder="Nhập mô tả tác phẩm"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Chọn file</label>
          <input
            type="file"
            className="file-input"
            onChange={handleFileChange}
            accept="image/*"
          />
          {preview && <img src={preview} alt="Preview" className="image-preview" />}
        </div>
        <button type="button" className="button button-primary" onClick={handleUpload}>
          Đăng ký NFT
        </button>
        {status && (
          <p className={status.includes("thành công") ? "status-success" : status.includes("lỗi") ? "status-error" : "status-loading"}>
            {status.includes("Đang") && <span className="spinner"></span>}
            {status}
          </p>
        )}
      </form>
    </div>
  );
};

export default UploadArtwork;