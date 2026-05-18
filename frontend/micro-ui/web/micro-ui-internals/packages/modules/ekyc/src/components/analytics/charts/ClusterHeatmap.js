import React from "react";
import { useTranslation } from "react-i18next";

/**
 * Custom SVG-based Heatmap component for Cluster Workload monitoring.
 */
const ClusterHeatmap = ({ data, title, onDrillDown }) => {
  const { t } = useTranslation();

  if (!data || data.length === 0) return null;

  const getIntensityColor = (score) => {
    if (score > 80) return "#EF4444"; // High - Red
    if (score > 50) return "#F59E0B"; // Medium - Amber
    return "#10B981"; // Low - Emerald
  };

  return (
    <div className="cluster-heatmap-container glass-card" style={{ padding: "28px" }}>
      {title && <h3 className="chart-title" style={{ marginBottom: "28px", fontSize: "18px", fontWeight: "800", color: "#111827", letterSpacing: "-0.025em" }}>{t(title)}</h3>}
      <div className="heatmap-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "20px" }}>
        {data.map((cluster) => (
          <div 
            key={cluster.clusterId} 
            className="heatmap-card glass-card" 
            onClick={() => onDrillDown?.(cluster)}
            style={{
              padding: "20px",
              background: "#FFFFFF",
              border: `1px solid ${getIntensityColor(cluster.intensityScore)}40`,
              cursor: "pointer",
              position: "relative",
              overflow: "hidden"
            }}
          >
            <div className="intensity-bar" style={{ 
              position: "absolute", 
              top: 0, 
              left: 0, 
              height: "4px", 
              width: "100%", 
              background: getIntensityColor(cluster.intensityScore) 
            }} />
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
              <span style={{ fontWeight: "600", fontSize: "14px", color: "#374151" }}>{cluster.clusterName}</span>
              <span style={{ 
                fontSize: "12px", 
                fontWeight: "700", 
                padding: "2px 8px", 
                borderRadius: "12px", 
                background: `${getIntensityColor(cluster.intensityScore)}20`, 
                color: getIntensityColor(cluster.intensityScore) 
              }}>
                {cluster.intensityScore}%
              </span>
            </div>

            <div className="cluster-stats" style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
                <span style={{ color: "#6B7280" }}>{t("EKYC_PENDING_WORKLOAD")}</span>
                <span style={{ fontWeight: "600", color: "#1F2937" }}>{cluster.pendingWorkload}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
                <span style={{ color: "#6B7280" }}>{t("EKYC_ACTIVE_AGENCIES")}</span>
                <span style={{ fontWeight: "600", color: "#1F2937" }}>{cluster.activeAgencies}</span>
              </div>
            </div>

            <div className="mini-spark" style={{ marginTop: "12px", display: "flex", gap: "2px", alignItems: "flex-end", height: "20px" }}>
              {cluster.wards.map((ward, idx) => (
                <div key={idx} style={{ 
                  flex: 1, 
                  height: `${Math.min(100, (ward.pendingCount / cluster.pendingWorkload) * 100)}%`, 
                  background: getIntensityColor(cluster.intensityScore),
                  opacity: 0.6,
                  borderRadius: "1px"
                }} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClusterHeatmap;
