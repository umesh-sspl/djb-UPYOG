import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import ExportUtils from "../utils/exportUtils";

/**
 * Enterprise data grid for detailed analytics.
 */
const AnalyticsTable = ({ data, columns, title, filename }) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const sortedData = useMemo(() => {
    let items = [...(data || [])];
    
    // Filter
    if (searchTerm) {
      items = items.filter(item => 
        Object.values(item).some(val => 
          String(val).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Sort
    if (sortConfig.key) {
      items.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return items;
  }, [data, searchTerm, sortConfig]);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="analytics-table-card glass-card" style={{ padding: "0", overflow: "hidden" }}>
      <div className="table-header" style={{ padding: "28px", borderBottom: "1px solid rgba(229, 231, 235, 0.5)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
        <h3 style={{ fontSize: "18px", fontWeight: "800", color: "#111827", letterSpacing: "-0.025em" }}>{t(title)}</h3>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <input 
            type="text" 
            placeholder={t("EKYC_SEARCH_RECORDS")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid #D1D5DB", outline: "none", fontSize: "14px" }}
          />
          <button 
            onClick={() => ExportUtils.exportToCsv(sortedData, filename, columns)}
            style={{ padding: "10px 20px", borderRadius: "12px", background: "var(--primary-gradient)", color: "#FFF", border: "none", cursor: "pointer", fontWeight: "700", fontSize: "14px", boxShadow: "0 4px 6px rgba(99, 102, 241, 0.2)" }}
          >
            {t("EKYC_EXPORT_CSV")}
          </button>
        </div>
      </div>

      <div className="table-body" style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ background: "#F9FAFB" }}>
              {columns.map(col => (
                <th 
                  key={col.id} 
                  onClick={() => requestSort(col.id)}
                  style={{ padding: "16px 28px", fontSize: "11px", fontWeight: "700", color: "#6B7280", textTransform: "uppercase", cursor: "pointer", borderBottom: "1px solid rgba(229, 231, 235, 0.5)", letterSpacing: "0.05em" }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    {t(col.label)}
                    {sortConfig.key === col.id && (<span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData.map((row, idx) => (
              <tr key={idx} style={{ borderBottom: "1px solid #F3F4F6", transition: "background 0.2s" }} onMouseOver={(e) => e.currentTarget.style.background = "#F9FAFB"} onMouseOut={(e) => e.currentTarget.style.background = "transparent"}>
                {columns.map(col => (
                  <td key={col.id} style={{ padding: "16px 28px", fontSize: "14px", color: "#4B5563", fontWeight: col.id === "agencyName" ? "600" : "400" }}>
                    {col.isCurrency ? `₹${new Intl.NumberFormat('en-IN').format(row[col.id])}` : 
                     col.isPercentage ? `${row[col.id]}%` : 
                     row[col.id]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AnalyticsTable;
