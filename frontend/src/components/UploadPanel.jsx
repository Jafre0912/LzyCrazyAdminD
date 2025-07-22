import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./UploadPanel.css";
// ✅ Imports for Save as Word functionality
import { Document, Packer, Paragraph } from 'docx';
import { saveAs } from 'file-saver';
// ✅ All icons included
import {
  FaUpload,
  FaFileExcel,
  FaExpand,
  FaFileImage,
  FaFilePdf,
  FaFileAlt,
  FaSave
} from "react-icons/fa";
import { MdError, MdCheckCircle } from "react-icons/md";
import { countries } from '../countries'; 
import CountrySelector from './CountrySelector';

const fileTypes = {
  excel: '.xls,.xlsx',
  jpg: 'image/jpeg',
  png: 'image/png',
  scan: 'image/jpeg,image/png,.pdf',
};

const UploadPanel = () => {
  const [isUploaded, setIsUploaded] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("India");
  const [selectedFiles, setSelectedFiles] = useState([]);
  
  // ✅ State for the notepad text
  const [notepadText, setNotepadText] = useState("");

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // ✅ Function to Save as Word file
  const handleSaveAsDoc = () => {
    if (!notepadText.trim()) {
      alert("Please enter some text before saving.");
      return;
    }
    const doc = new Document({
      sections: [{
        children: [ new Paragraph({ text: notepadText }) ],
      }],
    });
    Packer.toBlob(doc).then(blob => {
      saveAs(blob, "MyDocument.docx");
    });
  };

  const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files);
    setSelectedFiles(prevFiles => [...prevFiles, ...newFiles]);
    setIsUploaded(false); 
  };
  
  const handleButtonClick = (type) => {
    fileInputRef.current.accept = fileTypes[type] || '*/*';
    fileInputRef.current.click();
  };
  
  const handleUpload = () => {
    if (selectedFiles.length > 0) {
      setIsUploaded(true);
      setSelectedFiles([]);
    }
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
            <button className="small-btn" onClick={() => navigate("/followup")}>Follow Up Calls</button>
            <button className="small-btn" onClick={() => navigate("/chathistory")}>Chat History</button>
          </div>
        )}
        
        {/* ✅ The Notepad section is now back */}
        <label className="label">Enter Text</label>
        <div className="notepad-container">
          <textarea
            className="notepad-input"
            placeholder="Start typing here..."
            value={notepadText}
            onChange={(e) => setNotepadText(e.target.value)}
          />
          <button className="save-doc-btn" onClick={handleSaveAsDoc}>
            <FaSave />
            <span>Save</span>
          </button>
        </div>

        <label className="label">Upload Number List</label>
        <div className="button-row">
            <button className="upload-btn" onClick={() => handleButtonClick('excel')}><FaFileExcel /><span>Excel</span></button>
            <button className="upload-btn" onClick={() => handleButtonClick('scan')}><FaExpand /><span>Scan</span></button>
            <button className="upload-btn" onClick={() => handleButtonClick('jpg')}><FaFileImage /><span>JPG</span></button>
            <button className="upload-btn" onClick={() => handleButtonClick('png')}><FaFilePdf /><span>PNG</span></button>
            <button className="upload-btn blue" onClick={handleUpload} disabled={selectedFiles.length === 0}><FaUpload /><span>UPLOAD</span></button>
        </div>

        <input type="file" multiple ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }}/>

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

        {isUploaded && (
          <div className="results">
            <p><strong>500</strong> Total Numbers</p>
            <ul>
              <li className="result-group">
                <div className="result-row clickable"><MdError className="icon-red" /><span>100 Total No List Remove Wrong Numbers</span></div>
                <div className="result-row clickable"><MdError className="icon-orange" /><span>75 Total No List Remove Same Numbers</span></div>
                <div className="result-row clickable" onClick={() => navigate("/autoreply")}><MdError className="icon-pink" /><span>50 Total Lazy Crazy Numbers</span></div>
                <div className="result-row clickable" onClick={() => navigate("/textmessage")}><MdCheckCircle className="icon-white" /><span>100 Total No List Text Numbers</span></div>
                <hr className="inner-separator" />
                <div className="result-row clickable" onClick={() => navigate("/WhatsAppMessage")}><MdCheckCircle className="icon-green" /><span>100 Total Active WhatsApp Numbers</span></div>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadPanel;