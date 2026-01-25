import React, { useState } from "react";

const DebugPanel = ({ result }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (result.error) {
    return null; // Don't show debug panel if there's an error
  }

  const results = result.results || [];

  return (
    <div className="section">
      <h2 className="section-title">
        <button
          className="debug-toggle"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
        >
          {isOpen ? "Hide" : "Show"} Debug / Explainability
        </button>
      </h2>

      {isOpen && (
        <div className="debug-content">
          <h3>Raw Retrieved Chunks</h3>

          {results.length === 0 ? (
            <p>No chunks retrieved for this query.</p>
          ) : (
            results.map((item, index) => (
              <div key={index} className="raw-result">
                <strong>
                  Chunk {index + 1} (Score:{" "}
                  {item.score !== undefined ? item.score.toFixed(4) : "N/A"})
                </strong>
                <br />
                <strong>ID:</strong> {item.id || "N/A"}
                <br />
                <strong>Document:</strong>{" "}
                {item.metadata?.title ||
                  item.metadata?.source_file ||
                  "metadata unavailable"}
                <br />
                <strong>Content:</strong>{" "}
                {item.content || "Content unavailable"}
                <br />
              </div>
            ))
          )}

          <h3>Full Response Data</h3>
          <pre className="raw-result">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default DebugPanel;
