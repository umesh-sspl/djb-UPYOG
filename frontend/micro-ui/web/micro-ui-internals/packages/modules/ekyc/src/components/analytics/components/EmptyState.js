import React from "react";
import { useTranslation } from "react-i18next";

const EmptyState = ({ message = "EKYC_NO_DATA_FOUND" }) => {
  const { t } = useTranslation();
  
  return (
    <div className="empty-state-container" style={{ 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center", 
      justifyContent: "center", 
      padding: "60px 20px", 
      background: "#F9FAFB", 
      borderRadius: "12px",
      border: "1px dashed #D1D5DB"
    }}>
      <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔍</div>
      <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#374151", marginBottom: "8px" }}>{t("EKYC_EMPTY_STATE_TITLE") || "No Results Found"}</h3>
      <p style={{ color: "#6B7280", textAlign: "center", maxWidth: "300px" }}>
        {t(message) || "Try adjusting your filters or check back later for updated metrics."}
      </p>
    </div>
  );
};

export default EmptyState;
