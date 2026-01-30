import React, { useState } from "react";

const DebugPanel = ({ result }) => {
  const [showRawData, setShowRawData] = useState(false);

  if (result.error) {
    return null;
  }

  // Extract debug information
  const hasResults = result.results && result.results.length > 0;
  const similarityScoreRange = result.similarity_score_range || "N/A";
  const responseTime = result.response_time_ms || "N/A";
  const retrievedCount = result.retrieved_count || 0;

  // Check if retrieval was gated
  const isGated = result.retrieval_gated || false;
  const gatingReason = result.gating_reason || "N/A";

  // Check if quality check failed
  const qualityCheckFailed =
    result.query_analysis?.quality_check_failed || false;
  const failureReason = result.query_analysis?.failure_reason || "N/A";

  return (
    <div className="debug-panel">
      <h2 className="section-title">Debug / Explainability</h2>

      <div className="debug-content">
        <h3>Pipeline Status</h3>
        <ul>
          <li>
            Query Analysis:{" "}
            {result.query_analysis ? "Completed" : "Not available"}
          </li>
          <li>Semantic Retrieval: {hasResults ? "Completed" : "Failed"}</li>
          <li>
            Retrieval Validation:{" "}
            {isGated
              ? "Failed (Gated)"
              : qualityCheckFailed
              ? "Failed (Quality Check)"
              : "Passed"}
          </li>
          <li>
            Answer Generation:{" "}
            {result.generated_answer ? "Completed" : "Skipped"}
          </li>
          <li>Source Citation: {result.sources ? "Completed" : "Skipped"}</li>
        </ul>

        <h3>Retrieval Quality</h3>
        <ul>
          <li>Retrieved Chunks: {retrievedCount}</li>
          <li>Similarity Score Range: {similarityScoreRange}</li>
          <li>Response Time: {responseTime}ms</li>
          <li>Deduplication Applied: Yes (Post-retrieval optimization)</li>
          <li>Document Grouping: Yes (Max 2 chunks per document)</li>
        </ul>

        {isGated && (
          <div className="gating-info">
            <h3>Retrieval Gating</h3>
            <p>
              <strong>Status:</strong> {isGated ? "Applied" : "Not applied"}
            </p>
            <p>
              <strong>Reason:</strong> {gatingReason}
            </p>
          </div>
        )}

        <div style={{ marginTop: "15px" }}>
          <button
            onClick={() => setShowRawData(!showRawData)}
            style={{
              padding: "8px 12px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            {showRawData ? "Hide" : "Show"} Raw Response Data
          </button>

          {showRawData && (
            <pre
              style={{
                marginTop: "10px",
                fontSize: "12px",
                maxHeight: "200px",
                overflow: "auto",
              }}
            >
              {JSON.stringify(result, null, 2)}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
};

export default DebugPanel;
