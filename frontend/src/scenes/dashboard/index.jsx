import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
  Paper,
  CircularProgress,
  Alert,
  Tooltip,
  Grid,
} from "@mui/material";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router-dom";
import { url } from "../../url";

const UserDashboard = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchUserFiles = async () => {
    try {
      setLoading(true);
      const userId = JSON.parse(localStorage.getItem("id"));
      const res = await axios.get(
        url+`upload/myfiles/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setHistory(res.data || []);
    } catch (error) {
      console.error("Failed to fetch files:", error);
      setMsg("Failed to fetch file history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserFiles();
  }, []);

  const handleViewFile = (record) => {
    const data = record.data || [];
    const columns = data.length > 0 ? Object.keys(data[0]) : [];
    if (!data.length || !columns.length) return alert("No data available");
    navigate("/chart", { state: { data, columns } });
  };

  const totalFiles = history.length;
  const totalRows = history.reduce(
    (sum, file) => sum + (file.data?.length || 0),
    0
  );
  const latestUpload = history
    .map((file) => new Date(file.uploadedAt))
    .sort((a, b) => b - a)[0];
  const latestUploadFormatted = latestUpload
    ? latestUpload.toLocaleString()
    : "N/A";

  return (
    <Box
      sx={{
        p: 4,
        backgroundColor: "#f5f7fa",
        minHeight: "100vh",
        color: "#000",
      }}
    >
      <Typography variant="h4" fontWeight={600} gutterBottom>
        📁 My Dashboard
      </Typography>

      {msg && (
        <Alert
          severity={msg.includes("Failed") ? "error" : "success"}
          sx={{ mb: 2 }}
        >
          {msg}
        </Alert>
      )}

      {/* Summary Card */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              display: "flex",
              alignItems: "center",
              backgroundColor: "#fff",
              borderLeft: "6px solid #1976d2",
            }}
          >
            <InsertDriveFileIcon
              sx={{ fontSize: 40, color: "#1976d2", mr: 2 }}
            />
            <Box>
              <Typography variant="subtitle1" color="black">
                Total Files
              </Typography>
              <Typography variant="h5" fontWeight={700} color="black">
                {totalFiles}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              display: "flex",
              alignItems: "center",
              backgroundColor: "#fff",
              borderLeft: "6px solid #2e7d32",
            }}
          >
            <InsertDriveFileIcon
              sx={{ fontSize: 40, color: "#2e7d32", mr: 2 }}
            />
            <Box>
              <Typography variant="subtitle1" color="black">
                Total Rows
              </Typography>
              <Typography variant="h5" fontWeight={700} color="black">
                {totalRows}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              display: "flex",
              alignItems: "center",
              backgroundColor: "#fff",
              borderLeft: "6px solid #ed6c02",
            }}
          >
            <InsertDriveFileIcon
              sx={{ fontSize: 40, color: "#ed6c02", mr: 2 }}
            />
            <Box>
              <Typography variant="subtitle1" color="black">
                Last Uploaded
              </Typography>
              <Typography variant="h6" fontWeight={700} color="black">
                {latestUploadFormatted}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Upload History */}
      <Typography variant="h6" fontWeight={600} gutterBottom>
        🕓 Upload History
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : history.length === 0 ? (
        <Typography>No upload history found.</Typography>
      ) : (
        <Paper
          sx={{ p: 2, backgroundColor: "#fff", borderRadius: 3, boxShadow: 2 }}
        >
          <List>
            {history.map((record) => (
              <React.Fragment key={record._id}>
                <ListItem
                  secondaryAction={
                    <Tooltip title="View File">
                      <IconButton
                        edge="end"
                        onClick={() => handleViewFile(record)}
                        sx={{ color: "#1976d2" }}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                  }
                >
                  <ListItemText
                    primary={
                      <span style={{ color: "#000", fontWeight: 600 }}>
                        📄 {record.fileName || "Unnamed File"}
                      </span>
                    }
                    secondary={`🕒 Uploaded at: ${new Date(
                      record.uploadedAt
                    ).toLocaleString()}`}
                    primaryTypographyProps={{
                      sx: { color: "#000", fontWeight: 500 },
                    }}
                    secondaryTypographyProps={{ sx: { color: "#000" } }}
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
};

export default UserDashboard;
