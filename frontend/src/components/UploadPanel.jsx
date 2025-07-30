import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import "./UploadPanel.css";
import { Html5Qrcode } from 'html5-qrcode';
import Tesseract from 'tesseract.js';
import {
  FaUpload,
  FaFileExcel,
  FaExpand,
  FaFileImage,
  FaFilePdf,
  FaFileAlt
} from "react-icons/fa";
import { MdError, MdCheckCircle } from "react-icons/md";
import { countries } from '../countries';
import CountrySelector from './CountrySelector';

const API_URL = 'http://localhost:5001/api/upload';

const fileTypes = {
  excel: '.xls,.xlsx,text/csv',
  jpg: 'image/jpeg',
  png: 'image/png',
};

const UploadPanel = () => {
  const [uploadType, setUploadType] = useState('numbers');
  const [isUploaded, setIsUploaded] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("India");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [notepadText, setNotepadText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [uploadResult, setUploadResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  const fileInputRef = useRef(null);
  const qrFileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleScanFile = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsScanning(true);
    event.target.value = null;

    try {
      const html5QrCode = new Html5Qrcode("qr-reader");
      const decodedText = await html5QrCode.scanFile(file, false);
      setNotepadText(prev => prev + decodedText);
      alert("QR Code scanned successfully!");
    } catch (qrError) {
      console.log("No QR code found, trying OCR...");
      try {
        const { data: { text } } = await Tesseract.recognize(file, 'eng', { logger: m => console.log(m) });
        if (text) {
          setNotepadText(prev => prev + text);
          alert("Text extracted successfully!");
        } else {
          alert("No text could be recognized in the image.");
        }
      } catch (ocrError) {
        alert("Could not extract text from the image.");
      }
    } finally {
      setIsScanning(false);
    }
  };

  const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files);
    setSelectedFiles(newFiles);
    setIsUploaded(false);
    setUploadResult(null);
  };

  const handleButtonClick = (type) => {
    if (type === 'scan') {
      qrFileInputRef.current.click();
    } else {
      fileInputRef.current.accept = fileTypes[type] || '*/*';
      fileInputRef.current.click();
    }
  };

  const handleUpload = async () => {
    setIsLoading(true);
    setMessage("");
    setUploadResult(null);
    try {
      let response;
      if (selectedFiles.length > 0) {
        const formData = new FormData();
        selectedFiles.forEach(file => formData.append('files', file));
        formData.append('type', uploadType);
        response = await axios.post(`${API_URL}/file`, formData);
      } else if (notepadText.trim() !== "") {
        response = await axios.post(`${API_URL}/text`, { notepadText, type: uploadType });
      } else {
        setMessage(`Please select a file or enter ${uploadType === 'numbers' ? 'numbers' : 'emails'}.`);
        setIsLoading(false);
        return;
      }
      setMessage("Upload successful!");
      setUploadResult(response.data.result);
      setIsUploaded(true);
      setSelectedFiles([]);
      setNotepadText("");
    } catch (error) {
      setMessage("Upload failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="upload-container">
      {isScanning && (
        <div className="scanner-modal-overlay">
          <div className="scanning-indicator">
            <p>Scanning Image...</p>
            <span>This may take a moment.</span>
          </div>
        </div>
      )}

      <div className="upload-card">
        <div id="qr-reader" style={{ display: 'none' }}></div>
        <input type="file" accept="image/*" ref={qrFileInputRef} onChange={handleScanFile} style={{ display: 'none' }} />
        <input type="file" multiple ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} />

        <div className="upload-type-toggle">
          <label className={uploadType === 'numbers' ? 'active' : ''}>
            <input type="radio" name="uploadType" value="numbers" checked={uploadType === 'numbers'} onChange={(e) => setUploadType(e.target.value)} />
            Upload Numbers
          </label>
          <label className={uploadType === 'emails' ? 'active' : ''}>
            <input type="radio" name="uploadType" value="emails" checked={uploadType === 'emails'} onChange={(e) => setUploadType(e.target.value)} />
            Upload Emails
          </label>
        </div>

        <label className="label">Select Country</label>
        <div className="dropdown-container">
          <CountrySelector countries={countries} selectedCountry={selectedCountry} onSelectCountry={setSelectedCountry}/>
        </div>

        {isUploaded && (
          <div className="action-buttons">
            <button className="small-btn" onClick={() => navigate("/followup")}>Follow Up Calls</button>
            <button className="small-btn" onClick={() => navigate("/chathistory")}>Chat History</button>
          </div>
        )}

        <label className="label">Enter Text</label>
        <div className="notepad-container">
          <textarea className="notepad-input" placeholder="Start typing here..." value={notepadText} onChange={(e) => setNotepadText(e.target.value)}/>
        </div>

        <label className="label">Upload {uploadType === 'numbers' ? 'Number' : 'Email'} List</label>
        <div className="button-row">
            <button className="upload-btn" onClick={() => handleButtonClick('excel')}><FaFileExcel /><span>Excel/CSV</span></button>
            <button className="upload-btn" onClick={() => handleButtonClick('scan')}><FaExpand /><span>Scan</span></button>
            <button className="upload-btn" onClick={() => handleButtonClick('jpg')}><FaFileImage /><span>JPG</span></button>
            <button className="upload-btn" onClick={() => handleButtonClick('png')}><FaFilePdf /><span>PNG</span></button>
            <button className="upload-btn blue" onClick={handleUpload} disabled={(notepadText.trim() === '' && selectedFiles.length === 0) || isLoading}>
              <FaUpload />
              <span>{isLoading ? 'UPLOADING...' : 'UPLOAD'}</span>
            </button>
        </div>
        
        {message && <p className="status-message">{message}</p>}

        {selectedFiles.length > 0 && (
          <div className="file-dashboard">
            <h4 className="dashboard-title">Selected Files:</h4>
            <ul className="file-list">
              {selectedFiles.map((file, index) => (
                <li key={index} className="file-list-item">
                  <FaFileAlt className="file-icon" />
                  <span className="file-name">{file.name}</span>
                  <span className="file-size">{(file.size / 1024).toFixed(2)} KB</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {isUploaded && uploadResult && (
          <div className="results">
            <p><strong>{uploadResult.totalSubmitted}</strong> total {uploadResult.type}</p>
            <ul>
              <li className="result-group">
                <div className="result-row clickable">
                  <MdError className="icon-red" />
                  <span>{uploadResult.totalWrong} Total Invalid {uploadResult.type === 'numbers' ? 'Numbers' : 'Emails'} Removed</span>
                </div>
                {uploadResult.totalDuplicates > 0 && (
                  <div className="result-row clickable">
                    <MdError className="icon-orange" />
                    <span>{uploadResult.totalDuplicates} Duplicate {uploadResult.type === 'numbers' ? 'Numbers' : 'Emails'} Removed</span>
                  </div>
                )}
                <hr className="inner-separator" />
                <div className="result-row clickable" onClick={() => navigate(uploadResult.type === 'numbers' ? "/WhatsAppMessage" : "/EmailMessage", { state: { activeList: uploadResult.activeList } })}>
                  <MdCheckCircle className="icon-green" />
                  <span>{uploadResult.totalActive} Total Active {uploadResult.type === 'numbers' ? 'WhatsApp Numbers' : 'Emails'}</span>
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