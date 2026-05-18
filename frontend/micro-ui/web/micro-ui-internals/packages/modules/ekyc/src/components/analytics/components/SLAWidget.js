import React from "react";
import { useTranslation } from "react-i18next";

/**
 * Visual widget for SLA and processing performance tracking.
 */
const SLAWidget = ({ slaPercentage, avgTime, breachedCount }) => {
  const { t } = useTranslation();

  const getStatusColor = (pct) => {
    if (pct > 90) return "#10B981";
    if (pct > 75) return "#F59E0B";
    return "#EF4444";
  };

  return (
    <div className="sla-widget-card glass-card" style={{ padding: "28px" }}>
      <h3 style={{ fontSize: "18px", fontWeight: "800", color: "#111827", marginBottom: "28px", letterSpacing: "-0.025em" }}>{t("EKYC_SLA_PERFORMANCE")}</h3>
      
      <div style={{ display: "flex", alignItems: "center", gap: "24px", marginBottom: "24px" }}>
        <div style={{ position: "relative", width: "100px", height: "100px", display: "flex", alignItems: "center", justifyContent: "center" }}>
           <svg width="100" height="100" viewBox="0 0 100 100">
             <circle cx="50" cy="50" r="40" stroke="#F3F4F6" strokeWidth="8" fill="none" />
             <circle 
                cx="50" cy="50" r="40" 
                stroke={getStatusColor(slaPercentage)} 
                strokeWidth="8" 
                fill="none" 
                strokeDasharray={`${slaPercentage * 2.51} 251`}
                transform="rotate(-90 50 50)"
                strokeLinecap="round"
             />
             <text x="50" y="55" textAnchor="middle" fontSize="18" fontWeight="700" fill="#111827">{slaPercentage}%</text>
           </svg>
        </div>
        <div>
          <div style={{ fontSize: "14px", color: "#6B7280" }}>{t("EKYC_SLA_COMPLIANCE")}</div>
          <div style={{ fontSize: "20px", fontWeight: "700", color: "#111827" }}>{t("EKYC_OPTIMAL_PERFORMANCE")}</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", borderTop: "1px solid #F3F4F6", paddingTop: "20px" }}>
        <div>
          <div style={{ fontSize: "12px", color: "#6B7280", marginBottom: "4px" }}>{t("EKYC_AVG_LATENCY")}</div>
          <div style={{ fontSize: "18px", fontWeight: "700", color: "#111827" }}>{avgTime}h</div>
        </div>
        <div>
          <div style={{ fontSize: "12px", color: "#6B7280", marginBottom: "4px" }}>{t("EKYC_BREACH_COUNT")}</div>
          <div style={{ fontSize: "18px", fontWeight: "700", color: "#EF4444" }}>{breachedCount}</div>
        </div>
      </div>
    </div>
  );
};

export default SLAWidget;
