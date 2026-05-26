import React from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";

const ExecutiveBarChart = ({ data = [], categories = [], xKey = "label" }) => {
  return (
    <div className="chart-card" style={{ minHeight: 320 }}>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data} margin={{ top: 12, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="rgba(148, 163, 184, 0.12)" strokeDasharray="4 4" />
          <XAxis dataKey={xKey} axisLine={false} tickLine={false} tick={{ fill: "#cbd5e1" }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: "#cbd5e1" }} />
          <Tooltip contentStyle={{ background: "#0f172a", border: "none", borderRadius: 14 }} itemStyle={{ color: "#f8fafc" }} />
          <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ color: "#cbd5e1" }} />
          {categories.map((series, index) => (
            <Bar
              key={series.key}
              dataKey={series.key}
              name={series.name}
              fill={index === 0 ? "#34d399" : "#60a5fa"}
              radius={[12, 12, 0, 0]}
              barSize={24}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExecutiveBarChart;
