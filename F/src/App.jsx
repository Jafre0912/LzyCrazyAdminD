import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
import TextMessage from "./pages/TextMessage.jsx";
import WhatsAppMessage from "./pages/WhatsAppMessage.jsx";
import AutoReplyPage from "./pages/AutoReplyPage.jsx";
import FollowUp from "./pages/FollowUp.jsx";
import ChatHistoryPage from "./pages/ChatHistoryPage.jsx";

const App = () => {
  return (
    
    <Router>
      <Routes>
          
        <Route path="/" element={<Dashboard />} />
        <Route path="/textmessage" element={<TextMessage />} />
        <Route path="/whatsappmessage" element={<WhatsAppMessage />} />
        <Route path="/autoreply" element={<AutoReplyPage />} />
        <Route path="/followup" element={<FollowUp />} />
        <Route path="/chathistory" element={<ChatHistoryPage />} />
      
      </Routes>
    </Router>
  );
};

export default App;
