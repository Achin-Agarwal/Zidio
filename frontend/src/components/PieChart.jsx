import { useTheme } from "@mui/material";
import { Pie } from "react-chartjs-2";
import { tokens } from "../theme";
import { mockPieData as data } from "../data/mockData";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

// Register required components
ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const chartData = {
    labels: data.map((d) => d.id),
    datasets: [
      {
        label: "Value",
        data: data.map((d) => d.value),
        backgroundColor: data.map((_, i) => `hsl(${i * 60}, 70%, 50%)`),
        borderColor: "#ffffff",
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
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
  };

  return <Pie data={chartData} options={options} />;
};

export default PieChart;
