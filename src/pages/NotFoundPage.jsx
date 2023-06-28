import { Avatar, Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import NotFound from "@assets/404.svg";

const NotFoundPage = () => {
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
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          p: 2,
        }}
      >
        <img
          src={NotFound}
          alt="not"
          sx={{ backgroundColor: "transparent", width: 260, height: 70, py: 5 }}
        />

        <Typography variant="subtitle1" gutterBottom>
          Oops! Page not Found
        </Typography>
        <Typography variant="subtitle2" gutterBottom>
          Maaf halaman yang anda cari tidak ada.
        </Typography>
        <Link
          to={"/"}
          style={{ textDecoration: "unset", fontWeight: 600 }}
        >
          Kembali ke Beranda
        </Link>
      </Box>
    </Box>
  );
};

export default NotFoundPage;
