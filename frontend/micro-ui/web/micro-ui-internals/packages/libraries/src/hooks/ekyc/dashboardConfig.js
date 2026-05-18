export const DashboardConfig = {
  roles: {
    CEO: {
      title: "EKYC_CEO_DASHBOARD", 
      widgets: {
        summary: ["totalApplications", "approvedApplications", "pendingApplications", "slaBreachedCases"],
        analytics: ["workflowStatus", "clusterHeatmap", "agencyPerformance"]
      }
    },
    CLUSTER_MANAGER: {
      title: "EKYC_CLUSTER_MANAGER_DASHBOARD",
      widgets: {
        summary: ["totalApplications", "pendingCount", "assignedTasks", "slaBreachedCases"],
        analytics: ["clusterHeatmap", "taskMonitoring"]
      }
    },
    AGENCY_SUPERVISOR: {
      title: "EKYC_AGENCY_SUPERVISOR_DASHBOARD",
      widgets: {
        summary: ["assignedTasks", "completedTasks", "pendingTasks", "slaBreachedCases"],
        analytics: ["agencyPerformance", "taskMonitoring"]
      }
    }
  },
  globalFilters: [
    { id: "financialYear", label: "EKYC_FINANCIAL_YEAR", type: "dropdown", default: "2025-26", options: ["2025-26", "2024-25", "2023-24"] },
    { id: "clusterId", label: "EKYC_CLUSTER", type: "dropdown", default: "ALL", options: ["ALL", "CL-NORTH", "CL-SOUTH", "CL-EAST", "CL-WEST"] },
    { id: "agencyId", label: "EKYC_AGENCY", type: "dropdown", default: "ALL", options: ["ALL", "AG-ALPHA", "AG-BETA", "AG-GAMMA", "AG-DELTA"] }
  ],
  kpis: {
    totalApplications: { label: "EKYC_TOTAL_APPLICATIONS", color: "#3B82F6", icon: "document", targetRoute: "/digit-ui/employee/ekyc/inbox" },
    approvedApplications: { label: "EKYC_APPROVED_APPLICATIONS", color: "#10B981", icon: "check", targetRoute: "/digit-ui/employee/ekyc/inbox", status: "APPROVED" },
    pendingApplications: { label: "EKYC_PENDING_APPLICATIONS", color: "#F59E0B", icon: "clock", targetRoute: "/digit-ui/employee/ekyc/inbox", status: "PENDING" },
    rejectedApplications: { label: "EKYC_REJECTED_APPLICATIONS", color: "#EF4444", icon: "close", targetRoute: "/digit-ui/employee/ekyc/inbox", status: "REJECTED" },
    assignedTasks: { label: "EKYC_ASSIGNED_TASKS", color: "#6366F1", icon: "user", targetRoute: "/digit-ui/employee/ekyc/inbox" },
    completedTasks: { label: "EKYC_COMPLETED_TASKS", color: "#10B981", icon: "check", targetRoute: "/digit-ui/employee/ekyc/inbox" },
    pendingTasks: { label: "EKYC_PENDING_TASKS", color: "#F59E0B", icon: "clock", targetRoute: "/digit-ui/employee/ekyc/inbox" },
    escalatedCases: { label: "EKYC_ESCALATED_CASES", color: "#EC4899", icon: "alert", targetRoute: "/digit-ui/employee/ekyc/inbox" },
    totalAgencies: { label: "EKYC_TOTAL_AGENCIES", color: "#8B5CF6", icon: "briefcase", targetRoute: "/digit-ui/employee/ekyc/inbox" },
    totalClusters: { label: "EKYC_TOTAL_CLUSTERS", color: "#3B82F6", icon: "globe", targetRoute: "/digit-ui/employee/ekyc/inbox" },
    slaBreachedCases: { label: "EKYC_SLA_BREACHED", color: "#DC2626", icon: "warning", targetRoute: "/digit-ui/employee/ekyc/inbox" },
    averageProcessingTime: { label: "EKYC_AVG_PROCESSING_TIME", color: "#4B5563", icon: "timer", targetRoute: "/digit-ui/employee/ekyc/inbox", suffix: " hrs" },
    pendingCount: { label: "EKYC_PENDING_COUNT", color: "#F59E0B", icon: "clock", targetRoute: "/digit-ui/employee/ekyc/inbox" }
  }
};
