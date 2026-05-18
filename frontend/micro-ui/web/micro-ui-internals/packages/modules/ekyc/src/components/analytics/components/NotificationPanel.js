import React from "react";
import { useTranslation } from "react-i18next";

/**
 * Drawer-style notification panel for SLA alerts and escalations.
 */
const NotificationPanel = ({ notifications, isOpen, onClose }) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <>
      <div 
        onClick={onClose}
        style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.3)", zIndex: 999 }} 
      />
      <div className="notification-panel" style={{ 
        position: "fixed", 
        top: 0, 
        right: 0, 
        width: "350px", 
        height: "100%", 
        background: "#FFFFFF", 
        zIndex: 1000, 
        boxShadow: "-4px 0 15px rgba(0,0,0,0.1)",
        display: "flex",
        flexDirection: "column"
      }}>
        <div style={{ padding: "20px", borderBottom: "1px solid #F3F4F6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#111827" }}>{t("EKYC_ALERTS_CENTER")}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: "24px", cursor: "pointer", color: "#9CA3AF" }}>×</button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
          {notifications.length === 0 ? (
            <div style={{ textAlign: "center", color: "#9CA3AF", marginTop: "40px" }}>{t("EKYC_NO_NEW_ALERTS")}</div>
          ) : (
            notifications.map((alert, idx) => (
              <div key={idx} style={{ 
                padding: "16px", 
                borderRadius: "12px", 
                background: alert.priority === "HIGH" ? "#FEF2F2" : "#F9FAFB", 
                border: `1px solid ${alert.priority === "HIGH" ? "#FECACA" : "#E5E7EB"}`,
                marginBottom: "12px"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <span style={{ 
                    fontSize: "10px", 
                    fontWeight: "800", 
                    padding: "2px 6px", 
                    borderRadius: "4px", 
                    background: alert.priority === "HIGH" ? "#EF4444" : "#3B82F6",
                    color: "#FFFFFF"
                  }}>
                    {alert.priority}
                  </span>
                  <span style={{ fontSize: "11px", color: "#9CA3AF" }}>{alert.time}</span>
                </div>
                <h4 style={{ fontSize: "14px", fontWeight: "600", color: "#374151", marginBottom: "4px" }}>{t(alert.title)}</h4>
                <p style={{ fontSize: "13px", color: "#6B7280" }}>{t(alert.message)}</p>
              </div>
            ))
          )}
        </div>
        
        <div style={{ padding: "16px", borderTop: "1px solid #F3F4F6" }}>
           <button style={{ width: "100%", padding: "12px", borderRadius: "8px", background: "#F3F4F6", color: "#374151", border: "none", fontWeight: "600", cursor: "pointer" }}>
             {t("EKYC_MARK_ALL_READ")}
           </button>
        </div>
      </div>
    </>
  );
};

export default NotificationPanel;
