import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import "./analytics/styles/Dashboard.css";


// Hooks
import useInboxRouting from "./analytics/hooks/useInboxRouting";

// Components
import DashboardLayout from "./analytics/components/DashboardLayout";
import FilterBar from "./analytics/components/FilterBar";
import SummaryCard from "./analytics/components/SummaryCard";
import TaskStatusChart from "./analytics/charts/TaskStatusChart";
import ClusterHeatmap from "./analytics/charts/ClusterHeatmap";
import AnalyticsTable from "./analytics/components/AnalyticsTable";
import SLAWidget from "./analytics/components/SLAWidget";
import WorkflowTimeline from "./analytics/components/WorkflowTimeline";
import NotificationPanel from "./analytics/components/NotificationPanel";
import SkeletonLoader from "./analytics/components/SkeletonLoader";
import ErrorBoundary from "./analytics/components/ErrorBoundary";
import EmptyState from "./analytics/components/EmptyState";

const CeoDashboard = () => {
  const { t } = useTranslation();
  const { routeToInbox } = useInboxRouting();

  // 1. Dashboard State
  const [activeRole, setActiveRole] = useState("CEO");
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [filters, setFilters] = useState({
    financialYear: "2025-26",
    clusterId: "ALL",
    agencyId: "ALL"
  });

  // 2. Fetch Config & Data
  const { config, tenantId } = Digit.Hooks.ekyc.useEkycDashboardConfigs(activeRole);
  const {
    summary: kpiData, agencies: agencyData, heatmap: clusterData, workflow: workflowData,
    isLoading, isError
  } = Digit.Hooks.ekyc.useEkycDashboardData(activeRole, filters);

  // 3. Handlers
  const handleFilterChange = (id, value) => {
    setFilters(prev => ({ ...prev, [id]: value }));
  };

  const handleReset = () => {
    setFilters({ financialYear: "2025-26", clusterId: "ALL", agencyId: "ALL" });
  };

  const handleKpiClick = (kpi) => {
    routeToInbox(kpi.targetRoute, { ...filters, status: kpi.status });
  };

  // Mock Notifications
  const notifications = [
    { title: "EKYC_SLA_BREACH_ALERT", message: "EKYC_ALERT_DESC_1", priority: "HIGH", time: "10m ago" },
    { title: "EKYC_SYSTEM_UPDATE", message: "EKYC_ALERT_DESC_3", priority: "NORMAL", time: "5h ago" }
  ];

  // 4. Render Logic
  if (isError) return <EmptyState message="EKYC_ERROR_FETCHING_DATA" />;

  return (
    <DashboardLayout
      header={config.title}
      activeRole={activeRole}
      onRoleChange={(role) => {
        setActiveRole(role);
        handleReset();
      }}
      onNotificationClick={() => setIsNotificationOpen(true)}
      filters={
        <FilterBar
          filters={filters}
          config={config.globalFilters}
          onFilterChange={handleFilterChange}
          onReset={handleReset}
        />
      }
    >
      <NotificationPanel
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        notifications={notifications}
      />

      {/* KPI Section */}
      <section style={{ marginBottom: "32px" }}>
        {isLoading ? (
          <SkeletonLoader type="card" count={4} />
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px" }}>
            {config?.widgets?.summary?.map((kpiKey, idx) => {
              const kpiMeta = config?.kpis?.[kpiKey];
              if (!kpiMeta) return null;

              const value = kpiData?.[kpiKey] || 0;
              return (
                <ErrorBoundary key={kpiKey}>
                  <div className="animate-fade-in" style={{ animationDelay: `${idx * 0.1}s` }}>
                    <SummaryCard
                      label={kpiMeta.label}
                      value={value}
                      color={kpiMeta.color}
                      icon={kpiMeta.icon}
                      trend={kpiData?.[`${kpiKey}Trend`]}
                      onClick={() => handleKpiClick(kpiMeta)}
                    />
                  </div>
                </ErrorBoundary>
              );
            })}
          </div>
        )}
      </section>

      {/* Main Analytics Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "24px" }}>



        {/* Workflow Distribution */}
        <div style={{ gridColumn: "span 12", background: "#FFF", padding: "24px", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          {isLoading ? (
            <SkeletonLoader type="chart" />
          ) : (
            <ErrorBoundary>
              <TaskStatusChart
                title="EKYC_APPLICATION_STATUS"
                data={workflowData?.stageBreakdown || []}
              />
            </ErrorBoundary>
          )}
        </div>

        {/* SLA & Timeline Bottlenecks */}
        <div style={{ gridColumn: "span 4" }}>
          {isLoading ? (
            <SkeletonLoader type="chart" />
          ) : (
            <ErrorBoundary>
              <SLAWidget
                slaPercentage={workflowData?.slaCompliance || 0}
                avgTime={workflowData?.avgProcessingTimeHours || 0}
                breachedCount={workflowData?.breachCount || 0}
              />
            </ErrorBoundary>
          )}
        </div>

        <div style={{ gridColumn: "span 8" }}>
          {isLoading ? (
            <SkeletonLoader type="chart" />
          ) : (
            <ErrorBoundary>
              <WorkflowTimeline stages={workflowData?.stageBreakdown || []} />
            </ErrorBoundary>
          )}
        </div>

        {/* Spatial Cluster Analysis */}
        <div style={{ gridColumn: "span 12", background: "#FFF", padding: "24px", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          {isLoading ? (
            <SkeletonLoader type="chart" />
          ) : (
            <ErrorBoundary>
              <ClusterHeatmap
                title="EKYC_CLUSTER_WORKLOAD_HEATMAP"
                data={clusterData || []}
                onDrillDown={(cluster) => handleFilterChange("clusterId", cluster.clusterId)}
              />
            </ErrorBoundary>
          )}
        </div>

        {/* Agency Performance Table */}
        <div style={{ gridColumn: "span 12" }}>
          {isLoading ? (
            <SkeletonLoader type="table" />
          ) : (
            <ErrorBoundary>
              <AnalyticsTable
                title="EKYC_AGENCY_PERFORMANCE_METRICS"
                filename="agency_performance_report.csv"
                data={agencyData || []}
                columns={[
                  { id: "agencyName", label: "EKYC_AGENCY_NAME" },
                  { id: "totalAssigned", label: "EKYC_TOTAL_ASSIGNED" },
                  { id: "totalCompleted", label: "EKYC_TOTAL_COMPLETED" },
                  { id: "pendingCount", label: "EKYC_PENDING" },
                  { id: "slaCompliance", label: "EKYC_SLA_COMPLIANCE", isPercentage: true }
                ]}
              />
            </ErrorBoundary>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
};

export default CeoDashboard;