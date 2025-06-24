import React, { useState, useRef } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Button,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line, Pie } from "react-chartjs-2";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import WarningIcon from "@mui/icons-material/Warning";
import ImageIcon from "@mui/icons-material/Image";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import InsertChartIcon from '@mui/icons-material/InsertChart';
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend
);

const ChartViewer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data = [], columns = [] } = location.state || {};

  const [xKey, setXKey] = useState(columns[0] || "");
  const [yKeys, setYKeys] = useState(columns[1] ? [columns[1]] : []);
  const [chartType, setChartType] = useState("Bar");
  const chartRef = useRef(null);

  if (!data.length || !columns.length) {
    return (
      <Box p={4} sx={{ textAlign: "center" }}>
        <Typography color="error" variant="h6">
          No chart data found.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 3 }}
          onClick={() => navigate("/upload")}
        >
          Go Back to Upload
        </Button>
      </Box>
    );
  }

  const colors = [
    "#FF6384",
    "#36A2EB",
    "#FFCE56",
    "#4BC0C0",
    "#9966FF",
    "#FF9F40",
  ];

  const getChartData = () => {
    const xValues = data.map((item) => item[xKey]);

    if (chartType === "Pie") {
      const yKey = yKeys[0];
      if (!yKey) return { labels: [], datasets: [] };

      const yValues = data
        .map((item) => parseFloat(item[yKey]))
        .filter((v) => !isNaN(v));

      return {
        labels: xValues.slice(0, yValues.length),
        datasets: [
          {
            label: `${yKey} Distribution`,
            data: yValues,
            backgroundColor: colors.slice(0, yValues.length),
            borderColor: "#fff",
            borderWidth: 2,
          },
        ],
      };
    }

    if (chartType === "Scatter") {
      const yKey = yKeys[0];
      return {
        datasets: [
          {
            label: `${yKey} vs ${xKey}`,
            data: data.map((item) => ({
              x: parseFloat(item[xKey]),
              y: parseFloat(item[yKey]),
            })),
            backgroundColor: colors[1],
            pointRadius: 5,
            showLine: false,
          },
        ],
      };
    }

    return {
      labels: xValues,
      datasets: yKeys.map((yKey, i) => ({
        label: yKey,
        data: data.map((item) => parseFloat(item[yKey])),
        backgroundColor:
          chartType === "Area"
            ? `${colors[i % colors.length]}88`
            : colors[i % colors.length],
        borderColor: colors[i % colors.length],
        fill: chartType === "Area",
        tension: chartType === "Area" ? 0.4 : 0.3,
        borderWidth: 2,
        pointRadius: chartType === "Area" ? 0 : 3,
      })),
    };
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      tooltip: { enabled: true },
    },
  };

  const handleDownloadPNG = async () => {
    const chartCanvas = chartRef.current;
    if (!chartCanvas) return;
    const canvas = await html2canvas(chartCanvas);
    const link = document.createElement("a");
    link.download = `${chartType}_chart.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const handleDownloadPDF = async () => {
    const chartCanvas = chartRef.current;
    if (!chartCanvas) return;
    const canvas = await html2canvas(chartCanvas);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "PNG", 0, 10, pdfWidth, pdfHeight);
    pdf.save(`${chartType}_chart.pdf`);
  };

  const showSingleOnlyWarning =
    (chartType === "Pie" || chartType === "Scatter") && yKeys.length > 1;

  return (
    <Box
      sx={{
        display: "flex",
        height: "83vh",
        overflow: "hidden",
        bgcolor: "#eef1f6",
        pt: 5,
      }}
    >
      {/* Sidebar */}
      <Box
        sx={{
          width: 320,
          height: 516,
          backgroundColor: "#ffffff",
          p: 3,
          overflowY: "auto",
          borderRight: "1px solid #ccc",
          marginLeft: 2,
          marginTop: 2,
          borderRadius: 3,
          boxShadow: 3,
        }}
      >
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, pb:2 }} color="black">
          🎛 Controls
        </Typography>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel  shrink={true}
  sx={{
    color: "#000",
    border: "1px solid #90caf9",
    borderRadius: "8px",
    px: 1,
    py: 0.5,
    backgroundColor: "#e3f2fd",
    width: "fit-content",
    mb: 1,
  }}>
            X-Axis
          </InputLabel>
          <Select
  value={xKey}
  onChange={(e) => setXKey(e.target.value)}
  label="X-Axis"
  sx={{ color: "#000", backgroundColor: "#fff" }}
  MenuProps={{
    PaperProps: {
      sx: {
        backgroundColor: "#e3f2fd",
        color: "#000",
      },
    },
  }}
>

            {columns.map((col) => (
              <MenuItem key={col} value={col} sx={{ color: "#000" }}>
                {col}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

      <FormControl fullWidth sx={{ mb: 2 }}>
  <InputLabel
    shrink={true}
    sx={{
      color: "#000",
      border: "1px solid #90caf9",
      borderRadius: "8px",
      px: 1,
      py: 0.5,
      backgroundColor: "#e3f2fd",
      width: "fit-content",
      mb: 1,
    }}
  >
    Y-Axis (Multi Select)
  </InputLabel>
  <Select
    multiple
    value={yKeys}
    onChange={(e) => setYKeys(e.target.value)}
    renderValue={(selected) => selected.join(", ")}
    label="Y-Axis (Multi Select)"
    sx={{ color: "#000", backgroundColor: "#fff" }}
    MenuProps={{
      PaperProps: {
        sx: {
          backgroundColor: "#e3f2fd",
          color: "#000",
        },
      },
    }}
  >
    {columns.map((col) => (
      <MenuItem key={col} value={col} sx={{ color: "#000" }}>
        {col}
      </MenuItem>
    ))}
  </Select>
</FormControl>


        <FormControl fullWidth sx={{ mb: 2 }}>
  <InputLabel
    shrink={true}
    sx={{
      color: "#000",
      border: "1px solid #90caf9",
      borderRadius: "8px",
      px: 1,
      py: 0.5,
      backgroundColor: "#e3f2fd",
      width: "fit-content",
      mb: 1,
    }}
  >
    Chart Type
  </InputLabel>
  <Select
    value={chartType}
    onChange={(e) => setChartType(e.target.value)}
    label="Chart Type"
    sx={{ color: "#000", backgroundColor: "#fff" }}
    MenuProps={{
      PaperProps: {
        sx: {
          backgroundColor: "#e3f2fd",
          color: "#000",
        },
      },
    }}
  >
    <MenuItem value="Bar" sx={{ color: "#000" }}>
      Bar Chart
    </MenuItem>
    <MenuItem value="Column" sx={{ color: "#000" }}>
      Column Chart
    </MenuItem>
    <MenuItem value="Line" sx={{ color: "#000" }}>
      Line Chart
    </MenuItem>
    <MenuItem value="Area" sx={{ color: "#000" }}>
      Area Chart
    </MenuItem>
    <MenuItem value="Pie" sx={{ color: "#000" }}>
      Pie Chart
    </MenuItem>
    <MenuItem value="Scatter" sx={{ color: "#000" }}>
      Scatter Chart
    </MenuItem>
  </Select>
</FormControl>


        <Typography
          variant="subtitle1"
          gutterBottom
          color="blue"
          sx={{ mt: 3, display: "flex", alignItems: "center", gap: 1 }}
        >
          <ArrowCircleDownIcon />
          Download
        </Typography>

   

<Button
  fullWidth
  variant="outlined"
  onClick={handleDownloadPNG}
  sx={{
    mb: 1,
    border: "2px solid",
    borderColor: "primary.main",
    color: "primary.main",
    "&:hover": {
      backgroundColor: "primary.dark",
      color: "white",
      borderColor: "primary.dark",
    },
  }}
>
  <ImageIcon sx={{ mr: 1 }} />
  Download PNG
</Button>

<Button
  fullWidth
  variant="outlined"
  onClick={handleDownloadPDF}
  sx={{
    mb: 1,
    border: "2px solid",
    borderColor: "primary.main",
    color: "primary.main",
    "&:hover": {
      backgroundColor: "primary.dark",
      color: "white",
      borderColor: "primary.dark",
    },
  }}
>
  <PictureAsPdfIcon sx={{ mr: 1 }} />
  Download PDF
</Button>

      </Box>

      {/* Chart Area */}
      <Box sx={{ flex: 2, overflow: "auto", p: 2, pt: 0 }}>
        <Typography  variant="h3"
          gutterBottom
          color="red"
          sx={{ mt: 3, display: "flex", alignItems: "center", gap: 1 }} >
          <InsertChartIcon/>CHART VIEW
        </Typography>

        {showSingleOnlyWarning && (
          <Typography color="error" sx={{ mb: 2 }}>
            <WarningIcon /> {chartType} chart supports only one Y-axis. Showing
            only the first selected column.
          </Typography>
        )}

        <Box
          ref={chartRef}
          sx={{ p: 3, backgroundColor: "#fff", borderRadius: 3, boxShadow: 3 }}
        >
          {chartType === "Bar" && (
            <Bar
              data={getChartData()}
              options={{ ...options, indexAxis: "y" }}
            />
          )}
          {chartType === "Column" && (
            <Bar
              data={getChartData()}
              options={{ ...options, indexAxis: "x" }}
            />
          )}
          {chartType === "Line" && (
            <Line data={getChartData()} options={options} />
          )}
          {chartType === "Area" && (
            <Line data={getChartData()} options={options} />
          )}
          {chartType === "Pie" && (
            <Pie data={getChartData()} options={options} />
          )}
          {chartType === "Scatter" && (
            <Line
              data={getChartData()}
              options={{
                responsive: true,
                plugins: { legend: { position: "top" } },
                scales: {
                  x: {
                    type: "linear",
                    position: "bottom",
                    title: { display: true, text: xKey },
                  },
                  y: {
                    title: { display: true, text: yKeys[0] },
                  },
                },
                elements: {
                  line: { tension: 0, borderWidth: 1, fill: false },
                  point: { radius: 5 },
                },
              }}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ChartViewer;
