export const ekycMockData = {
  topKpis: {
    totalWaterConnections: 2990996,
    totalEkycCompleted: 2460810,
    totalPending: 530186,
    totalRejected: 224324,
    agencyEkycCompleted: 2352069,
    citizenSelfEkycCompleted: 638927,
    todaysEkyc: 54684,
    successRate: 82,
    rejectionPercentage: 7,
  },

  executiveMetrics: {
    totalSurveyors: 186,
    totalSupervisors: 56,
    activeJurisdictions: 27,
    todaysGrowth: 2.8,
    selfEkycAdoption: 38,
    avgApprovalTime: "2.3 Days",
    riskZones: 7,
    escalationsOpen: 18,
  },

  alerts: [
    {
      title: "North East District pending increased",
      priority: "high",
      change: "+22%",
      district: "North East District",
    },
    {
      title: "Agency 2 self eKYC adoption low",
      priority: "medium",
      change: "-12%",
      district: "West District",
    },
    {
      title: "Escalation raised in NWS Bhera Enclave",
      priority: "high",
      change: "+18",
      district: "Outer North",
    },
    {
      title: "Approval rate improved in East District",
      priority: "low",
      change: "+9%",
      district: "East District",
    },
  ],

  heatmapData: [
    {
      district: "Outer North",
      intensity: 82,
    },
    {
      district: "East District",
      intensity: 48,
    },
    {
      district: "South District",
      intensity: 67,
    },
    {
      district: "North East District",
      intensity: 74,
    },
  ],

  dailyTrend: [
    {
      label: "Mon",
      completed: 270689,
      pending: 491305,
      rejected: 145810,
    },
    {
      label: "Tue",
      completed: 442945,
      pending: 466563,
      rejected: 157026,
    },
    {
      label: "Wed",
      completed: 615202,
      pending: 441821,
      rejected: 168243,
    },
    {
      label: "Thu",
      completed: 812067,
      pending: 413545,
      rejected: 179459,
    },
    {
      label: "Fri",
      completed: 1033540,
      pending: 381733,
      rejected: 190675,
    },
    {
      label: "Sat",
      completed: 1279621,
      pending: 346388,
      rejected: 201891,
    },
    {
      label: "Sun",
      completed: 1574918,
      pending: 303973,
      rejected: 213107,
    },
  ],

  selfVsAgency: [
    {
      label: "Agency1",
      agency: 201457,
      citizen: 758414,
    },
    {
      label: "Agency 2",
      agency: 164302,
      citizen: 919322,
    },
    {
      label: "Agency 3",
      agency: 328451,
      citizen: 541772,
    },
  ],

  pendingVsCompleted: [
    {
      label: "Agency1",
      completed: 201457,
      pending: 201457,
    },
    {
      label: "Agency 2",
      completed: 164302,
      pending: 164302,
    },
    {
      label: "Agency 3",
      completed: 328451,
      pending: 77278,
    },
  ],

  rejectionAnalysis: [
    {
      label: "Agency1",
      rejected: 71990,
      success: 72,
    },
    {
      label: "Agency 2",
      rejected: 81271,
      success: 77,
    },
    {
      label: "Agency 3",
      rejected: 71063,
      success: 86,
    },
  ],

  vendors: [
    {
      id: 1,
      name: "Agency1",

      assignedConnections: 959871,

      completedEkyc: 201457,

      selfEkyc: 758414,

      pending: 201457,

      rejected: 71990,

      inactiveDemand: 1161328,

      successRate: 72,

      progress: 21,

      supervisors: 23,

      activeSurveyors: 64,

      jurisdictions: ["Outer North", "North West District", "Model Town AC 18", "Cluster 2", "North District"],

      dailyPerformance: [
        {
          day: "Mon",
          completed: 16116,
          pending: 196084,
          rejected: 53272,
        },
        {
          day: "Tue",
          completed: 26189,
          pending: 192727,
          rejected: 55072,
        },
        {
          day: "Wed",
          completed: 38276,
          pending: 188698,
          rejected: 57232,
        },
        {
          day: "Thu",
          completed: 52378,
          pending: 183997,
          rejected: 59751,
        },
        {
          day: "Fri",
          completed: 68495,
          pending: 178625,
          rejected: 62631,
        },
        {
          day: "Sat",
          completed: 84611,
          pending: 173253,
          rejected: 65510,
        },
        {
          day: "Sun",
          completed: 100728,
          pending: 167880,
          rejected: 68390,
        },
      ],

      zones: [
        {
          agency: "Agency1",
          district: "Outer North",
          cluster: "NWS Bhera Enclave",

          assignedConnections: 102669,

          location: "102669",

          zroOffice: "NWS Bhera Enclave",

          assemblyConstituency: "Part of Mundka AC 08",

          gpsLocation: null,

          distanceFromFarthestPoint: null,

          activeDemand: 202197,

          pppZones: 15800,

          inactiveDemand: 35265,

          districtwiseInactiveTotal: 237462,
        },

        {
          agency: "Agency1",
          district: "Outer North",

          cluster: "Narela",

          assignedConnections: 99528,

          location: "99528",

          zroOffice: "Narela",

          assemblyConstituency: "Narela AC 01",

          activeDemand: 99528,

          pppZones: 19465,

          inactiveDemand: 35265,
        },

        {
          agency: "Agency1",

          district: "North West District",

          cluster: "Rohini AC 13",

          assignedConnections: 71041,

          location: "71041",

          zroOffice: "Rohini",

          assemblyConstituency: "Rithala AC 06",

          activeDemand: 247949,

          pppZones: 28975,

          inactiveDemand: 49494,
        },

        {
          agency: "Agency1",

          district: "Mangol Puri AC 12",

          cluster: "Model Town AC 18",

          assignedConnections: 68957,

          location: "68957",

          zroOffice: "Central North District",

          assemblyConstituency: "Ashok Vihar",

          activeDemand: 231216,

          pppZones: 16627,

          inactiveDemand: 36915,
        },

        {
          agency: "Agency1",

          district: "Timarpur AC 03",

          cluster: "Cluster 2",

          assignedConnections: 34862,

          location: "34862",

          zroOffice: "Old Delhi District",

          assemblyConstituency: "Pratap Nagar",

          activeDemand: 99694,

          pppZones: 20011,

          inactiveDemand: 48011,
        },

        {
          agency: "Agency1",

          district: "Bali Maran AC 22",

          cluster: "North District",

          assignedConnections: 110507,

          location: "110507",

          zroOffice: "Burari",

          assemblyConstituency: "Burari AC 2",

          activeDemand: 178815,

          pppZones: 14700,

          inactiveDemand: 31772,
        },
      ],
    },

    {
      id: 2,

      name: "Agency 2",

      assignedConnections: 1083624,

      completedEkyc: 164302,

      selfEkyc: 919322,

      pending: 164302,

      rejected: 81271,

      inactiveDemand: 1247926,

      successRate: 77,

      progress: 15,

      supervisors: 14,

      activeSurveyors: 64,

      jurisdictions: ["West District", "Janak Puri", "South District"],

      dailyPerformance: [
        {
          day: "Mon",
          completed: 13144,
          pending: 159920,
          rejected: 60140,
        },
        {
          day: "Tue",
          completed: 21359,
          pending: 157182,
          rejected: 62172,
        },
        {
          day: "Wed",
          completed: 31217,
          pending: 153896,
          rejected: 64610,
        },
        {
          day: "Thu",
          completed: 42718,
          pending: 150062,
          rejected: 67454,
        },
        {
          day: "Fri",
          completed: 55862,
          pending: 145681,
          rejected: 70705,
        },
        {
          day: "Sat",
          completed: 69006,
          pending: 141299,
          rejected: 73956,
        },
        {
          day: "Sun",
          completed: 82151,
          pending: 136918,
          rejected: 77207,
        },
      ],

      zones: [
        {
          agency: "Agency 2",

          district: "West District",

          cluster: "Rajouri Garden AC 27",

          assignedConnections: 84506,

          location: "84506",

          zroOffice: "Rajouri Garden AC 27",

          assemblyConstituency: "Punjabi Bagh",

          activeDemand: 470766,

          pppZones: 13269,

          inactiveDemand: 64564,
        },

        {
          agency: "Agency 2",

          district: "West District",

          cluster: "Tilak Nagar AC 29",

          assignedConnections: 51428,

          location: "51428",

          zroOffice: "Tilak Nagar AC 29",

          assemblyConstituency: "Paschim Vihar",

          activeDemand: 470766,

          pppZones: 6298,

          inactiveDemand: 64564,
        },

        {
          agency: "Agency 2",

          district: "Part of Uttam Nagar & Vikas puri",

          cluster: "Janak Puri",

          assignedConnections: 163041,

          location: "163041",

          zroOffice: "Janakpuri",

          assemblyConstituency: "Janakpuri AC 30",

          activeDemand: 369772,

          pppZones: 25729,

          inactiveDemand: 60534,
        },

        {
          agency: "Agency 2",

          district: "South District",

          cluster: "South District",

          assignedConnections: 52803,

          location: "52803",

          zroOffice: "R K Puram",

          assemblyConstituency: "Malviya Nagar AC 43",

          activeDemand: 243086,

          pppZones: 9678,

          inactiveDemand: 39204,
        },

        {
          agency: "Agency 2",

          district: "South District",

          cluster: "Vasant Kunz",

          assignedConnections: 58997,

          location: "58997",

          zroOffice: "Vasant Kunj",

          assemblyConstituency: "Vasant Kunj",

          activeDemand: 243086,

          pppZones: 6691,

          inactiveDemand: 39204,
        },
      ],
    },

    {
      id: 3,

      name: "Agency 3",

      assignedConnections: 947501,

      completedEkyc: 328451,

      selfEkyc: 541772,

      pending: 77278,

      rejected: 71063,

      inactiveDemand: 1016841,

      successRate: 86,

      progress: 78,

      supervisors: 19,

      activeSurveyors: 58,

      jurisdictions: ["East District", "North East District", "South East District", "MNWS"],

      dailyPerformance: [
        {
          day: "Mon",
          completed: 44120,
          pending: 130002,
          rejected: 5711,
        },
        {
          day: "Tue",
          completed: 58221,
          pending: 121998,
          rejected: 7104,
        },
        {
          day: "Wed",
          completed: 70218,
          pending: 113201,
          rejected: 8842,
        },
        {
          day: "Thu",
          completed: 85124,
          pending: 104006,
          rejected: 9911,
        },
        {
          day: "Fri",
          completed: 102315,
          pending: 94441,
          rejected: 11214,
        },
        {
          day: "Sat",
          completed: 121009,
          pending: 85218,
          rejected: 12902,
        },
        {
          day: "Sun",
          completed: 142118,
          pending: 77278,
          rejected: 14101,
        },
      ],

      zones: [
        {
          agency: "Agency 3",

          district: "East District",

          cluster: "Mayur Vihar",

          assignedConnections: 72326,

          location: "72326",

          zroOffice: "Mayur Vihar",

          assemblyConstituency: "Trilokpuri AC 55",

          activeDemand: 328564,

          pppZones: 9691,

          inactiveDemand: 52477,
        },

        {
          agency: "Agency 3",

          district: "East District",

          cluster: "Yojna Vihar",

          assignedConnections: 40651,

          location: "40651",

          zroOffice: "Yojna Vihar",

          assemblyConstituency: "Vishwas Nagar AC 59",

          activeDemand: 328564,

          pppZones: 10097,

          inactiveDemand: 52477,
        },

        {
          agency: "Agency 3",

          district: "North East District",

          cluster: "GTB Enclave",

          assignedConnections: 80453,

          location: "80453",

          zroOffice: "GTB Enclave",

          assemblyConstituency: "Seemapuri AC 63",

          activeDemand: 323753,

          pppZones: 10671,

          inactiveDemand: 50575,
        },

        {
          agency: "Agency 3",

          district: "North East District",

          cluster: "Yamuna Vihar",

          assignedConnections: 90599,

          location: "90599",

          zroOffice: "Yamuna Vihar",

          assemblyConstituency: "Mustafabad AC 69",

          activeDemand: 323753,

          pppZones: 18185,

          inactiveDemand: 50575,
        },

        {
          agency: "Agency 3",

          district: "South East District",

          cluster: "Kalkaji AC 51",

          assignedConnections: 29188,

          location: "29188",

          zroOffice: "Kalkaji AC 51",

          assemblyConstituency: "Saket",

          activeDemand: 136102,

          pppZones: 3675,

          inactiveDemand: 23977,
        },

        {
          agency: "Agency 3",

          district: "South East District",

          cluster: "Okhla",

          assignedConnections: 18473,

          location: "18473",

          zroOffice: "Sarita Vihar/Okhla",

          assemblyConstituency: "Okhla AC 54",

          activeDemand: 136102,

          pppZones: 3703,

          inactiveDemand: 23977,
        },
      ],
    },
  ],
};
