import React, { useState } from "react";
import "../App.css";

const SourcesPanel = ({ result, queryMetadata = null }) => {
  const [expandedItems, setExpandedItems] = useState({});

  if (result.error) {
    return null;
  }

  const results = result.results || result.sources || [];

  if (results.length === 0 && queryMetadata === null) {
    return (
      <div className="source-panel">
        <h2 className="section-title">Sources</h2>
        <p>No sources found for this query.</p>
      </div>
    );
  }

  const toggleExpand = (index) => {
    setExpandedItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div className="source-panel">
      <h2 className="section-title">Sources & Retrieved Context</h2>
      <div className="source-panel-info">
        <p>
          <strong>Retrieved {results.length} document chunks</strong>
        </p>
        <p>
          These are the actual document pieces used to generate the answer
          above.
        </p>
      </div>

      {queryMetadata && (
        <div className="query-metadata">
          <h3>Query Analysis</h3>
          <div className="metadata-grid">
            <div className="metadata-item">
              <strong>Original Query:</strong> {queryMetadata.original || "N/A"}
            </div>
            <div className="metadata-item">
              <strong>Expanded Query:</strong> {queryMetadata.expanded || "N/A"}
            </div>
            <div className="metadata-item">
              <strong>Complexity:</strong>{" "}
              {typeof queryMetadata.complexity === "object"
                ? JSON.stringify(queryMetadata.complexity)
                : queryMetadata.complexity || "N/A"}
            </div>
            <div className="metadata-item">
              <strong>Expansions:</strong>{" "}
              {Array.isArray(queryMetadata.expansions)
                ? queryMetadata.expansions.join(", ") || "None"
                : typeof queryMetadata.expansions === "object"
                ? JSON.stringify(queryMetadata.expansions)
                : queryMetadata.expansions || "None"}
            </div>
          </div>
        </div>
      )}

      {results.map((item, index) => {
        const metadata = item.metadata || {};
        const isExpanded = expandedItems[index] || false;

        // Extract source information with explicit fallbacks for missing metadata
        const documentName =
          metadata.document_name ||
          metadata.source_file ||
          metadata.title ||
          item.source?.source_file ||
          "Document metadata unavailable (legacy ingestion)";
        const chunkId = metadata.chunk_id || item.id || `chunk-${index}`;
        const section = metadata.section || "general";
        const similarityScore =
          item.score !== undefined
            ? (item.score * 100).toFixed(2) + "%"
            : "Similarity score unavailable";

        return (
          <div key={index} className="source-item">
            <div
              className={`source-header ${isExpanded ? "expanded" : ""}`}
              onClick={() => toggleExpand(index)}
            >
              <div className="source-info">
                <div className="source-title">{documentName}</div>
                <div className="source-chunk-info">
                  {chunkId} • {section} • Score: {similarityScore}
                </div>
              </div>
              <div className="source-expand-indicator">
                {isExpanded ? "▼" : "▶"}
              </div>
            </div>

            {isExpanded && (
              <div className="source-details">
                <div className="source-details-grid">
                  <div className="detail-item">
                    <strong>Document:</strong> {documentName}
                  </div>
                  <div className="detail-item">
                    <strong>Chunk ID:</strong> {chunkId}
                  </div>
                  <div className="detail-item">
                    <strong>Section:</strong> {section}
                  </div>
                  <div className="detail-item">
                    <strong>Similarity Score:</strong> {similarityScore}
                  </div>
                </div>

                <div className="source-content-section">
                  <h4>Content:</h4>
                  <div className="source-content">
                    {item.content || "Content unavailable"}
                  </div>
                </div>

                {/* Source navigation removed to reduce UI clutter */}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default SourcesPanel;
