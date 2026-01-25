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

  // Check if there are results to generate an answer from
  const hasResults = result.results && result.results.length > 0;

  return (
    <div className="section">
      <h2 className="section-title">Answer (Grounded)</h2>

      {!hasResults ? (
        <div className="no-context">Not enough context to answer safely</div>
      ) : (
        <>
          <div className="answer-grounded">{result.generated_answer}</div>
          <div className="answer-note">
            This answer is generated ONLY from retrieved document chunks
          </div>
        </>
      )}
    </div>
  );
};

export default AnswerPanel;
