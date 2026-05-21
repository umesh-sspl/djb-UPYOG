// import React from "react";
// import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";

// const ExecutiveLineChart = ({ data = [], dataKey = "completed", name = "Value" }) => {
//   return (
//     <div className="chart-card" style={{ minHeight: 320 }}>
//       <ResponsiveContainer width="100%" height={320}>
//         <LineChart data={data} margin={{ top: 12, right: 16, left: 0, bottom: 0 }}>
//           <CartesianGrid stroke="rgba(148, 163, 184, 0.12)" strokeDasharray="4 4" />
//           <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: "#cbd5e1" }} />
//           <YAxis axisLine={false} tickLine={false} tick={{ fill: "#cbd5e1" }} />
//           <Tooltip contentStyle={{ background: "#0f172a", border: "none", borderRadius: 14, color: "#f8fafc" }} itemStyle={{ color: "#f8fafc" }} />
//           <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ color: "#cbd5e1" }} />
//           <Line
//             type="monotone"
//             dataKey={dataKey}
//             name={name}
//             stroke="#38bdf8"
//             strokeWidth={3}
//             dot={{ r: 4 }}
//             activeDot={{ r: 6, strokeWidth: 2, fill: "#60a5fa" }}
//           />
//         </LineChart>
//       </ResponsiveContainer>
//     </div>
//   );
// };

// export default ExecutiveLineChart;

import React from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";

const ExecutiveLineChart = ({ data = [] }) => {
  const formattedData = data.map((item) => ({
    ...item,

    agencyKyc: item.completed || 0,

    selfKyc: Math.round((item.completed || 0) * 0.42),

    totalKyc: (item.completed || 0) + Math.round((item.completed || 0) * 0.42),
  }));

  return (
    <div className="chart-card executive-line-chart">
      <ResponsiveContainer width="100%" height={340}>
        <LineChart
          data={formattedData}
          margin={{
            top: 20,
            right: 12,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" vertical={false} />

          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            tick={{
              fill: "#64748b",
              fontSize: 12,
              fontWeight: 600,
            }}
          />

          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{
              fill: "#64748b",
              fontSize: 12,
            }}
          />

          <Tooltip
            cursor={{
              stroke: "#cbd5e1",
              strokeWidth: 1,
            }}
            contentStyle={{
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: 18,
              boxShadow: "0 10px 30px rgba(15,23,42,0.08)",
            }}
            labelStyle={{
              color: "#0f172a",
              fontWeight: 700,
              marginBottom: 10,
            }}
          />

          <Legend
            verticalAlign="top"
            align="right"
            iconType="circle"
            wrapperStyle={{
              paddingBottom: 18,
              color: "#475569",
              fontWeight: 600,
            }}
          />

          {/* TOTAL */}

          <Line
            type="monotone"
            dataKey="totalKyc"
            name="Total eKYC"
            stroke="#0f172a"
            strokeWidth={4}
            dot={false}
            activeDot={{
              r: 6,
            }}
          />

          {/* AGENCY */}

          <Line
            type="monotone"
            dataKey="agencyKyc"
            name="Agency eKYC"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={{
              r: 3,
            }}
            activeDot={{
              r: 6,
            }}
          />

          {/* SELF */}

          <Line
            type="monotone"
            dataKey="selfKyc"
            name="Self eKYC"
            stroke="#10b981"
            strokeWidth={3}
            dot={{
              r: 3,
            }}
            activeDot={{
              r: 6,
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExecutiveLineChart;
