import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Button,
  Input,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Grid,
  IconButton,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router-dom";

const Upload = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [file, setFile] = useState(null);
  const [uploadMsg, setUploadMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!token) return;
      try {
        const userId = JSON.parse(localStorage.getItem("id"));
        const res = await axios.get(
          `http://localhost:5000/upload/myfiles/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setHistory(res.data || []);
      } catch (error) {
        console.error("Failed to fetch upload history:", error);
      }
    };
    fetchHistory();
  }, [token]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return alert("Please choose a file");

    const formData = new FormData();
    formData.append("file", file);
    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:5000/upload/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { message, record } = res.data;
      setUploadMsg(message);
      const data = record.data || [];
      const columns = data.length > 0 ? Object.keys(data[0]) : [];
      navigate("/chart", { state: { data, columns } });
    } catch (error) {
      setUploadMsg("Upload failed");
      console.error("Upload failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFile = async (id) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;
    try {
      const res = await axios.post(`http://localhost:5000/upload/files/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUploadMsg(res.data.message);
      setHistory((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Failed to delete:", error);
      setUploadMsg("Failed to delete file");
    }
  };

  const handleDownloadFile = async (id, fileName = "export.xlsx") => {
    try {
      const res = await axios.get(
        `http://localhost:5000/upload/download/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        }
      );
      const blob = new Blob([res.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      link.click();
      link.remove();
    } catch (err) {
      alert("Failed to download");
    }
  };

  const handleViewChart = (entry) => {
    const data = entry.data || [];
    const columns = data.length > 0 ? Object.keys(data[0]) : [];
    if (!data.length || !columns.length) return alert("No data available.");
    navigate("/chart", { state: { data, columns } });
  };

  return (
    <Box
      sx={{
        p: 4,
        minHeight: "100vh",
        background: "linear-gradient(to right, #e3f2fd, #fff)",
      }}
    >
      {/* Upload Section */}
      <Box
        sx={{
          maxWidth: 600,
          mx: "auto",
          p: 3,
          mb: 5,
          background: "#ffffff",
          boxShadow: 4,
          borderRadius: 3,
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontWeight: 600, color: "#1976d2" }}
        >
          📤 Upload Excel File
        </Typography>

        <Input
          type="file"
          inputProps={{ accept: ".xlsx,.xls" }}
          onChange={handleFileChange}
          fullWidth
          sx={{
            mb: 2,
            mt: 1,
            color: "black",
            "::file-selector-button": {
              backgroundColor: "#1976d2",
              color: "white",
              border: "none",
              padding: "8px 12px",
              borderRadius: "4px",
              cursor: "pointer",
            },
          }}
        />

        <Button
          variant="contained"
          fullWidth
          startIcon={<UploadFileIcon />}
          onClick={handleUpload}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Upload"}
        </Button>

        {uploadMsg && (
          <Alert
            severity={
              uploadMsg.toLowerCase().includes("fail") ? "error" : "success"
            }
            sx={{ mt: 2 }}
          >
            {uploadMsg}
          </Alert>
        )}
      </Box>

      {/* History Section */}
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: "#333" }}>
        📚 Uploaded Files
      </Typography>

      {history.length === 0 ? (
        <Typography>No uploads yet.</Typography>
      ) : (
        <Grid container spacing={3}>
          {history.map((entry) => (
            <Grid item xs={12} sm={6} md={4} key={entry._id}>
              <Card
                sx={{
                  backgroundColor: "#f9f9f9",
                  borderRadius: 3,
                  boxShadow: 3,
                  transition: "transform 0.3s",
                  "&:hover": { transform: "scale(1.02)" },
                }}
              >
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 1, color: "#444" }}>
                    📁 {entry.fileName || "Unnamed File"}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1, color: "#666" }}>
                    🕒 {new Date(entry.uploadedAt).toLocaleString()}
                  </Typography>

                  <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <IconButton
                      onClick={() => handleViewChart(entry)}
                      sx={{ color: "#1976d2" }}
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton
                      onClick={() =>
                        handleDownloadFile(
                          entry._id,
                          entry.fileName || "export.xlsx"
                        )
                      }
                      sx={{ color: "green" }}
                    >
                      <DownloadIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteFile(entry._id)}
                      sx={{ color: "red" }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default Upload;
