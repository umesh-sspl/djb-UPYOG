import React from "react";
import { useTranslation } from "react-i18next";

/**
 * Premium single-metric container for Top KPIs.
 */
const SummaryCard = ({ label, value, color, icon, trend, isCurrency, suffix = "", onClick }) => {
  const { t } = useTranslation();

  const formatValue = (val) => {
    if (isCurrency) {
      return `₹${new Intl.NumberFormat('en-IN').format(val)}`;
    }
    return new Intl.NumberFormat('en-IN').format(val);
  };

  return (
    <div 
      className="summary-card glass-card" 
      onClick={onClick}
      style={{
        padding: "28px 24px",
        cursor: onClick ? "pointer" : "default",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
        minHeight: "160px",
        position: "relative",
        overflow: "hidden"
      }}
      onMouseOver={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = "translateY(-8px) scale(1.02)";
        }
      }}
      onMouseOut={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = "translateY(0) scale(1)";
        }
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <span style={{ fontSize: "13px", fontWeight: "700", color: "#6B7280", letterSpacing: "0.05em", textTransform: "uppercase" }}>{t(label)}</span>
        <div style={{ 
          padding: "10px", 
          borderRadius: "12px", 
          background: `linear-gradient(135deg, ${color}20 0%, ${color}40 100%)`, 
          color: color,
          boxShadow: `0 4px 12px ${color}20`
        }}>
          <span style={{ fontSize: "20px" }}>{icon === "document" ? "📄" : icon === "check" ? "✅" : icon === "clock" ? "⏳" : icon === "rupee" ? "₹" : "📊"}</span>
        </div>
      </div>

      <div style={{ marginTop: "12px" }}>
        <div style={{ fontSize: "28px", fontWeight: "800", color: "#111827" }}>
          {formatValue(value)}{suffix}
        </div>
        
        {trend && (
          <div style={{ display: "flex", alignItems: "center", marginTop: "8px", fontSize: "12px", fontWeight: "600" }}>
            <span style={{ color: trend > 0 ? "#10B981" : "#EF4444" }}>
              {trend > 0 ? "↗" : "↘"} {Math.abs(trend)}%
            </span>
            <span style={{ color: "#9CA3AF", marginLeft: "4px" }}>{t("EKYC_FROM_PREV_MONTH")}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SummaryCard;
