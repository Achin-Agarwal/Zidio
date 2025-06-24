import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Button,
  Input,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { useNavigate } from "react-router-dom";

const Upload = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [file, setFile] = useState(null);
  const [uploadMsg, setUploadMsg] = useState("");
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [backupHistory, setBackupHistory] = useState([]);
  const [showUndo, setShowUndo] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!token) return;
      try {
        const userId = JSON.parse(localStorage.getItem("id"));
        console.log(userId)
        const res = await axios.get(`http://localhost:5000/upload/myfiles/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Upload history fetched:", res.data);
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
    formData.append("excelsheet", file);

    try {
      setLoading(true);

      const res = await axios.post("http://localhost:5000/api/upload/excel", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      const { message, summary, data: parsedData, columns: parsedColumns } = res.data;
      setUploadMsg(message);
      setSummary(summary);

      navigate("/chart", { state: { data: parsedData, columns: parsedColumns } });

      const updated = await axios.get("http://localhost:5000/api/upload/history", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHistory(updated.data.uploads || []);
    } catch (error) {
      console.error("Upload failed:", error);
      setUploadMsg("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleHistoryClick = (entry) => {
    if (entry.rows && entry.summary?.columns) {
      navigate("/chart", { state: { data: entry.rows, columns: entry.summary.columns } });
    } else {
      alert("No data available for this file.");
    }
  };

  const handleClearHistory = async () => {
    if (!window.confirm("Are you sure you want to clear your upload history?")) return;

    try {
      setBackupHistory(history); 
      await axios.delete("http://localhost:5000/api/upload/history", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHistory([]);
      setShowUndo(true);
      setUploadMsg("Upload history cleared successfully. You can undo this.");
    } catch (error) {
      console.error("Failed to clear history:", error);
      setUploadMsg("Failed to clear history");
    }
  };

  const handleUndoClear = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/upload/restore", {
        uploads: backupHistory,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setHistory(res.data.uploads || backupHistory);
      setBackupHistory([]);
      setShowUndo(false);
      setUploadMsg("Upload history restored.");
    } catch (error) {
      console.error("Failed to restore history:", error);
      setUploadMsg("Failed to restore history");
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>📤 Upload Excel File</Typography>

      <Input
        type="file"
        inputProps={{ accept: ".xlsx,.xls" }}
        onChange={handleFileChange}
        sx={{ mb: 2 }}
      />

      <Button
        variant="contained"
        startIcon={<UploadFileIcon />}
        onClick={handleUpload}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : "Upload"}
      </Button>

      {uploadMsg && (
        <Box mt={2}>
          <Alert severity={uploadMsg.includes("fail") ? "error" : "success"}>
            {uploadMsg}
          </Alert>
        </Box>
      )}

      {showUndo && (
        <Box mt={2}>
          <Button variant="outlined" color="primary" onClick={handleUndoClear}>
            Undo Clear History
          </Button>
        </Box>
      )}

      {summary && (
        <Card sx={{ mt: 4, backgroundColor: "#f5f5f5" }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>📊 Upload Summary</Typography>
            <pre>{JSON.stringify(summary, null, 2)}</pre>
          </CardContent>
        </Card>
      )}

      {history.length > 0 && (
        <Box mt={6}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="h5" gutterBottom>🕓 Upload History</Typography>
            <Button variant="outlined" color="error" onClick={handleClearHistory}>
              Clear History
            </Button>
          </Box>

          <List>
            {history.map((entry, index) => (
              <React.Fragment key={entry._id || index}>
                <ListItem button onClick={() => handleHistoryClick(entry)}>
                  <ListItemText
                    primary={`📁 ${entry.fileName}`}
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="text.primary">
                          {new Date(entry.uploadedAt).toLocaleString()}
                        </Typography>
                        <pre style={{ whiteSpace: "pre-wrap" }}>
                          {JSON.stringify(entry.summary, null, 2)}
                        </pre>
                      </>
                    }
                  />
                </ListItem>
                <Divider component="li" />
              </React.Fragment>
            ))}
          </List>
        </Box>
      )}
    </Box>
  );
};

export default Upload;
