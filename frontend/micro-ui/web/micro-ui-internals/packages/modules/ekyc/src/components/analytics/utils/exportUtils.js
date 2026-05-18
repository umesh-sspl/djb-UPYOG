/**
 * @file exportUtils.js
 * @description Provides utilities to export dashboard table analytics to CSV/Excel formats and invoke native printing layouts.
 */

export const ExportUtils = {
  /**
   * Generates and triggers download of a client-side CSV file from array records
   */
  exportToCsv: (data, filename = "dashboard_export.csv", columns = []) => {
    if (!data || !data.length) return;

    // Determine column keys if not provided explicitly
    const keys = columns.length ? columns.map(c => c.id) : Object.keys(data[0]);
    const headers = columns.length ? columns.map(c => c.label) : keys;

    const csvRows = [];
    // Header row
    csvRows.push(headers.map(h => `"${String(h).replace(/"/g, '""')}"`).join(","));

    // Data rows
    data.forEach(row => {
      const values = keys.map(k => {
        const val = row[k] !== undefined && row[k] !== null ? row[k] : "";
        return `"${String(val).replace(/"/g, '""')}"`;
      });
      csvRows.push(values.join(","));
    });

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    
    // Trigger download anchor
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  },

  /**
   * Triggers an Excel formatted download simulation
   */
  exportToExcel: (data, filename = "dashboard_report.xlsx", columns = []) => {
    // Uses standard CSV export format mapped to an excel extension compatible layer
    ExportUtils.exportToCsv(data, filename.replace(".xlsx", ".csv"), columns);
  },

  /**
   * Optimizes current interface display rules and opens native browser print dialogue
   */
  printDashboard: () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  }
};

export default ExportUtils;
