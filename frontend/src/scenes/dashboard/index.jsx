import { Box, Button, Typography, useTheme } from "@mui/material";

const Dashboard = () => {
  const theme = useTheme();

  return (
    <Box
      m="40px"
      p="40px"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      sx={{
        minHeight: "calc(100vh - 100px)",
      }}
    >
      {/* Title */}
      <Typography variant="h2" fontWeight="bold" gutterBottom>
        <img
          src="https://img.icons8.com/color/48/ms-excel.png"
          alt="Excel Icon"
          style={{ verticalAlign: "middle", marginRight: "10px" }}
        />
        Excel Analytics Platform
      </Typography>

      {/* Subtitle */}
      <Typography
        variant="h6"
        color="textSecondary"
        maxWidth="700px"
        mt={2}
      >
        Welcome! Upload your Excel files and get real-time insights with summaries and interactive visualizations.
      </Typography>

      {/* Features */}
      <Box mt={5} textAlign="left" maxWidth="500px">
        <Typography variant="h6" gutterBottom>
          🔍 Features:
        </Typography>
        <ul style={{ fontSize: "1.15rem", lineHeight: "2" }}>
          <li>Secure authentication</li>
          <li>Excel file uploads</li>
          <li>Smart summaries & visual charts</li>
        </ul>
      </Box>

      {/* Buttons */}
      <Box
        mt={6}
        display="flex"
        flexDirection={{ xs: "column", sm: "row" }}
        gap={3}
        justifyContent="center"
        alignItems="center"
      >
        <Button
          variant="contained"
          size="large"
          color="primary"
          sx={{ fontWeight: "bold", px: 4, py: 1.5 }}
          onClick={() => window.location.href = "/upload"}
        >
          GET STARTED
        </Button>

        <Button
          variant="outlined"
          size="large"
          sx={{
            fontWeight: "bold",
            px: 4,
            py: 1.5,
            color: theme.palette.mode === "dark" ? "#fff" : theme.palette.primary.main,
            borderColor: theme.palette.mode === "dark" ? "#fff" : theme.palette.primary.main,
            "&:hover": {
              backgroundColor: theme.palette.mode === "dark"
                ? "rgba(255,255,255,0.1)"
                : "rgba(0,0,0,0.04)",
              borderColor: theme.palette.mode === "dark"
                ? "#fff"
                : theme.palette.primary.dark,
            },
          }}
        >
          UPLOAD NOW
        </Button>
      </Box>
    </Box>
  );
};

export default Dashboard;
