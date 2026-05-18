export const MockDashboardData = {
  getSummary: (role, filters) => {
    const isNorthCluster = filters?.clusterId === "CL-NORTH";
    const multiplier = isNorthCluster ? 0.6 : filters?.clusterId !== "ALL" ? 0.4 : 1.0;

    return {
      totalApplications: Math.round(15420 * multiplier),
      approvedApplications: Math.round(12100 * multiplier),
      pendingApplications: Math.round(2300 * multiplier),
      rejectedApplications: Math.round(1020 * multiplier),
      assignedTasks: Math.round(4850 * multiplier),
      completedTasks: Math.round(3900 * multiplier),
      pendingTasks: Math.round(750 * multiplier),
      escalatedCases: Math.round(200 * multiplier),
      totalAgencies: 12,
      totalClusters: 5,
      slaBreachedCases: Math.round(340 * multiplier),
      averageProcessingTime: 18.5,
      trends: {
        applicationGrowthPct: 8.5,
        processingEfficiencyPct: 92.4
      }
    };
  },

  getAgencies: (filters) => {
    const allAgencies = [
      { agencyId: "AG-ALPHA", agencyName: "Alpha Municipal Solutions", totalAssigned: 4200, completed: 3600, pending: 450, rejected: 150, slaPercentage: 94.5, avgResolutionTimeHours: 14.2, performancePercentage: 95 },
      { agencyId: "AG-BETA", agencyName: "Beta Verification Corp", totalAssigned: 3800, completed: 3100, pending: 500, rejected: 200, slaPercentage: 88.2, avgResolutionTimeHours: 19.5, performancePercentage: 89 },
      { agencyId: "AG-GAMMA", agencyName: "Gamma Field Ops", totalAssigned: 2900, completed: 2500, pending: 300, rejected: 100, slaPercentage: 96.1, avgResolutionTimeHours: 12.8, performancePercentage: 97 },
      { agencyId: "AG-DELTA", agencyName: "Delta Audit Systems", totalAssigned: 3100, completed: 2400, pending: 550, rejected: 150, slaPercentage: 85.4, avgResolutionTimeHours: 22.1, performancePercentage: 84 },
      { agencyId: "AG-EPSILON", agencyName: "Epsilon Smart Metering", totalAssigned: 1420, completed: 500, pending: 500, rejected: 420, slaPercentage: 72.0, avgResolutionTimeHours: 28.0, performancePercentage: 68 }
    ];

    if (filters?.agencyId && filters.agencyId !== "ALL") {
      return allAgencies.filter(a => a.agencyId === filters.agencyId);
    }
    return allAgencies;
  },

  getClusterHeatmap: () => {
    return [
      { clusterId: "CL-NORTH", clusterName: "North Central District", intensityScore: 88, activeAgencies: 4, pendingWorkload: 850, wards: [{ wardId: "WARD-1", wardName: "Model Town Ward", pendingCount: 320 }, { wardId: "WARD-2", wardName: "Civil Lines Ward", pendingCount: 530 }] },
      { clusterId: "CL-SOUTH", clusterName: "South Metro District", intensityScore: 65, activeAgencies: 3, pendingWorkload: 450, wards: [{ wardId: "WARD-3", wardName: "Hauz Khas Ward", pendingCount: 200 }, { wardId: "WARD-4", wardName: "Greater Kailash Ward", pendingCount: 250 }] },
      { clusterId: "CL-EAST", clusterName: "East Trans-Yamuna District", intensityScore: 94, activeAgencies: 3, pendingWorkload: 1200, wards: [{ wardId: "WARD-5", wardName: "Shahdara Ward", pendingCount: 700 }, { wardId: "WARD-6", wardName: "Preet Vihar Ward", pendingCount: 500 }] },
      { clusterId: "CL-WEST", clusterName: "West Industrial District", intensityScore: 42, activeAgencies: 2, pendingWorkload: 250, wards: [{ wardId: "WARD-7", wardName: "Rajouri Garden Ward", pendingCount: 150 }, { wardId: "WARD-8", wardName: "Punjabi Bagh Ward", pendingCount: 100 }] }
    ];
  },

  getWorkflowTracking: () => {
    return {
      stages: [
        { stageName: "Submitted", count: 420, avgDurationHours: 2.4 },
        { stageName: "Under Review", count: 850, avgDurationHours: 12.5 },
        { stageName: "CEO Approval", count: 110, avgDurationHours: 8.2 },
        { stageName: "Approved", count: 12100, avgDurationHours: 4.1 },
        { stageName: "Rejected", count: 1020, avgDurationHours: 6.5 }
      ],
      bottlenecks: [{ stage: "Under Review", averageDelayHours: 12.5, riskLevel: "MEDIUM" }],
      officerProductivity: [{ officerId: "EMP-003", officerName: "Amit Verma", role: "CEO", actionsProcessed: 110, avgTurnaroundHours: 8.2 }]
    };
  }
};
