import React, { useEffect } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

const QrScanner = ({ onScanSuccess, onClose }) => {
  useEffect(() => {
    // This is the main scanner object
    const html5QrCode = new Html5Qrcode("qr-reader-container");
    
    // This function runs when a QR code is successfully scanned
    const qrCodeSuccessCallback = (decodedText, decodedResult) => {
      onScanSuccess(decodedText); // Send the scanned text back to the parent
      handleStop(); // Stop the camera
    };

    // Configuration for the scanner
    const config = { fps: 10, qrbox: { width: 250, height: 250 } };

    // Start the camera and scanner
    html5QrCode.start({ facingMode: "environment" }, config, qrCodeSuccessCallback)
      .catch(err => {
        console.error("Unable to start QR scanner", err);
      });

    const handleStop = () => {
        // Stop the camera and cleanup
        html5QrCode.stop().then(ignore => {
          console.log("QR Code scanning is stopped.");
        }).catch(err => {
          console.error("Failed to stop the QR Code scanner.", err);
        });
    }

    // Cleanup function that runs when the component is removed
    return () => {
      // Check if the scanner is running before trying to stop it
      if (html5QrCode && html5QrCode.isScanning) {
        handleStop();
      }
    };
  }, [onScanSuccess]); // Dependency array

  return (
    <div className="qr-scanner-view">
      <h4>Scan QR Code</h4>
      <div id="qr-reader-container"></div>
      <button onClick={onClose} className="close-scanner-btn">Cancel</button>
    </div>
  );
};

export default QrScanner;