import React from "react";

const AnswerPanel = ({ result }) => {
  if (result.error) {
    return (
      <div className="section">
        <h2 className="section-title">Answer (Grounded)</h2>
        <div className="error-message">Error: {result.error}</div>
      </div>
    );
  }

  // Check if retrieval was gated due to quality issues
  const isGated = result.retrieval_gated || false;
  const gatingReason = result.gating_reason || "Unknown reason";

  // Check if there are results to generate an answer from
  const hasResults = result.results && result.results.length > 0;

  return (
    <div className="section">
      <h2 className="section-title">Answer (Grounded)</h2>

      {isGated ? (
        <div className="retrieval-gated">
          <div className="gated-warning">⚠️ Retrieval Quality Check Failed</div>
          <div className="gated-reason">{gatingReason}</div>
          <div className="gated-answer">{result.generated_answer}</div>
          <div className="answer-note gated-note">
            Answer withheld due to insufficient retrieval quality. This safety
            mechanism prevents hallucination from poor context.
          </div>
        </div>
      ) : !hasResults ? (
        <div className="no-context">Not enough context to answer safely</div>
      ) : (
        <>
          <div className="answer-grounded">{result.generated_answer}</div>
          <div className="answer-note">
            This answer is generated ONLY from retrieved document chunks
          </div>
          <div
            style={{
              fontSize: "12px",
              color: "#666",
              marginTop: "10px",
              fontStyle: "italic",
              textAlign: "center",
            }}
          >
            Generated from {result.retrieved_count || 0} retrieved document
            chunks
          </div>
        </>
      )}
    </div>
  );
};

export default AnswerPanel;
