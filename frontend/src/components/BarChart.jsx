import { useTheme } from "@mui/material";
import { Bar } from "react-chartjs-2";
import { tokens } from "../theme";
import { mockBarData as data } from "../data/mockData";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const BarChart = ({ isDashboard = false }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const labels = data.map((item) => item.country);
  const keys = ["hot dog", "burger", "sandwich", "kebab", "fries", "donut"];

  const chartData = {
    labels,
    datasets: keys.map((key, index) => ({
      label: key,
      data: data.map((item) => item[key] ?? 0), // fallback to 0
      backgroundColor: `hsl(${index * 60}, 70%, 50%)`,
    })),
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
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
          text: "Country",
          color: colors.grey[100],
        },
        ticks: {
          color: colors.grey[100],
        },
        grid: {
          display: false,
        },
      },
      y: {
        title: {
          display: !isDashboard,
          text: "Food",
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

  return <Bar data={chartData} options={options} />;
};

export default BarChart;
