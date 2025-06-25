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
  Button,
  Grid,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PeopleIcon from "@mui/icons-material/People";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [usersData, setUsersData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const fetchAuditData = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/admin/audit", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsersData(res.data || []);
    } catch (error) {
      console.error("Failed to fetch audit data:", error);
      setMsg("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditData();
  }, []);

  const handleViewFile = (record) => {
    const data = record.data || [];
    const columns = data.length > 0 ? Object.keys(data[0]) : [];
    if (!data.length || !columns.length) return alert("No data available");
    navigate("/chart", { state: { data, columns } });
  };

  const handleDeleteFile = async (fileId) => {
    if (!window.confirm("Delete this file?")) return;
    try {
      await axios.post(`http://localhost:5000/upload/files/${fileId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMsg("File deleted");
      fetchAuditData();
    } catch (error) {
      console.error("Failed to delete file:", error);
      setMsg("Failed to delete file");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Delete this user and all their files?")) return;
    try {
      await axios.post(`http://localhost:5000/admin/delete/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMsg("User deleted");
      fetchAuditData();
    } catch (error) {
      console.error("Failed to delete user:", error);
      setMsg("Failed to delete user");
    }
  };

  const totalUsers = usersData.length;
  const totalFiles = usersData.reduce(
    (sum, userBlock) => sum + userBlock.records.length,
    0
  );

  return (
    <Box
      sx={{
        p: 4,
        backgroundColor: "#f0f2f5",
        minHeight: "100vh",
        color: "#000",
      }}
    >
      <Typography variant="h4" gutterBottom fontWeight={600}>
        🛠 Admin Dashboard
      </Typography>

      {msg && (
        <Alert
          severity={msg.includes("Failed") ? "error" : "success"}
          sx={{ mb: 2 }}
        >
          {msg}
        </Alert>
      )}

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
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
            <PeopleIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
            <Box>
              <Typography variant="subtitle1" color="black">
                Total Users
              </Typography>
              <Typography variant="h5" fontWeight={700} color="black">
                {totalUsers}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              display: "flex",
              alignItems: "center",
              backgroundColor: "#fff",
              borderLeft: "6px solid #388e3c",
            }}
          >
            <InsertDriveFileIcon
              sx={{ fontSize: 40, mr: 2, color: "#388e3c" }}
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
      </Grid>

      {loading ? (
        <CircularProgress />
      ) : (
        usersData.map((userBlock) => (
          <Paper
            key={userBlock.user._id}
            elevation={2}
            sx={{ mb: 4, p: 3, backgroundColor: "#ffffff", borderRadius: 3 }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Typography variant="h6" fontWeight={600} color="black">
                👤 {userBlock.user.name} ({userBlock.user.email})
              </Typography>
              <Button
                variant="outlined"
                color="error"
                onClick={() => handleDeleteUser(userBlock.user._id)}
              >
                Delete User
              </Button>
            </Box>

            <List>
              {userBlock.records.map((record) => (
                <React.Fragment key={record._id}>
                  <ListItem
                    secondaryAction={
                      <>
                        <Tooltip title="View File">
                          <IconButton
                            edge="end"
                            onClick={() => handleViewFile(record)}
                            sx={{ color: "#1976d2" }}
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete File">
                          <IconButton
                            edge="end"
                            color="error"
                            onClick={() => handleDeleteFile(record._id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </>
                    }
                  >
                    <ListItemText
                      primary={`📁 File ID: ${record._id}`}
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
        ))
      )}
    </Box>
  );
};

export default AdminDashboard;
