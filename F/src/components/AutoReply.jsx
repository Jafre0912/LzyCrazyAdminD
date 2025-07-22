import React, { useState } from 'react';
import './AutoReply.css';

const users = [
  { name: 'Emily Johnson', initials: 'EJ', time: '12:34 AM', message: "I'll take a look, thank you.", color: '#4caf50' },
  { name: 'Daniel Smith', initials: 'DS', time: '12:34 AM', message: "I'll take a look, thank you.", color: '#2196f3' },
  { name: 'Sophia Lee', initials: 'SL', time: '12:34 AM', message: "I'll take a look, thank you.", color: '#9c27b0' },
  { name: 'Michael Brown', initials: 'MB', time: '12:34 AM', message: "I'll take a look, thank you.", color: '#ff9800' },
  { name: 'Emma Davis', initials: 'ED', time: '12:34 AM', message: "I'll take a look, thank you.", color: '#f44336' },
  { name: 'Olivia Wilson', initials: 'OW', time: '12:34 AM', message: "I'll take a look, thank you.", color: '#00bcd4' },
  { name: 'Emily Johnson', initials: 'EJ', time: '12:34 AM', message: "I'll take a look, thank you.", color: '#4caf50' },
];

const AutoReply = () => {
  const [selectedUser, setSelectedUser] = useState(users[0]);

  return (
    <div className="arc-wrapper">
      <div className="arc-chat-container">
        {/* Sidebar */}
        <div className="arc-sidebar">
          <h3 className="arc-sidebar-title">Replies</h3>
          {users.map((user, i) => (
            <div
              key={i}
              className={`arc-user ${selectedUser.name === user.name ? 'active' : ''}`}
              onClick={() => setSelectedUser(user)}
            >
              <div className="arc-initials" style={{ backgroundColor: user.color }}>
                {user.initials}
              </div>
              <div className="arc-user-info">
                <div className="arc-user-name">{user.name}</div>
                <div className="arc-user-msg">{user.message}</div>
              </div>
              <div className="arc-time">{user.time}</div>
            </div>
          ))}
        </div>

        {/* Chatbox */}
        <div className="arc-chatbox">
          <div className="arc-chat-header">
            <div className="arc-chat-user">
              <div className="arc-initials" style={{ backgroundColor: selectedUser.color }}>
                {selectedUser.initials}
              </div>
              <span>{selectedUser.name}</span>
            </div>
            <div className="arc-chat-time">12:34 AM</div>
          </div>

          {/* Messages */}
          <div className="arc-messages">
            <div className="arc-msg arc-received">I'll text you when I arrive</div>
            <div className="arc-msg arc-sent">
              <p>
                Hello 👋<br />
                This is [Your Name] from [Your Business] team.<br /><br />
                We hope things are well! We wanted to follow up and share a quick message
                including helpful details, pictures, and appointment options for your vehicle
                service visit.
              </p>
            </div>
            <div className="arc-msg arc-sent">
              <p>
                Hi {selectedUser.name.split(' ')[0]}! 👋<br />
                Thanks for your message! 😊<br /><br />
                Let us know if you have any questions and we’ll continue your
                process!
                In the meantime, here’s a link to all of your information and next steps.<br /><br />
                Have a great day!<br />
                - Team [Your Co.]
              </p>
            </div>
          </div>

          {/* Input Bar */}
          <div className="arc-input-bar">
            <input className="arc-input-field" placeholder="Type Message..." />
            <button className="arc-send-btn">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="20"
                viewBox="0 0 24 24"
                width="20"
                fill="#fff"
              >
                <path d="M0 0h24v24H0z" fill="none" />
                <path d="M2.01 21L23 12 2.01 3v7l15 2-15 2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutoReply;
