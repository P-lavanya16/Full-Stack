import React, { useEffect, useState } from 'react';
import UploadForm from './UploadForm';
import DocumentsList from './DocumentsList';
import './index.css';

const API = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

function App() {
  const [docs, setDocs] = useState([]);

  const fetchDocs = async () => {
    try {
      const res = await fetch(`${API}/documents`);
      const data = await res.json();
      setDocs(data);
    } catch (e) {
      console.error('Failed to fetch documents');
    }
  };

  useEffect(() => { fetchDocs(); }, []);

  return (
    <div className="container">
      <h1>Patient Documents Portal</h1>
      <UploadForm
        onUploaded={fetchDocs}  // fetch docs after upload
        apiBase={API}
      />
      <hr />
      <DocumentsList
        docs={docs}
        onDeleted={fetchDocs}  // fetch docs after delete
        apiBase={API}
      />
    </div>
  );
}

export default App;
