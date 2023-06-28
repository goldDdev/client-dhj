import { Avatar, Box, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import logo from "@assets/png/logo-dhj.png";

const DownloadPage = () => {
  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Stack direction="row" alignItems="center" spacing={2}>
        <img src={logo} alt="not" sx={{ backgroundColor: "transparent" }} width={200} />

        <Stack direction="column" spacing={2}>
          <Box>
            <Typography variant="h6" align="center" gutterBottom>
              App DHJ
            </Typography>
          </Box>

          <Box>
            <Link
              to={"/"}
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
                textDecoration: "unset",
                fontWeight: 600,
                backgroundColor: "#a2c437",
                color: "white",
                width: "200px",
                borderRadius: "30px",
                padding: "8px",
              }}
            >
              <span></span>

              <span
                style={{ textAlign: "center", flexGrow: 1, fontSize: "16px" }}
              >
                Download
              </span>
            </Link>
            <p style={{textAlign: "center", fontSize: '12px'}}>Tersedia hanya untuk Android</p>
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
};

export default DownloadPage;
