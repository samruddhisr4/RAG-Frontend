import React from "react";

const SystemStatus = ({ health }) => {
  if (!health) {
    return (
      <div className="section">
        <h2 className="section-title">System Status</h2>
        <div className="status-card offline">
          <span>Loading system status...</span>
        </div>
      </div>
    );
  }

  const { services, system_stats } = health;

  return (
    <div className="section">
      <h2 className="section-title">System Status</h2>

      <div
        className={`status-card ${
          services?.api_gateway === "healthy" ? "healthy" : "unhealthy"
        }`}
      >
        <span>API Gateway: {services?.api_gateway || "unknown"}</span>
      </div>

      <div
        className={`status-card ${
          services?.retrieval_service === "healthy" ? "healthy" : "unhealthy"
        }`}
      >
        <span>
          Retrieval Service: {services?.retrieval_service || "unknown"}
        </span>
      </div>

      {/* Document-level statistics */}
      <div className="status-card healthy">
        <span>Indexed Documents: {system_stats?.indexed_documents || 0}</span>
      </div>

      {/* Chunk-level statistics */}
      {/* <div className="status-card healthy">
        <span>Indexed Chunks: {system_stats?.indexed_chunks || 0}</span>
      </div> */}

      {/* Vector-level statistics */}
      <div className="status-card healthy">
        <span>FAISS Vectors: {system_stats?.faiss_vectors || 0}</span>
      </div>

      <div className="status-card healthy">
        <span>Total Queries: {system_stats?.total_queries || 0}</span>
      </div>
    </div>
  );
};

export default SystemStatus;
