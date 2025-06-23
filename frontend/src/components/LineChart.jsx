import { useTheme } from "@mui/material";
import { Line } from "react-chartjs-2";
import { tokens } from "../theme";
import { mockLineData as data } from "../data/mockData";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Title
);

const LineChart = ({ isCustomLineColors = false, isDashboard = false }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  if (!data || data.length === 0 || !data[0].data) {
    return <div>No data available for Line Chart.</div>;
  }

  const labels = data[0].data.map((point) => point.x);

  const datasets = data.map((series, index) => ({
    label: series.id,
    data: series.data.map((point) => point.y),
    borderColor: isCustomLineColors
      ? series.color || `hsl(${index * 60}, 70%, 50%)`
      : `hsl(${index * 60}, 70%, 50%)`,
    backgroundColor: "transparent",
    tension: 0.4,
    pointBorderColor: colors.grey[100],
    pointBackgroundColor: colors.primary[500],
    pointBorderWidth: 2,
    pointRadius: 4,
    pointHoverRadius: 6,
  }));

  const chartData = {
    labels,
    datasets,
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Let the parent container control height
    layout: {
      padding: {
        bottom: 40, // Add padding to prevent label cut-off
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "bottom",
        labels: {
          color: colors.grey[100],
        },
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      x: {
        title: {
          display: !isDashboard,
          text: "Transportation",
          color: colors.grey[100],
        },
        ticks: {
          color: colors.grey[100],
          maxRotation: 45,  // Helps prevent overlapping
          minRotation: 30,
        },
        grid: {
          display: false,
        },
      },
      y: {
        title: {
          display: !isDashboard,
          text: "Count",
          color: colors.grey[100],
        },
        ticks: {
          color: colors.grey[100],
        },
        grid: {
          color: "#444",
        },
      },
    },
  };

  return (
    <div style={{ height: "350px", width: "100%" }}>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default LineChart;
