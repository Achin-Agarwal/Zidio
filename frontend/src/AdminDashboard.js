import React, { useEffect, useState } from "react";
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

// Mock Data
const mockUsersData = [
  {
    user: { _id: "u1", name: "Alice", email: "alice@example.com" },
    records: [
      {
        _id: "f101",
        uploadedAt: new Date().toISOString(),
        data: [{ col1: "Value1", col2: "Value2" }],
      },
    ],
  },
  {
    user: { _id: "u2", name: "Bob", email: "bob@example.com" },
    records: [
      {
        _id: "f102",
        uploadedAt: new Date().toISOString(),
        data: [{ col1: "Data1", col2: "Data2" }],
      },
      {
        _id: "f103",
        uploadedAt: new Date().toISOString(),
        data: [{ col1: "Sample1", col2: "Sample2" }],
      },
    ],
  },
];

const AdminDashboard = () => {
  const [usersData, setUsersData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const fetchAuditData = async () => {
    setLoading(true);
    // Simulate API delay
    setTimeout(() => {
      setUsersData(mockUsersData);
      setLoading(false);
    }, 1000);
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

  const handleDeleteFile = (fileId) => {
    if (!window.confirm("Delete this file?")) return;
    setUsersData((prevData) =>
      prevData.map((userBlock) => ({
        ...userBlock,
        records: userBlock.records.filter((r) => r._id !== fileId),
      }))
    );
    setMsg("File deleted");
  };

  const handleDeleteUser = (userId) => {
    if (!window.confirm("Delete this user and all their files?")) return;
    setUsersData((prevData) => prevData.filter((u) => u.user._id !== userId));
    setMsg("User deleted");
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        🛠 Admin Dashboard (Frontend Only)
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