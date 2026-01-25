import React from "react";

const SourcesPanel = ({ result }) => {
  if (result.error) {
    return null; // Don't show sources panel if there's an error
  }

  const results = result.results || [];

  if (results.length === 0) {
    return (
      <div className="section">
        <h2 className="section-title">Sources</h2>
        <p>No sources found for this query.</p>
      </div>
    );
  }

  return (
    <div className="section">
      <h2 className="section-title">Sources</h2>

      {results.map((item, index) => {
        // Extract source information from metadata or use defaults
        const sourceInfo = item.metadata || {};
        const documentName =
          sourceInfo.title || sourceInfo.source_file || "metadata unavailable";
        const chunkId = item.id || `chunk-${index}`;
        const similarityScore =
          item.score !== undefined ? item.score.toFixed(4) : "N/A";

        return (
          <div key={index} className="source-item">
            <div className="source-header">
              <div className="source-title">{documentName}</div>
              <div className="source-score">Score: {similarityScore}</div>
            </div>

            <div className="source-content">
              <strong>Section:</strong> {chunkId}
              <br />
              <strong>Content:</strong> {item.content || "Content unavailable"}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SourcesPanel;
