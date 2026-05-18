import React from "react";
import { Fragment } from "react";

const SkeletonLoader = ({ type = "card", count = 1 }) => {
  const renderSkeleton = () => {
    switch (type) {
      case "card":
        return (
          <div className="skeleton-card" style={{ padding: "24px", background: "#F3F4F6", borderRadius: "12px", height: "140px", animation: "pulse 1.5s infinite" }}>
            <div style={{ height: "16px", width: "40%", background: "#E5E7EB", marginBottom: "16px", borderRadius: "4px" }} />
            <div style={{ height: "32px", width: "70%", background: "#E5E7EB", marginBottom: "12px", borderRadius: "4px" }} />
            <div style={{ height: "12px", width: "30%", background: "#E5E7EB", borderRadius: "4px" }} />
          </div>
        );
      case "chart":
        return (
          <div className="skeleton-chart" style={{ padding: "24px", background: "#F3F4F6", borderRadius: "12px", height: "300px", animation: "pulse 1.5s infinite" }}>
            <div style={{ height: "20px", width: "30%", background: "#E5E7EB", marginBottom: "24px", borderRadius: "4px" }} />
            <div style={{ height: "200px", width: "100%", background: "#E5E7EB", borderRadius: "8px" }} />
          </div>
        );
      case "table":
        return (
          <div className="skeleton-table" style={{ padding: "16px", background: "#F3F4F6", borderRadius: "12px", animation: "pulse 1.5s infinite" }}>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} style={{ height: "40px", width: "100%", background: "#E5E7EB", marginBottom: "8px", borderRadius: "4px" }} />
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <style>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
      <div style={{ display: "grid", gap: "16px", gridTemplateColumns: type === "card" ? "repeat(auto-fill, minmax(240px, 1fr))" : "1fr" }}>
        {Array(count).fill(0).map((_, i) => (
          <React.Fragment key={i}>{renderSkeleton()}</React.Fragment>
        ))}
      </div>
    </>
  );
};

export default SkeletonLoader;
