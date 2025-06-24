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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
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
    console.log("Deleting file with ID:", fileId);
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

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        🛠 Admin Dashboard (All User Uploads)
      </Typography>

      {msg && (
        <Alert severity={msg.includes("Failed") ? "error" : "success"} sx={{ mb: 2 }}>
          {msg}
        </Alert>
      )}

      {loading ? (
        <CircularProgress />
      ) : (
        usersData.map((userBlock) => (
          <Paper key={userBlock.user._id} sx={{ mb: 4, p: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">
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
                          <IconButton edge="end" onClick={() => handleViewFile(record)}>
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
                      primary={`File ID: ${record._id}`}
                      secondary={`Uploaded at: ${new Date(record.uploadedAt).toLocaleString()}`}
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
