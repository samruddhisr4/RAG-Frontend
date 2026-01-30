import React, { useState, useEffect } from "react";
import SystemStatus from "./components/SystemStatus";
import DocumentUpload from "./components/DocumentUpload";
import QueryBox from "./components/QueryBox";
import AnswerPanel from "./components/AnswerPanel";
import SourcesPanel from "./components/SourcesPanel";
import DebugPanel from "./components/DebugPanel";
import config from "./config";
import "./App.css";

function App() {
  const [systemHealth, setSystemHealth] = useState(null);
  const [isQueryLoading, setIsQueryLoading] = useState(false);
  const [isUploadLoading, setIsUploadLoading] = useState(false);
  const [queryResult, setQueryResult] = useState(null);
  const [documentStatus, setDocumentStatus] = useState({});

  // Fetch system health on component mount
  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const response = await fetch(`${config.API_BASE_URL}/health`);
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
          `${config.API_BASE_URL}/api/v1/documents/status`
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
    setIsQueryLoading(true);
    try {
      // Always use the LLM endpoint for generating answers
      const response = await fetch(`${config.API_BASE_URL}/api/v1/query-llm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, topK, userId: "technical-user" }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      
      const data = await response.json();
      setQueryResult(data);
    } catch (error) {
      console.error("Error querying LLM:", error);
      setQueryResult({
        error: error.message,
        answer: "Error occurred while processing query",
        sources: [],
        retrieval_gated: true,
        gating_reason: "LLM service unavailable"
      });
    } finally {
      setIsQueryLoading(false);
    }
  };

  const handleDocumentUpload = async (content, metadata) => {
    setIsUploadLoading(true);
    try {
      // Increase timeout to 300 seconds (5 minutes) for large content processing
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 300000); // 5 minutes

      const response = await fetch(`${config.API_BASE_URL}/api/v1/documents`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, metadata }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      alert(`Document uploaded successfully: ${data.message}`);

      const healthResponse = await fetch(`${config.API_BASE_URL}/health`);
      const healthData = await healthResponse.json();
      setSystemHealth(healthData);
    } catch (error) {
      if (error.name === 'AbortError') {
        console.error("Upload timed out:", error);
        alert("Upload timed out. Large documents may take several minutes to process.");
      } else {
        console.error("Error uploading document:", error);
        alert(`Error uploading document: ${error.message}`);
      }
    } finally {
      setIsUploadLoading(false);
    }
  };

  const handleFileUpload = async (file, metadata) => {
    setIsUploadLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", metadata.title);
      if (metadata.author) formData.append("author", metadata.author);
      if (metadata.source) formData.append("source", metadata.source);

      // Increase timeout to 300 seconds (5 minutes) for large file processing
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 300000); // 5 minutes

      const response = await fetch(`${config.API_BASE_URL}/api/v1/upload-file`, {
        method: "POST",
        body: formData,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

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

      const healthResponse = await fetch(`${config.API_BASE_URL}/health`);
      const healthData = await healthResponse.json();
      setSystemHealth(healthData);
    } catch (error) {
      if (error.name === 'AbortError') {
        console.error("Upload timed out:", error);
        alert("Upload timed out. Large files may take several minutes to process.");
      } else {
        console.error("Error uploading file:", error);
        alert(`Error uploading file: ${error.message}`);
      }
    } finally {
      setIsUploadLoading(false);
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
          isLoading={isUploadLoading}
          documentStatus={documentStatus}
        />

        <QueryBox onSubmit={handleQuerySubmit} isLoading={isQueryLoading} />

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