import React from "react";
import { useTranslation } from "react-i18next";

/**
 * Timeline component for workflow stage monitoring.
 */
const WorkflowTimeline = ({ stages }) => {
  const { t } = useTranslation();

  if (!stages || stages.length === 0) return null;

  return (
    <div className="workflow-timeline-card glass-card" style={{ padding: "28px" }}>
      <h3 style={{ fontSize: "18px", fontWeight: "800", color: "#111827", marginBottom: "28px", letterSpacing: "-0.025em" }}>{t("EKYC_WORKFLOW_BOTTLENECK_ANALYSIS")}</h3>
      
      <div className="timeline-container" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {stages.map((stage, idx) => (
          <div key={idx} style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ 
                width: "12px", 
                height: "12px", 
                borderRadius: "50%", 
                background: stage.avgDurationHours > 20 ? "#EF4444" : "#10B981",
                marginTop: "4px"
              }} />
              {idx !== stages.length - 1 && <div style={{ width: "2px", height: "40px", background: "#E5E7EB" }} />}
            </div>
            
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                <span style={{ fontSize: "14px", fontWeight: "600", color: "#374151" }}>{t(stage.stageName)}</span>
                <span style={{ fontSize: "12px", fontWeight: "700", color: stage.avgDurationHours > 20 ? "#EF4444" : "#10B981" }}>
                  {stage.avgDurationHours}h {t("EKYC_AVG")}
                </span>
              </div>
              <div style={{ width: "100%", height: "6px", background: "#F3F4F6", borderRadius: "3px", overflow: "hidden" }}>
                <div style={{ 
                  width: `${Math.min(100, (stage.count / 1000) * 100)}%`, 
                  height: "100%", 
                  background: stage.avgDurationHours > 20 ? "#EF444480" : "#10B98180" 
                }} />
              </div>
              <div style={{ fontSize: "12px", color: "#6B7280", marginTop: "4px" }}>
                {stage.count} {t("EKYC_APPLICATIONS_IN_STAGE")}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkflowTimeline;
