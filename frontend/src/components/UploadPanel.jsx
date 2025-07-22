import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UploadPanel.css";
import {
  FaUpload,
  FaFileExcel,
  FaCopy,
  FaExpand,
  FaFileImage,
  FaFilePdf
} from "react-icons/fa";
import { MdError, MdCheckCircle } from "react-icons/md";
import { countries } from '../countries'; 
import CountrySelector from './CountrySelector'; // Using the custom component

const UploadPanel = () => {
  const [showResult, setShowResult] = useState(false);
  const [selectedUploadType, setSelectedUploadType] = useState("");
  const [isUploaded, setIsUploaded] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("India");
  
  const navigate = useNavigate();

  const handleUpload = () => {
    if (selectedUploadType) {
      setShowResult(true);
      setIsUploaded(true);
    }
  };

  const handleSelectUploadType = (type) => {
    setSelectedUploadType(type);
    setIsUploaded(false); 
    setShowResult(false);
  };

  return (
    <div className="upload-container">
      <div className="upload-card">
        <label className="label">Select Country</label>
        <div className="dropdown-container">
          <CountrySelector
            countries={countries}
            selectedCountry={selectedCountry}
            onSelectCountry={setSelectedCountry}
          />
        </div>
        
        {isUploaded && (
          <div className="action-buttons">
            <button className="small-btn" onClick={() => navigate("/followup")}>
              Follow Up Calls
            </button>
            <button className="small-btn" onClick={() => navigate("/chathistory")}>
              Chat History
            </button>
          </div>
        )}
        
        <label className="label">Upload Number List</label>
        <div className="button-row">
           <button className={`upload-btn ${selectedUploadType === "copy" ? "selected" : ""}`} onClick={() => handleSelectUploadType("copy")}>
                <FaCopy />
                <span>Copy</span>
            </button>
            <button className={`upload-btn ${selectedUploadType === "excel" ? "selected" : ""}`} onClick={() => handleSelectUploadType("excel")}>
                <FaFileExcel />
                <span>Excel</span>
            </button>
            <button className={`upload-btn ${selectedUploadType === "scan" ? "selected" : ""}`} onClick={() => handleSelectUploadType("scan")}>
                <FaExpand />
                <span>Scan</span>
            </button>
            <button className={`upload-btn ${selectedUploadType === "jpg" ? "selected" : ""}`} onClick={() => handleSelectUploadType("jpg")}>
                <FaFileImage />
                <span>JPG</span>
            </button>
            <button className={`upload-btn ${selectedUploadType === "png" ? "selected" : ""}`} onClick={() => handleSelectUploadType("png")}>
                <FaFilePdf />
                <span>PNG</span>
            </button>
            <button className={`upload-btn blue ${selectedUploadType ? "" : "disabled"}`} onClick={handleUpload} disabled={!selectedUploadType}>
                <FaUpload />
                <span>UPLOAD</span>
            </button>
        </div>

        {showResult && (
          <div className="results">
            <p><strong>500</strong> Total Numbers</p>
            <ul>
              <li className="result-group">
                <div className="result-row clickable">
                  <MdError className="icon-red" />
                  <span>100 Total No List Remove Wrong Numbers</span>
                </div>
                <div className="result-row clickable">
                  <MdError className="icon-orange" />
                  <span>75 Total No List Remove Same Numbers</span>
                </div>
                <div className="result-row clickable" onClick={() => navigate("/autoreply")}>
                  <MdError className="icon-pink" />
                  <span>50 Total Lazy Crazy Numbers</span>
                </div>
                <div className="result-row clickable" onClick={() => navigate("/textmessage")}>
                  <MdCheckCircle className="icon-white" />
                  <span>100 Total No List Text Numbers</span>
                </div>
                <hr className="inner-separator" />
                <div className="result-row clickable" onClick={() => navigate("/WhatsAppMessage")}>
                  <MdCheckCircle className="icon-green" />
                  <span>100 Total Active WhatsApp Numbers</span>
                </div>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadPanel;