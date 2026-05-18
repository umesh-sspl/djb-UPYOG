import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const TaskStatusChart = ({ data, title }) => {
  const { t } = useTranslation();
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartRef.current && data) {
      if (chartInstance.current) chartInstance.current.destroy();
      const ctx = chartRef.current.getContext("2d");
      
      // Create vibrant gradients
      const gradientBlue = ctx.createLinearGradient(0, 0, 0, 400);
      gradientBlue.addColorStop(0, '#3B82F6');
      gradientBlue.addColorStop(1, '#2563EB');

      const gradientAmber = ctx.createLinearGradient(0, 0, 0, 400);
      gradientAmber.addColorStop(0, '#F59E0B');
      gradientAmber.addColorStop(1, '#D97706');

      const gradientIndigo = ctx.createLinearGradient(0, 0, 0, 400);
      gradientIndigo.addColorStop(0, '#6366F1');
      gradientIndigo.addColorStop(1, '#4F46E5');

      const gradientEmerald = ctx.createLinearGradient(0, 0, 0, 400);
      gradientEmerald.addColorStop(0, '#10B981');
      gradientEmerald.addColorStop(1, '#059669');

      const colors = [gradientBlue, gradientAmber, gradientIndigo, gradientEmerald, '#EC4899', '#EF4444'];

      const labels = data.map(item => t(item.stageName));
      const values = data.map(item => item.count);

      const ChartConstructor = Chart.Chart || Chart;
      chartInstance.current = new ChartConstructor(ctx, {
        type: "doughnut",
        data: {
          labels,
          datasets: [
            {
              data: values,
              backgroundColor: colors.slice(0, labels.length),
              borderWidth: 2,
              borderColor: "#ffffff",
              hoverOffset: 10
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '70%',
          plugins: {
            legend: {
              position: 'right',
              labels: {
                usePointStyle: true,
                padding: 15,
                font: { size: 12 }
              }
            },
            tooltip: {
              backgroundColor: '#1F2937',
              padding: 10,
              bodyFont: { size: 13 }
            }
          }
        }
      });
    }

    return () => {
      if (chartInstance.current) chartInstance.current.destroy();
    };
  }, [data, t]);

  return (
    <div className="task-status-chart-container glass-card" style={{ height: "320px", width: "100%", padding: "24px" }}>
      {title && <h3 className="chart-title" style={{ marginBottom: "24px", fontSize: "18px", fontWeight: "700", color: "#111827" }}>{t(title)}</h3>}
      <div style={{ height: "220px" }}>
        <canvas ref={chartRef} />
      </div>
    </div>
  );
};

export default TaskStatusChart;
