import React, { useState } from "react";
import "../App.css";

const DocumentUpload = ({
  onUpload,
  onFileUpload,
  isLoading,
  documentStatus = {},
}) => {
  const [content, setContent] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [metadata, setMetadata] = useState({
    title: "",
    author: "",
    source: "",
    version: "1.0",
  });

  const [uploadType, setUploadType] = useState("text"); // 'text' or 'file'

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      // Auto-populate title from filename if not already set
      if (!metadata.title) {
        setMetadata({
          ...metadata,
          title: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
        });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (uploadType === "file") {
      if (!selectedFile || !metadata.title.trim()) {
        alert("Please select a file and provide a title");
        return;
      }
      await onFileUpload(selectedFile, metadata);
      // Reset form
      setSelectedFile(null);
      document.getElementById("fileInput").value = "";
    } else {
      if (!content.trim() || !metadata.title.trim()) {
        alert("Please provide both document content and title");
        return;
      }
      await onUpload(content, metadata);
      // Reset form
      setContent("");
    }

    setMetadata({
      title: "",
      author: "",
      source: "",
      version: "1.0",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "#6c757d";
      case "PROCESSING":
        return "#ffc107";
      case "INDEXED":
        return "#28a745";
      case "FAILED":
        return "#dc3545";
      default:
        return "#6c757d";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "PENDING":
        return "🕒";
      case "PROCESSING":
        return "⚙️";
      case "INDEXED":
        return "✅";
      case "FAILED":
        return "❌";
      default:
        return "❓";
    }
  };

  return (
    <div className="section">
      <h2 className="section-title">Document Upload</h2>

      {/* Document Status Display */}
      {Object.keys(documentStatus).length > 0 && (
        <div className="document-status-section">
          <h3>Document Processing Status</h3>
          {Object.entries(documentStatus).map(([docId, statusInfo]) => (
            <div
              key={docId}
              className="document-status-item"
              style={{
                borderLeft: `4px solid ${getStatusColor(statusInfo.status)}`,
              }}
            >
              <div className="status-header">
                <span className="status-icon">
                  {getStatusIcon(statusInfo.status)}
                </span>
                <span className="status-text">{statusInfo.status}</span>
                <span className="document-id">{docId}</span>
              </div>
              {statusInfo.details && (
                <div className="status-details">
                  <div>Step: {statusInfo.details.step || "N/A"}</div>
                  {statusInfo.details.chunk_count && (
                    <div>Chunks: {statusInfo.details.chunk_count}</div>
                  )}
                  {statusInfo.details.timestamp && (
                    <div>
                      Timestamp:{" "}
                      {new Date(statusInfo.details.timestamp).toLocaleString()}
                    </div>
                  )}
                  {statusInfo.details.error && (
                    <div className="error-details">
                      Error: {statusInfo.details.error}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="upload-form">
        {/* Upload Type Selection */}
        <div className="form-group">
          <label>Upload Type:</label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                value="text"
                checked={uploadType === "text"}
                onChange={(e) => setUploadType(e.target.value)}
                disabled={isLoading}
              />
              Text Content
            </label>
            <label>
              <input
                type="radio"
                value="file"
                checked={uploadType === "file"}
                onChange={(e) => setUploadType(e.target.value)}
                disabled={isLoading}
              />
              File Upload
            </label>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="title">Document Title:</label>
          <input
            type="text"
            id="title"
            value={metadata.title}
            onChange={(e) =>
              setMetadata({ ...metadata, title: e.target.value })
            }
            required
            disabled={isLoading}
            placeholder="Enter document title"
          />
        </div>

        <div className="form-group">
          <label htmlFor="author">Author:</label>
          <input
            type="text"
            id="author"
            value={metadata.author}
            onChange={(e) =>
              setMetadata({ ...metadata, author: e.target.value })
            }
            disabled={isLoading}
            placeholder="Optional"
          />
        </div>

        <div className="form-group">
          <label htmlFor="source">Source:</label>
          <input
            type="text"
            id="source"
            value={metadata.source}
            onChange={(e) =>
              setMetadata({ ...metadata, source: e.target.value })
            }
            disabled={isLoading}
            placeholder="Optional"
          />
        </div>

        {/* File Upload Section */}
        {uploadType === "file" && (
          <div className="form-group">
            <label htmlFor="fileInput">Select File:</label>
            <input
              type="file"
              id="fileInput"
              onChange={handleFileChange}
              disabled={isLoading}
              accept=".txt,.md,.pdf,.docx,.doc"
            />
            {selectedFile && (
              <div className="file-info">
                <p>Selected: {selectedFile.name}</p>
                <p>Size: {(selectedFile.size / 1024).toFixed(2)} KB</p>
                <p>Type: {selectedFile.type || "Unknown"}</p>
              </div>
            )}
            <div className="file-types-info">
              Supported formats: .txt, .md, .pdf, .docx, .doc
            </div>
          </div>
        )}

        {/* Text Content Section */}
        {uploadType === "text" && (
          <div className="form-group">
            <label htmlFor="content">Document Content:</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows="10"
              required
              disabled={isLoading}
              placeholder="Paste your document content here..."
            />
          </div>
        )}

        <button
          type="submit"
          disabled={
            isLoading ||
            (uploadType === "text" &&
              (!content.trim() || !metadata.title.trim())) ||
            (uploadType === "file" && (!selectedFile || !metadata.title.trim()))
          }
          className="submit-button"
        >
          {isLoading ? "Uploading..." : "Upload Document"}
        </button>
      </form>
    </div>
  );
};

export default DocumentUpload;
