import React from "react";
import { useTranslation } from "react-i18next";

/**
 * Sticky global filter bar for dashboard parameters.
 */
const FilterBar = ({ filters, config, onFilterChange, onReset }) => {
  const { t } = useTranslation();

  return (
    <div className="dashboard-filter-bar glass-card" style={{ 
      position: "sticky", 
      top: "0", 
      zIndex: "100", 
      padding: "20px 28px", 
      display: "flex",
      alignItems: "center",
      gap: "24px",
      flexWrap: "wrap",
      borderRadius: "0 0 24px 24px",
      marginTop: "-1px"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", borderRight: "1px solid #E5E7EB", paddingRight: "16px" }}>
         <span style={{ fontSize: "14px", fontWeight: "700", color: "#374151" }}>{t("EKYC_GLOBAL_FILTERS")}</span>
      </div>

      <div style={{ display: "flex", gap: "12px", flex: 1, flexWrap: "wrap" }}>
        {config.map((filter) => (
          <div key={filter.id} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <label style={{ fontSize: "11px", fontWeight: "600", color: "#6B7280", textTransform: "uppercase" }}>{t(filter.label)}</label>
            <select 
              value={filters[filter.id] || filter.default}
              onChange={(e) => onFilterChange(filter.id, e.target.value)}
              style={{ 
                padding: "6px 12px", 
                borderRadius: "6px", 
                border: "1px solid #D1D5DB", 
                background: "#F9FAFB",
                fontSize: "13px",
                outline: "none",
                minWidth: "140px"
              }}
            >
              {filter.options.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: "12px" }}>
        <button 
          onClick={onReset}
          style={{ 
            padding: "8px 16px", 
            borderRadius: "8px", 
            background: "transparent", 
            color: "#6B7280", 
            border: "1px solid #D1D5DB", 
            cursor: "pointer", 
            fontSize: "14px", 
            fontWeight: "600" 
          }}
        >
          {t("EKYC_RESET")}
        </button>
      </div>
    </div>
  );
};

export default FilterBar;
