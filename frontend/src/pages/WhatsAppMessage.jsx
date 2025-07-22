import React, { useState } from 'react';
import './MessageSender.css';
import paperclipIcon from '../assets/imgicon.png'; // Adjust path if needed

const dummyData = Array(12).fill({
  phone: '+91 7457024841',
  type: 'WhatsApp',
  status: 'Valid',
  date: '14-07-2025',
  time: '14:58',
});

const MessageSender = ({ type }) => {
  const [image, setImage] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  return (
    <div className="message-panel">
      <div className="left-panel">
        <h3>{type} <span className="count"> WhatsApp 100</span></h3>
        <table>
          <thead>
            <tr>
              <th>Phone Number</th>
              <th>Type</th>
              <th>Status</th>
              <th>Date</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {dummyData.map((item, index) => (
              <tr key={index}>
                <td>{item.phone}</td>
                <td>{item.type}</td>
                <td>{item.status}</td>
                <td>{item.date}</td>
                <td>{item.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="right-panel">
        <textarea
          placeholder={`Hello 👋\n\nThis is [Your Name] from [Your Business/Service Name].\n\nWe hope you're doing well! We wanted to personally reach out and let you know that we provide [Your Service/Products] in your area — with fast service, genuine support, and affordable rates.`}
        />

        <div className="options1">
          <div className="options">
            <div className="attach-image">
              <label htmlFor="file-upload" className="image-upload-label">
                <img src={paperclipIcon} alt="Attach" className="icon" />
                Attach Image
              </label>
              <input
                type="file"
                id="file-upload"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
            </div>

            <label>
              <input type="checkbox" /> Schedule
            </label>
          </div>

          <div className="target-options">
            <label>Target</label>
            <div>
              <label><input type="radio" name="target" /> All</label>
              <label><input type="radio" name="target" /> Selected Only</label>
            </div>
          </div>

          {image && (
            <div className="preview">
              <p>Preview:</p>
              <img src={image} alt="Preview" className="preview-image" />
            </div>
          )}

          <button className="send-button">Proceed to Send Message</button>
        </div>
      </div>
    </div>
  );
};

export default MessageSender;
