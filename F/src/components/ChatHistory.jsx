import React from 'react';
import '../pages/chat.css';

const ChatHistory = () => {
  const handleDownload = (i) => {
    const blob = new Blob([`Chat History Report #${i + 1}`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-history-${i + 1}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="upload-card1">
      <h3>Chat History</h3>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Time</th>
            <th>Total Message</th>
            <th>Message Type</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {[...Array(9)].map((_, i) => (
            <tr key={i}>
              <td>14-07-2025</td>
              <td>14:58</td>
              <td>200</td>
              <td>{i % 2 === 0 ? 'WhatsApp' : 'Text'}</td>
              <td>
                <button className="dwonload">Resend</button>
                <button className="dwonload blue" onClick={() => handleDownload(i)}>
                  Download
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ChatHistory;
