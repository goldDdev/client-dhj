import { AppBar, BasicDropdown } from "@components/";
import NotificationsIcon from "@mui/icons-material/Notifications";
import {
  Avatar,
  Badge,
  Box,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import BarChartIcon from "@mui/icons-material/BarChart";
import { useSelector, apiRoute } from "frhooks";
import { useAlert } from "@contexts/AlertContext";
import { useNavigate } from "react-router-dom";

const Header = (props) => {
  const { user } = useSelector(["user"]);
  const alert = useAlert();
  const navigate = useNavigate();
  return (
    <AppBar position="fixed" open={props.open} elevation={0} color="inherit">
      <Toolbar
        sx={{
          pr: 24,
        }}
      >
        <IconButton
          edge="start"
          color="inherit"
          aria-label="open drawer"
          onClick={props.onToggleDrawer}
          sx={{
            marginRight: "36px",
            transform: "rotate(90deg)",
          }}
        >
          <BarChartIcon color="primary" />
        </IconButton>
        <Typography
          component="h1"
          variant="h6"
          color="inherit"
          noWrap
          sx={{ flexGrow: 1 }}
        ></Typography>

        <IconButton color="inherit" onClick={props.onToggleDrawer}>
          <Badge badgeContent={4} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>

        <Box sx={{ flexGrow: 0, ml: 2 }}>
          <BasicDropdown
            type="icon"
            label={<Avatar alt={user?.employee?.name || "A"} />}
            menu={[
              { text: `Hi, ${user?.employee?.name || ""}`, divider: true },
              { text: "Profil", divider: true },
              {
                text: "Keluar",
                onClick: () => {
                  alert.set({
                    open: true,
                    title: "Mohon Perhatian",
                    message: "Anda keluar dari applikasi ini, anda yakin?",
                    type: "warning",
                    loading: false,
                    close: {
                      text: "Keluar",
                    },
                    confirm: {
                      text: "Ya, Saya Mengerti",
                      onClick: async () => {
                        try {
                          alert.set({ loading: true });
                          await apiRoute().auth("logout").sendJson();
                          localStorage.removeItem("token");
                          navigate("/login");
                        } catch (err) {
                        } finally {
                          alert.reset();
                        }
                      },
                    },
                  });
                },
              },
            ]}
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
