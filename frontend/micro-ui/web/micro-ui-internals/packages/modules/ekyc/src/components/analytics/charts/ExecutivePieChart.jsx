import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const colors = ["#22c55e", "#38bdf8", "#f97316", "#facc15", "#f43f5e"];

const ExecutivePieChart = ({ data = [], dataKey = "value", labelKey = "label" }) => {
  return (
    <div className="chart-card" style={{ minHeight: 320 }}>
      <ResponsiveContainer width="100%" height={320}>
        <PieChart>
          <Pie data={data} dataKey={dataKey} nameKey={labelKey} cx="50%" cy="50%" outerRadius={110} innerRadius={60} paddingAngle={3} label={{ fill: "#f8fafc", fontSize: 12 }}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ background: "#0f172a", border: "none", borderRadius: 14, color: "#f8fafc" }} />
          <Legend verticalAlign="bottom" align="center" iconType="circle" wrapperStyle={{ color: "#cbd5e1", marginTop: 10 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExecutivePieChart;
