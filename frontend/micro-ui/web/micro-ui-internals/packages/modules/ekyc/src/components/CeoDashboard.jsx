import React, { useMemo, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import {
  FaChartLine,
  FaUsers,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaUserTie,
  FaMapMarkedAlt,
  FaSearch,
  FaArrowRight,
} from "react-icons/fa";
import { ekycMockData } from "./mockData";
import ExecutiveLineChart from "./analytics/charts/ExecutiveLineChart";
import ExecutiveBarChart from "./analytics/charts/ExecutiveBarChart";
import ExecutivePieChart from "./analytics/charts/ExecutivePieChart";

const CeoDashboard = () => {
  const history = useHistory();
  const location = useLocation();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const basePath = location.pathname.replace(/\/ceo-dashboard$/, "");
  const filters = ["All", "High Priority", "Stable", "Watchlist"];

  const vendors = useMemo(() => ekycMockData.vendors || [], []);
  const topKpis = useMemo(() => ekycMockData.topKpis || {}, []);
  const dailyTrend = useMemo(() => ekycMockData.dailyTrend || [], []);
  const selfVsAgency = useMemo(() => ekycMockData.selfVsAgency || [], []);
  const pendingVsCompleted = useMemo(() => ekycMockData.pendingVsCompleted || [], []);
  // const rejectionAnalysis = ekycMockData.rejectionAnalysis || [];

  const filteredVendors = useMemo(() => {
    return vendors
      .filter((vendor) => {
        if (statusFilter === "High Priority") return vendor.successRate < 70;
        if (statusFilter === "Watchlist") return vendor.pending > 35000;
        if (statusFilter === "Stable") return vendor.successRate >= 70;
        return true;
      })
      .filter((vendor) => {
        if (!query) return true;
        const keyword = query.toLowerCase();
        return (
          vendor.name.toLowerCase().includes(keyword) ||
          vendor.jurisdictions.some((zone) => zone.toLowerCase().includes(keyword)) ||
          vendor.zones.some((zone) => zone.location?.toLowerCase().includes(keyword))
        );
      });
  }, [vendors, query, statusFilter]);

  const zoneRows = useMemo(() => {
    return vendors
      .flatMap((vendor) => vendor.zones.map((zone) => ({ ...zone, agency: vendor.name })))
      .filter((row) => row.location)
      .sort((a, b) => (b.activeDemand || 0) - (a.activeDemand || 0));
  }, [vendors]);

  const alerts = [
    "North East District has 22% more pending accounts than last week",
    "Agency 2 has a 12% improvement opportunity in Self eKYC adoption",
    "Urgent: 18 supervisor escalations raised for NWS Bhera Enclave",
    "Risk alert: Rejection trends are rising in Outer North clusters",
  ];

  const routeToVendor = (vendorId) => {
    history.push(`${basePath}/vendors/${vendorId}`);
  };

  return (
    <div className="ekyc-dashboard-wrapper">
      <div className="dashboard-shell">
        <section className="kpi-grid">
          {[
            {
              title: "Total Water Connections",
              value: topKpis.totalWaterConnections,
              icon: <FaUsers />,
              variant: "primary",
            },
            {
              title: "Total eKYC Completed",
              value: topKpis.totalEkycCompleted,
              icon: <FaCheckCircle />,
              variant: "success",
            },
            {
              title: "Total Pending",
              value: topKpis.totalPending,
              icon: <FaClock />,
              variant: "warning",
            },
            {
              title: "Total Rejected",
              value: topKpis.totalRejected,
              icon: <FaExclamationTriangle />,
              variant: "danger",
            },
            {
              title: "Agency eKYC Completed",
              value: topKpis.agencyEkycCompleted,
              icon: <FaUserTie />,
              variant: "info",
            },
            {
              title: "Citizen Self eKYC Completed",
              value: topKpis.citizenSelfEkycCompleted,
              icon: <FaUsers />,
              variant: "secondary",
            },
            {
              title: "Today's eKYC",
              value: topKpis.todaysEkyc,
              icon: <FaChartLine />,
              variant: "muted",
            },
            {
              title: "Success Rate",
              value: `${topKpis.successRate}%`,
              icon: <FaCheckCircle />,
              variant: "success",
            },
            {
              title: "Rejection Percentage",
              value: `${topKpis.rejectionPercentage}%`,
              icon: <FaExclamationTriangle />,
              variant: "danger",
            },
          ].map((card) => (
            <article key={card.title} className={`kpi-card card-${card.variant}`}>
              <div className="kpi-icon">{card.icon}</div>
              <div>
                <p className="kpi-title">{card.title}</p>
                <h2>{card.value?.toLocaleString?.() ?? card.value}</h2>
              </div>
            </article>
          ))}
        </section>

        <section className="vendor-section">
          <div className="section-top">
            <div>
              <h2>Agency Performance Snapshot</h2>
              <p>Search, filter, and navigate into detailed analytics for every assigned vendor.</p>
            </div>
            <div className="vendor-filters">
              <div className="search-box">
                <FaSearch />
                <input type="text" placeholder="Search agency, jurisdiction, location" value={query} onChange={(e) => setQuery(e.target.value)} />
              </div>
              <div className="status-pill-group">
                {filters.map((status) => (
                  <button key={status} className={`status-pill ${statusFilter === status ? "active" : ""}`} onClick={() => setStatusFilter(status)}>
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="vendor-grid">
            {filteredVendors.map((vendor) => (
              <div key={vendor.id} className="vendor-card glass-card" onClick={() => routeToVendor(vendor.id)}>
                <div className="vendor-card-top">
                  <div>
                    <p className="vendor-chip">{vendor.name}</p>
                    <h3>{vendor.assignedConnections.toLocaleString()}</h3>
                    <p className="vendor-subtitle">Assigned connections across {vendor.jurisdictions.length} jurisdiction(s)</p>
                  </div>
                  <div className="vendor-progress-value">{vendor.progress}%</div>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${vendor.progress}%` }} />
                </div>
                <div className="vendor-stats-grid">
                  <div>
                    <strong>{vendor.completedEkyc.toLocaleString()}</strong>
                    <span>Agency eKYC</span>
                  </div>
                  <div>
                    <strong>{vendor.selfEkyc.toLocaleString()}</strong>
                    <span>Self eKYC</span>
                  </div>
                  <div>
                    <strong>{vendor.pending.toLocaleString()}</strong>
                    <span>Pending</span>
                  </div>
                  <div>
                    <strong>{vendor.rejected.toLocaleString()}</strong>
                    <span>Rejected</span>
                  </div>
                </div>
                <div className="vendor-card-footer">
                  <span>{vendor.activeSurveyors} Surveyors</span>
                  <span>{vendor.supervisors} Supervisors</span>
                  <span>{vendor.jurisdictions.join(", ")}</span>
                </div>
                <div className="vendor-card-action">
                  <span>Explore analytics</span>
                  <FaArrowRight />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="analytics-grid">
          <div className="analytics-panel glass-card">
            <div className="section-header">
              <h2>Daily eKYC Trend</h2>
              <span className="badge success">Live index</span>
            </div>
            <ExecutiveLineChart data={dailyTrend} dataKey="completed" name="Completed" />
          </div>

          <div className="analytics-panel glass-card">
            <div className="section-header">
              <h2>Self vs Agency eKYC</h2>
              <span className="badge info">Adoption</span>
            </div>
            <ExecutiveBarChart
              data={selfVsAgency}
              categories={[
                { key: "agency", name: "Agency" },
                { key: "citizen", name: "Citizen" },
              ]}
            />
          </div>

          <div className="analytics-panel glass-card">
            <div className="section-header">
              <h2>Pending vs Completed</h2>
              <span className="badge warning">Operational pulse</span>
            </div>
            <ExecutivePieChart data={pendingVsCompleted} dataKey="completed" labelKey="label" />
          </div>
        </section>

        <section className="zone-section">
          <div className="section-header">
            <div>
              <h2>
                <FaMapMarkedAlt /> Jurisdiction Performance
              </h2>
              <p>Top zones evaluated from the full agency dataset.</p>
            </div>
            <button className="secondary-button">Export Zone Data</button>
          </div>

          <div className="table-wrapper glass-card">
            <table>
              <thead>
                <tr>
                  <th>Agency</th>
                  <th>Location</th>
                  <th>District</th>
                  <th>Assigned</th>
                  <th>Agency eKYC</th>
                  <th>Pending</th>
                  <th>Progress</th>
                </tr>
              </thead>
              <tbody>
                {zoneRows.slice(0, 10).map((zone, index) => (
                  <tr key={`${zone.agency}-${zone.location}-${index}`}>
                    <td>{zone.agency}</td>
                    <td>{zone.location}</td>
                    <td>{zone.district || zone.cluster}</td>
                    <td>{zone.activeDemand?.toLocaleString() ?? "—"}</td>
                    <td>{zone.pppZones?.toLocaleString() ?? "—"}</td>
                    <td>{zone.inactiveDemand?.toLocaleString() ?? "—"}</td>
                    <td>
                      <span className="status-badge success">
                        {Math.min(100, Math.round(((zone.pppZones || 0) / Math.max(zone.activeDemand || 1, 1)) * 100))}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="bottom-grid">
          <div className="alerts-panel glass-card">
            <div className="section-header">
              <h2>
                <FaExclamationTriangle /> Critical Alerts
              </h2>
            </div>
            <div className="alerts-list">
              {alerts.map((alert) => (
                <div key={alert} className="alert-card">
                  <FaExclamationTriangle />
                  <p>{alert}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="efficiency-panel glass-card">
            <div className="section-header">
              <h2>
                <FaUserTie /> Workforce & Efficiency
              </h2>
            </div>
            <div className="efficiency-grid">
              <div className="efficiency-box">
                <h3>48</h3>
                <p>Supervisors Online</p>
              </div>
              <div className="efficiency-box">
                <h3>168</h3>
                <p>Surveyors Active</p>
              </div>
              <div className="efficiency-box">
                <h3>{topKpis.todayEkyc?.toLocaleString()}</h3>
                <p>eKYC Completed Today</p>
              </div>
              <div className="efficiency-box">
                <h3>{topKpis.successRate}%</h3>
                <p>Operational Efficiency</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default CeoDashboard;
