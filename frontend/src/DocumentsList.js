import React, { useState } from 'react';
import './index.css';

export default function DocumentsList({ docs, onDeleted, apiBase }) {
  const [msg, setMsg] = useState('');

  const handleDownload = (doc) => {
    const url = `${apiBase}/documents/${doc._id}/download`;
    const link = document.createElement('a');
    link.href = url;
    link.download = doc.originalName;
    link.click();
    setMsg(`✅ "${doc.originalName}" downloaded successfully!`);
    setTimeout(() => setMsg(''), 3000);
  };

  const handleDelete = async (doc) => {
    if (!window.confirm(`Delete "${doc.originalName}"?`)) return;
    try {
      const res = await fetch(`${apiBase}/documents/${doc._id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Delete failed');
        return;
      }
      setMsg(`❌ "${doc.originalName}" deleted successfully!`);
      onDeleted && onDeleted();
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      alert('Delete error');
    }
  };

  return (
    <div>
      <h3>Documents</h3>
      {msg && <div className="status-msg success">{msg}</div>}
      {docs.length === 0 ? (
        <div>No documents</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Filename</th>
              <th>Size (KB)</th>
              <th>Uploaded</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {docs.map((d) => (
              <tr key={d._id}>
                <td>{d.originalName}</td>
                <td>{Math.round((d.filesize || 0) / 1024)}</td>
                <td>{new Date(d.createdAt).toLocaleString()}</td>
                <td>
                  <button className="download-btn" onClick={() => handleDownload(d)}>
                    ⬇️ Download
                  </button>
                  <button className="delete-btn" onClick={() => handleDelete(d)}>
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
