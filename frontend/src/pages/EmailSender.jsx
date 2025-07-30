import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import './MessageSender.css';
import { useEditor, EditorContent } from '@tiptap/react';
import Image from '@tiptap/extension-image';
import StarterKit from '@tiptap/starter-kit';
import MenuBar from './MenuBar';

const API_URL ='http://localhost:5001/api/emails';
const IMAGE_UPLOAD_URL ='http://localhost:5001/api/upload/image';

const EmailSender = () => {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [emailList, setEmailList] = useState([]);
  const [target, setTarget] = useState('all');
  const [selectedRows, setSelectedRows] = useState(new Set());
  const location = useLocation();

  const uploadImageToServer = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    try {
      const response = await axios.post(IMAGE_UPLOAD_URL, formData);
      return response.data.url;
    } catch (error) {
      console.error("Failed to upload image:", error);
      alert("Image upload failed. Check the console and make sure your backend server is running.");
      return null;
    }
  };

  const editor = useEditor({
    extensions: [
      StarterKit,
      // ✅ THIS IS THE FINAL FIX
      // We are configuring the Image extension to add a special attribute
      Image.configure({
        HTMLAttributes: {
          referrerpolicy: 'no-referrer',
        },
      }),
    ],
    editorProps: {
      handlePaste: (view, event) => {
        const items = (event.clipboardData || event.originalEvent.clipboardData).items;
        for (const item of items) {
          if (item.type.startsWith("image/")) {
            const file = item.getAsFile();
            if (file) {
              uploadImageToServer(file).then(url => {
                if (url && editor) {
                  editor.chain().focus().setImage({ src: url }).run();
                }
              });
            }
            return true;
          }
        }
        return false;
      },
    },
    onUpdate: ({ editor }) => {
      setBody(editor.getHTML());
    },
  });

  useEffect(() => {
    if (location.state && location.state.activeList) {
      const formattedData = location.state.activeList.map(email => ({
        email: email,
        status: 'Valid',
        date: new Date().toLocaleDateString('en-GB').replace(/\//g, '-'),
      }));
      setEmailList(formattedData);
    }
  }, [location.state]);

  const handleFileAttach = (e) => {
    const newFiles = Array.from(e.target.files);
    setAttachments(prevFiles => [...prevFiles, ...newFiles]);
  };

  const handleRowSelect = (email) => {
    const newSelectedRows = new Set(selectedRows);
    if (newSelectedRows.has(email)) {
      newSelectedRows.delete(email);
    } else {
      newSelectedRows.add(email);
    }
    setSelectedRows(newSelectedRows);
  };

  const handleSendEmail = async () => {
    let finalList = [];
    if (target === 'all') {
      finalList = emailList.map(item => item.email);
    } else {
      finalList = Array.from(selectedRows);
    }
    if (finalList.length === 0 || !subject.trim() || !body.trim() || body === '<p></p>') {
      alert('Please fill out recipients, subject, and body.');
      return;
    }
    const formData = new FormData();
    formData.append('emails', JSON.stringify(finalList));
    formData.append('subject', subject);
    formData.append('body', body);
    attachments.forEach(file => {
      formData.append('attachments', file);
    });
    try {
      alert('Sending email...');
      const response = await axios.post(`${API_URL}/send`, formData);
      alert(response.data.message);
    } catch (error) {
      alert('Failed to send emails.');
      console.error(error);
    }
  };

  return (
    <div className="message-panel">
      <div className="left-panel">
        <h3>Email <span className="count">Emails {emailList.length}</span></h3>
        <table>
          <thead>
            <tr>
              <th>Select</th>
              <th>Email Address</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {emailList.map((item, index) => (
              <tr key={index}>
                <td>
                  <input type="checkbox" checked={selectedRows.has(item.email)} onChange={() => handleRowSelect(item.email)} />
                </td>
                <td>{item.email}</td>
                <td>{item.status}</td>
                <td>{item.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="right-panel">
        <input type="text" className="subject-input" placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
        <div className="text-editor">
          <MenuBar editor={editor} />
          <EditorContent editor={editor} />
        </div>
        <div className="options1">
          <div className="options">
            <div className="attach-image">
              <label htmlFor="file-upload" className="image-upload-label">
                <span>📎 Attach Files</span>
              </label>
              <input type="file" id="file-upload" onChange={handleFileAttach} multiple style={{ display: 'none' }} />
            </div>
            <label>
              <input type="checkbox" /> Schedule
            </label>
          </div>
          <div className="target-options">
            <label>Target</label>
            <div>
              <label>
                <input type="radio" name="target" value="all" checked={target === 'all'} onChange={() => setTarget('all')} /> All
              </label>
              <label>
                <input type="radio" name="target" value="selected" checked={target === 'selected'} onChange={() => setTarget('selected')} /> Selected Only
              </label>
            </div>
          </div>
          {attachments.length > 0 && (
            <div className="attachment-list">
              <p>Attached:</p>
              <ul>
                {attachments.map((file, index) => (
                  <li key={index}>{file.name}</li>
                ))}
              </ul>
            </div>
          )}
          <button className="send-button" onClick={handleSendEmail}>
            Proceed to Send Email
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailSender;