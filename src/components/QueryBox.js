import React, { useState } from "react";

const QueryBox = ({ onSubmit, isLoading }) => {
  const [query, setQuery] = useState("");
  const [topK, setTopK] = useState(5);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!query.trim()) {
      alert("Please enter a query");
      return;
    }

    onSubmit(query, topK);

    // Don't reset the query to allow users to see what they asked
  };

  return (
    <div className="section">
      <h2 className="section-title">Query Documents</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="queryInput">
            Query
          </label>
          <textarea
            id="queryInput"
            className="form-textarea"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter your question..."
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="topK">
            Number of Results
          </label>
          <select
            id="topK"
            className="form-select"
            value={topK}
            onChange={(e) => setTopK(Number(e.target.value))}
            disabled={isLoading}
          >
            <option value={3}>3</option>
            <option value={5}>5</option>
            <option value={10}>10</option>
          </select>
        </div>

        <button type="submit" className="btn" disabled={isLoading}>
          {isLoading ? (
            <span className="loading">
              <span className="spinner"></span>
              Processing...
            </span>
          ) : (
            "Submit Query"
          )}
        </button>
      </form>
    </div>
  );
};

export default QueryBox;
