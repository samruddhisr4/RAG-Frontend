import React, { useState, useEffect } from "react";
import SystemStatus from "./components/SystemStatus";
import DocumentUpload from "./components/DocumentUpload";
import QueryBox from "./components/QueryBox";
import AnswerPanel from "./components/AnswerPanel";
import SourcesPanel from "./components/SourcesPanel";
import DebugPanel from "./components/DebugPanel";
import "./App.css";

function App() {
  const [systemHealth, setSystemHealth] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [queryResult, setQueryResult] = useState(null);
  const [documentStatus, setDocumentStatus] = useState({});

  // Fetch system health on component mount
  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const response = await fetch("http://localhost:3000/health");
        const data = await response.json();
        setSystemHealth(data);
      } catch (error) {
        console.error("Error fetching health:", error);
        setSystemHealth({
          status: "unhealthy",
          services: { api_gateway: "offline", retrieval_service: "offline" },
        });
      }
    };

    fetchHealth();
    const interval = setInterval(fetchHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  // Fetch document status updates
  useEffect(() => {
    const fetchDocumentStatus = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/v1/documents/status"
        );
        if (response.ok) {
          const data = await response.json();
          setDocumentStatus(data);
        }
      } catch (error) {
        console.error("Error fetching document status:", error);
      }
    };

    const interval = setInterval(fetchDocumentStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleQuerySubmit = async (query, topK) => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:3000/api/v1/query-llm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, topK, userId: "technical-user" }),
      });

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setQueryResult(data);
    } catch (error) {
      console.error("Error querying:", error);
      try {
        const response = await fetch("http://localhost:3000/api/v1/query", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query, topK, userId: "technical-user" }),
        });

        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setQueryResult(data);
      } catch (fallbackError) {
        console.error("Error with fallback query:", fallbackError);
        setQueryResult({
          error: error.message,
          results: [],
          generated_answer: "Error occurred while processing query",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDocumentUpload = async (content, metadata) => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:3000/api/v1/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, metadata }),
      });

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      alert(`Document uploaded successfully: ${data.message}`);

      const healthResponse = await fetch("http://localhost:3000/health");
      const healthData = await healthResponse.json();
      setSystemHealth(healthData);
    } catch (error) {
      console.error("Error uploading document:", error);
      alert(`Error uploading document: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (file, metadata) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", metadata.title);
      if (metadata.author) formData.append("author", metadata.author);
      if (metadata.source) formData.append("source", metadata.source);

      const response = await fetch("http://localhost:3000/api/v1/upload-file", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `HTTP error! status: ${response.status} - ${
            errorData.message || "Unknown error"
          }`
        );
      }

      const data = await response.json();
      alert(`File uploaded successfully: ${data.message}`);

      const healthResponse = await fetch("http://localhost:3000/health");
      const healthData = await healthResponse.json();
      setSystemHealth(healthData);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert(`Error uploading file: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>RAG System</h1>
      </header>

      <main className="app-main">
        <SystemStatus health={systemHealth} />

        <DocumentUpload
          onUpload={handleDocumentUpload}
          onFileUpload={handleFileUpload}
          isLoading={isLoading}
          documentStatus={documentStatus}
        />

        <QueryBox onSubmit={handleQuerySubmit} isLoading={isLoading} />

        {queryResult && (
          <div className="results-container">
            <AnswerPanel result={queryResult} />
            <SourcesPanel
              result={queryResult}
              queryMetadata={queryResult.query_analysis}
            />
            <DebugPanel result={queryResult} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
