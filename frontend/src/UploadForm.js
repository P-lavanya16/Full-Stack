import React, { useState } from 'react';
import './index.css';

export default function UploadForm({ onUploaded, apiBase }) {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) { setStatus('⚠️ Choose a file'); return; }
    if (file.size > 10 * 1024 * 1024) { setStatus('⚠️ File too large (max 10MB)'); return; }
    const ext = file.name.split('.').pop().toLowerCase();
    if (ext !== 'pdf') { setStatus('⚠️ Only PDF allowed'); return; }

    setStatus('Uploading...');
    const fd = new FormData();
    fd.append('file', file);

    try {
      const res = await fetch(`${apiBase}/documents/upload`, { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) { setStatus(data.error || '❌ Upload failed'); return; }

      setStatus('✅ Uploaded successfully!');
      setFile(null);
      onUploaded && onUploaded();

      // Auto-clear the message after 3 seconds
      setTimeout(() => setStatus(''), 1000);
    } catch (e) {
      setStatus('❌ Upload error');
      setTimeout(() => setStatus(''), 1000);
    }
  };

  return (
    <div className="upload-container">
      <h3>Upload PDF</h3>
      <form onSubmit={handleSubmit}>
        <label className="upload-btn">
          ☁️ {file ? file.name : "Choose PDF"}
          <input type="file" accept="application/pdf" onChange={e => setFile(e.target.files[0])} />
        </label>
        <button type="submit" className="submit-btn">Upload</button>
      </form>
      {status && (
        <div className={`status-msg ${
          status.includes('❌') ? 'error' :
          status.includes('⚠️') ? 'warn' : 'success'
        }`}>
          {status}
        </div>
      )}
    </div>
  );
}
