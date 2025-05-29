import React, { useState } from "react";
import axios from "axios";
import Web3 from "web3";
import contractABI from "../abi/CreativeRightsNFT.json";

const CONTRACT_ADDRESS = "0x3dcA48ac92CE02979685c4018a6DD787b18c2887";
const PINATA_JWT = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJlMDM1ZTY0ZS0xYTg2LTQ5Y2QtYTcxNS03NGMwZDlhZWYyNzYiLCJlbWFpbCI6ImhvYW5nMTAwMzMzQGRvbmdhLmVkdS52biIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6IkZSQTEifSx7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6Ik5ZQzEifV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiIyOTRiYWNkNDFjMTY1ZmE0MzUwYSIsInNjb3BlZEtleVNlY3JldCI6IjNlNGE3YzQ0NDI4Y2RlNWZhZTAzNmI3MDk0MWY1Njg0M2EzZDBhMGQzZjE3NTM2MTJjOWNkZWE4NWJjNGU5ZjMiLCJleHAiOjE3Nzk5Mzk3NDF9.E2VhYnHhlkzzlOkmJB5Asdoa8HtFsb9XcUxH1Kb32MI";

const UploadArtwork = ({ wallet }) => {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [assetType, setAssetType] = useState("");
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const [preview, setPreview] = useState(null);

  const supportedFileTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "audio/mpeg",
    "audio/wav",
    "application/pdf",
    "application/zip",
  ];

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && supportedFileTypes.includes(selectedFile.type)) {
      setFile(selectedFile);
      if (selectedFile.type.startsWith("image/")) {
        setPreview(URL.createObjectURL(selectedFile));
      } else {
        setPreview(null); // Non-image files don't get a preview
      }
    } else {
      setFile(null);
      setPreview(null);
      alert(
        "Vui lòng chọn file hợp lệ: hình ảnh (JPEG, PNG, GIF), âm thanh (MP3, WAV), PDF, hoặc ZIP."
      );
    }
  };

  const handleUpload = async () => {
    if (!file || !wallet || !name || !desc || !assetType) {
      return alert("Vui lòng điền đầy đủ thông tin và chọn file.");
    }

    try {
      setStatus("Đang upload file lên IPFS...");
      const formData = new FormData();
      formData.append("file", file);

      // Add metadata to Pinata
      const metadata = {
        name,
        description: desc,
        assetType,
      };
      formData.append(
        "pinataMetadata",
        JSON.stringify({
          name: `${name}.${file.name.split(".").pop()}`,
          keyvalues: metadata,
        })
      );

      const resFile = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          maxContentLength: Infinity,
          headers: {
            "Content-Type": `multipart/form-data`,
            Authorization: PINATA_JWT,
          },
        }
      );

      const ipfsHash = resFile.data.IpfsHash;
      setStatus("Gửi giao dịch đến blockchain...");

      const web3 = new Web3(window.ethereum);
      const contract = new web3.eth.Contract(contractABI, CONTRACT_ADDRESS);

      await contract.methods
        .registerArtwork(name, desc, ipfsHash)
        .send({ from: wallet });

      setStatus("✅ Đăng ký thành công!");
      setName("");
      setDesc("");
      setAssetType("");
      setFile(null);
      setPreview(null);
    } catch (err) {
      console.error(err);
      setStatus("❌ Đã có lỗi xảy ra.");
    }
  };

  return (
    <div className="card">
      <h2 className="text-xl font-semibold">📤 Đăng ký tác phẩm mới</h2>
      <div className="upload-form">
        <div className="form-group">
          <label className="form-label">Tên tác phẩm</label>
          <input
            type="text"
            className="input"
            placeholder="Nhập tên tác phẩm"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Mô tả</label>
          <textarea
            className="input"
            placeholder="Nhập mô tả tác phẩm"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Loại tài sản</label>
          <select
            className="input"
            value={assetType}
            onChange={(e) => setAssetType(e.target.value)}
          >
            <option value="">Chọn loại tài sản</option>
            <option value="image">Hình ảnh</option>
            <option value="music">Bản nhạc</option>
            <option value="book">Sách (PDF)</option>
            <option value="software">Phần mềm (ZIP)</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Chọn file</label>
          <input
            type="file"
            className="file-input"
            onChange={handleFileChange}
            accept="image/jpeg,image/png,image/gif,audio/mpeg,audio/wav,application/pdf,application/zip"
          />
          {preview && <img src={preview} alt="Preview" className="image-preview mt-2" />}
          {!preview && file && (
            <p className="text-sm text-gray-600 mt-2">
              File đã chọn: {file.name} ({file.type})
            </p>
          )}
        </div>
        <button type="button" className="button button-primary" onClick={handleUpload}>
          Đăng ký NFT
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
  );
};

export default UploadArtwork;