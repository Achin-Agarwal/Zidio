import { useTheme } from "@mui/material";
import {
  ChoroplethController,
  GeoFeature,
  ProjectionScale,
  ColorScale,
} from "chartjs-chart-geo";
import { Chart as ChartJS, Tooltip, Legend } from "chart.js";
import { Chart } from "react-chartjs-2";
import { geoFeatures } from "../data/mockGeoFeatures";
import { tokens } from "../theme";
import { mockGeographyData as data } from "../data/mockData";

// Register necessary components
ChartJS.register(
  ChoroplethController,
  GeoFeature,
  ProjectionScale,
  ColorScale,
  Tooltip,
  Legend
);

const GeographyChart = ({ isDashboard = false }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const features = geoFeatures.features;

  const chartData = {
    labels: features.map((f) => f.properties.name),
    datasets: [
      {
        label: "Geography Data",
        data: features.map((feature) => {
          const match = data.find((item) => item.id === feature.id);
          return {
            feature,
            value: match ? match.value : 0,
          };
        }),
        outline: features,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: !isDashboard,
        labels: {
          color: colors.grey[100],
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const val = context.raw.value;
            return `${context.label}: ${val.toLocaleString()}`;
          },
        },
      },
    },
    scales: {
      projection: {
        axis: "x", // required to avoid the `.axis` error
        projection: "equalEarth",
      },
      color: {
        axis: "x", // also required
        quantize: 5,
        interpolate: "YlGnBu",
        domain: [0, 1000000],
        legend: {
          position: "bottom-left",
        },
      },
    },
  };

  return <Chart type="choropleth" data={chartData} options={chartOptions} />;
};

export default GeographyChart;
