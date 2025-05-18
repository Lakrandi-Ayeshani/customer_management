import React, { useState } from 'react';
import { uploadExcel } from '../services/customerServices';
import './BulkUpload.css';

export default function BulkUpload() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file first.');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('file', file);
      await uploadExcel(formData);
      setMessage('File uploaded successfully!');
      setError('');
    } catch (err) {
      setError('Upload failed. Please try again.');
      setMessage('');
    }
  };

  return (
    <form className="upload-form" onSubmit={handleSubmit}>
      <input type="file" accept=".xlsx, .xls" onChange={(e) => setFile(e.target.files[0])} />
      <button type="submit">Upload</button>
      {message && <div className="success-msg">{message}</div>}
      {error && <div className="error-msg">{error}</div>}
    </form>
  );
}
