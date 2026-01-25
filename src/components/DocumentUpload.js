import React, { useState } from 'react';

const DocumentUpload = ({ onUpload, isLoading }) => {
  const [documentTitle, setDocumentTitle] = useState('');
  const [documentContent, setDocumentContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!documentTitle.trim() || !documentContent.trim()) {
      alert('Please provide both title and content');
      return;
    }

    const metadata = {
      title: documentTitle,
      author: 'Technical User',
      category: 'internal_document',
      source_file: documentTitle,
      upload_date: new Date().toISOString(),
    };

    onUpload(documentContent, metadata);
    
    // Reset form
    setDocumentTitle('');
    setDocumentContent('');
  };

  return (
    <div className="section">
      <h2 className="section-title">Document Upload</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="docTitle">Document Title</label>
          <input
            type="text"
            id="docTitle"
            className="form-input"
            value={documentTitle}
            onChange={(e) => setDocumentTitle(e.target.value)}
            placeholder="Enter document title"
            disabled={isLoading}
          />
        </div>
        
        <div className="form-group">
          <label className="form-label" htmlFor="docContent">Document Content</label>
          <textarea
            id="docContent"
            className="form-textarea"
            value={documentContent}
            onChange={(e) => setDocumentContent(e.target.value)}
            placeholder="Paste document content here..."
            disabled={isLoading}
          />
        </div>
        
        <button 
          type="submit" 
          className="btn"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="loading">
              <span className="spinner"></span>
              Uploading...
            </span>
          ) : (
            'Upload Document'
          )}
        </button>
      </form>
    </div>
  );
};

export default DocumentUpload;