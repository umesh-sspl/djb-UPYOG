import React from "react";
import { FaUsers, FaUserTie, FaMapMarkedAlt, FaCheckCircle, FaClock, FaExclamationTriangle, FaChartLine } from "react-icons/fa";

const vendors = [
  {
    id: 1,
    name: "Vendor Alpha",
    progress: 78,
    supervisors: 12,
    surveyors: 148,
    completed: 154200,
    pending: 43200,
    rejected: 3200,
  },
  {
    id: 2,
    name: "Vendor Beta",
    progress: 64,
    supervisors: 10,
    surveyors: 122,
    completed: 121000,
    pending: 68500,
    rejected: 2800,
  },
  {
    id: 3,
    name: "Vendor Gamma",
    progress: 91,
    supervisors: 15,
    surveyors: 182,
    completed: 201500,
    pending: 19800,
    rejected: 1800,
  },
];

const zones = [
  {
    zone: "North Delhi",
    totalConnections: 220000,
    ekycDone: 172000,
    liveSurveyors: 58,
    todayCompleted: 2800,
  },
  {
    zone: "South Delhi",
    totalConnections: 198000,
    ekycDone: 154500,
    liveSurveyors: 42,
    todayCompleted: 2100,
  },
  {
    zone: "East Delhi",
    totalConnections: 175000,
    ekycDone: 132800,
    liveSurveyors: 37,
    todayCompleted: 1740,
  },
  {
    zone: "West Delhi",
    totalConnections: 212000,
    ekycDone: 188300,
    liveSurveyors: 48,
    todayCompleted: 2560,
  },
];

const alerts = [
  "15 Surveyors inactive for more than 2 hours",
  "Vendor Beta completion dropped by 12% this week",
  "North Delhi has highest pending backlog",
  "2,843 eKYC applications rejected today",
];

const CeoDashboard = () => {
  return (
    <div className="ekyc-dashboard-wrapper">
      <div className="ceo-dashboard">
        <main className="main-content">
          <div className="kpi-grid">
            <div className="kpi-card primary">
              <div className="icon-box">
                <FaUsers />
              </div>
              <div>
                <h3>7,85,000</h3>
                <p>Total Water Connections</p>
              </div>
            </div>

            <div className="kpi-card success">
              <div className="icon-box">
                <FaCheckCircle />
              </div>
              <div>
                <h3>6,47,300</h3>
                <p>eKYC Completed</p>
              </div>
            </div>

            <div className="kpi-card warning">
              <div className="icon-box">
                <FaClock />
              </div>
              <div>
                <h3>1,31,500</h3>
                <p>Pending eKYC</p>
              </div>
            </div>

            <div className="kpi-card danger">
              <div className="icon-box">
                <FaExclamationTriangle />
              </div>
              <div>
                <h3>7,200</h3>
                <p>Rejected Applications</p>
              </div>
            </div>
          </div>
          <section className="dashboard-section">
            <div className="section-header">
              <h2>
                <FaChartLine /> Vendor Performance Overview
              </h2>
              <button>View All</button>
            </div>

            <div className="vendor-grid">
              {vendors.map((vendor) => (
                <div className="vendor-card" key={vendor.id}>
                  <div className="vendor-top">
                    <div>
                      <h3>{vendor.name}</h3>
                      <p>Jurisdiction Assigned Vendor</p>
                    </div>

                    <span>{vendor.progress}%</span>
                  </div>

                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${vendor.progress}%` }}></div>
                  </div>

                  <div className="vendor-stats">
                    <div>
                      <h4>{vendor.supervisors}</h4>
                      <p>Supervisors</p>
                    </div>

                    <div>
                      <h4>{vendor.surveyors}</h4>
                      <p>Surveyors</p>
                    </div>

                    <div>
                      <h4>{vendor.completed}</h4>
                      <p>Completed</p>
                    </div>
                  </div>

                  <div className="vendor-footer">
                    <span>Pending: {vendor.pending}</span>
                    <span>Rejected: {vendor.rejected}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="dashboard-section">
            <div className="section-header">
              <h2>
                <FaMapMarkedAlt /> Jurisdiction Monitoring
              </h2>
              <button>Export Data</button>
            </div>

            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Zone</th>
                    <th>Total Connections</th>
                    <th>eKYC Done</th>
                    <th>Live Surveyors</th>
                    <th>Today's Completion</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {zones.map((item, index) => (
                    <tr key={index}>
                      <td>{item.zone}</td>
                      <td>{item.totalConnections}</td>
                      <td>{item.ekycDone}</td>
                      <td>{item.liveSurveyors}</td>
                      <td>{item.todayCompleted}</td>
                      <td>
                        <span className="status-badge success">Active</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <div className="bottom-grid">
            <section className="dashboard-section alerts-section">
              <div className="section-header">
                <h2>
                  <FaExclamationTriangle /> Critical Alerts
                </h2>
              </div>

              <div className="alerts-list">
                {alerts.map((alert, index) => (
                  <div className="alert-card" key={index}>
                    <FaExclamationTriangle />
                    <p>{alert}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="dashboard-section team-section">
              <div className="section-header">
                <h2>
                  <FaUserTie /> Workforce Monitoring
                </h2>
              </div>

              <div className="team-stats-grid">
                <div className="team-box">
                  <h3>37</h3>
                  <p>Total Supervisors Online</p>
                </div>

                <div className="team-box">
                  <h3>154</h3>
                  <p>Surveyors Active</p>
                </div>

                <div className="team-box">
                  <h3>12,430</h3>
                  <p>Today's eKYC Completed</p>
                </div>

                <div className="team-box">
                  <h3>92%</h3>
                  <p>Operational Efficiency</p>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CeoDashboard;
