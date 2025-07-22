import React from 'react';
import '../pages/FollowUpCalls.css';

const FollowUpCalls = () => {
  return (
    <div className="fuc-container">
      <div className="fuc-card">
        <h3 className="fuc-title">Follow Up Calls</h3>
        <p className="fuc-subtitle">Contact the clients for further assistance</p>
        <table className="fuc-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone Number</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(9)].map((_, i) => (
              <tr key={i} className={i === 5 ? 'fuc-row active' : 'fuc-row'}>
                <td>Emily Johnson</td>
                <td>+1202-555-0143</td>
                <td>Unable to assist</td>
                <td>
                  <button className="fuc-call-btn">📞 Call</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FollowUpCalls;
