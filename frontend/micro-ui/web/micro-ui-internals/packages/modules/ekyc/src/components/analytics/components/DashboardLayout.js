import React from "react";
import { useTranslation } from "react-i18next";

const DashboardLayout = ({ header, filters, children, onNotificationClick, activeRole, onRoleChange }) => {
  const { t } = useTranslation();

  const roles = ["CEO", "CLUSTER_MANAGER", "AGENCY_SUPERVISOR"];

  return (
    <div className="enterprise-dashboard-layout">
      <div className="dashboard-background-glow glow-1" />
      <div className="dashboard-background-glow glow-2" />

      {/* Top Navigation / Header */}
      <div className="glass-card dashboard-header">
        <div className="dashboard-header-left">
          <div className="dashboard-chip">LIVE ANALYTICS</div>

          <h1 className="dashboard-title gradient-text">{t(header)}</h1>

          <p className="dashboard-subtitle">{t("EKYC_DASHBOARD_SUBTITLE_ALT") || "Operational analytics & performance monitoring."}</p>
        </div>

        <div className="dashboard-header-actions">
          {/* Role Switcher */}
          <div className="role-switcher">
            {roles.map((role) => (
              <button key={role} onClick={() => onRoleChange(role)} className={`role-switcher-button ${activeRole === role ? "active" : "inactive"}`}>
                {t(role)}
              </button>
            ))}
          </div>

          {/* Notification */}
          <button onClick={onNotificationClick} className="notification-button">
            <span className="notification-icon">🔔</span>

            <span className="notification-badge" />
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="dashboard-filter-wrapper">{filters}</div>

      {/* Main Content */}
      <div className="dashboard-content animate-fade-in">{children}</div>
    </div>
  );
};

export default DashboardLayout;
