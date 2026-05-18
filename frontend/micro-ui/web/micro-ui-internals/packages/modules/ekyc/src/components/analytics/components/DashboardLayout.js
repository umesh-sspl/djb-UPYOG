import React from "react";
import { useTranslation } from "react-i18next";

/**
 * Main structural shell for the Enterprise Dashboard.
 */
const DashboardLayout = ({ header, filters, children, onNotificationClick, activeRole, onRoleChange }) => {
  const { t } = useTranslation();

  const roles = ["CEO", "CLUSTER_MANAGER", "AGENCY_SUPERVISOR"];

  return (
    <div className="enterprise-dashboard-layout" style={{ background: "linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)", minHeight: "100vh" }}>
      {/* Top Navigation / Header */}
      <div className="glass-card" style={{ padding: "24px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", borderRadius: "0", borderTop: "none", borderLeft: "none", borderRight: "none" }}>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: "900", color: "#1E293B", letterSpacing: "-0.05em" }}>{t(header)}</h1>
          <p style={{ fontSize: "14px", color: "#64748B", marginTop: "4px", fontWeight: "500" }}>{t("EKYC_DASHBOARD_SUBTITLE_ALT") || "Operational analytics & performance monitoring."}</p>
        </div>
        
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          {/* Role Switcher for Simulation */}
          <div style={{ display: "flex", background: "#F3F4F6", padding: "4px", borderRadius: "8px", gap: "4px" }}>
            {roles.map(role => (
              <button 
                key={role}
                onClick={() => onRoleChange(role)}
                style={{ 
                  padding: "6px 12px", 
                  borderRadius: "6px", 
                  fontSize: "12px", 
                  fontWeight: "700",
                  border: "none",
                  cursor: "pointer",
                  background: activeRole === role ? "var(--primary-gradient)" : "transparent",
                  color: activeRole === role ? "#FFFFFF" : "#64748B",
                  boxShadow: activeRole === role ? "0 4px 12px rgba(99, 102, 241, 0.3)" : "none",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                }}
              >
                {t(role)}
              </button>
            ))}
          </div>

          <button 
            onClick={onNotificationClick}
            style={{ position: "relative", background: "#F3F4F6", border: "none", padding: "10px", borderRadius: "50%", cursor: "pointer" }}
          >
            <span style={{ fontSize: "20px" }}>🔔</span>
            <span style={{ position: "absolute", top: "0", right: "0", width: "10px", height: "10px", background: "#EF4444", borderRadius: "50%", border: "2px solid #FFF" }} />
          </button>
        </div>
      </div>

      {/* Filter Bar Position */}
      {filters}

      {/* Main Content Area */}
      <div style={{ padding: "24px", maxWidth: "1600px", margin: "0 auto" }}>
        {children}
      </div>

      {/* Footer Branding */}
      <div style={{ padding: "40px 24px", textAlign: "center", color: "#9CA3AF", fontSize: "12px" }}>
        {t("EKYC_POWERED_BY_UPYOG")} | {new Date().getFullYear()} © {t("EKYC_GOVT_DJB")}
      </div>
    </div>
  );
};

export default DashboardLayout;
