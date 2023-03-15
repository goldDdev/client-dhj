import {
  Box,
  Button,
  Divider,
  Drawer,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import { Breadcrumb, IconButton } from "@components/";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { People, ListAlt, Close } from "@mui/icons-material";

const path = (id) => [
  {
    label: "Overview",
    link: `/project/${id}/detail`,
    startIcon: <ListAlt />,
  },
  {
    label: "BOQ",
    link: `/project/${id}/boq`,
    startIcon: <ListAlt />,
  },
  {
    label: "Absen",
    link: `/project/${id}/absent`,
    startIcon: <ListAlt />,
  },
  {
    label: "Event",
    link: `/project/${id}/event`,
    startIcon: <ListAlt />,
  },
  {
    label: "Activity",
    link: `/project/${id}/activity`,
    startIcon: <ListAlt />,
  },
];

const ProjectTemplate = ({
  title,
  subtitle,
  breadcrumb,
  children,
  headRight,
  drawer,
}) => {
  document.title = title;
  const navigate = useNavigate();
  const { id } = useParams();
  const { pathname } = useLocation();

  return (
    <Stack direction="column">
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Box sx={{ diplay: "flex", flexDirection: "column" }}>
          <Typography component="h5" variant="h5">
            {title}
          </Typography>
          {!breadcrumb && (
            <Typography variant="subtitle1">{subtitle}</Typography>
          )}
          {breadcrumb && <Breadcrumb />}
        </Box>

        {headRight ? <Box {...headRight} /> : null}
      </Stack>

      <Stack
        direction="row"
        sx={{ mt: { xs: 2 } }}
        spacing={1}
        alignItems="center"
      >
        {path(id).map((v, i) => (
          <div key={"settings-" + i}>
            <Button
              variant={pathname === v.link ? "contained" : "text"}
              startIcon={v.startIcon}
              onClick={() => navigate(v.link)}
              disableElevation
              color="inherit"
            >
              {v.label}
            </Button>
          </div>
        ))}
      </Stack>

      <Box sx={{ mt: "24px" }}>{children}</Box>

      <Drawer
        open={drawer.open}
        anchor="right"
        ModalProps={{
          keepMounted: false,
        }}
        PaperProps={{ sx: { width: "30%" } }}
        {...drawer.drawerProps}
      >
        <Toolbar>
          <Typography flexGrow={1}>{drawer.title || ""}</Typography>
          <IconButton onClick={drawer.onClose}>
            <Close />
          </IconButton>
        </Toolbar>
        <Divider />
        {drawer.content || null}
      </Drawer>
    </Stack>
  );
};

export default ProjectTemplate;

ProjectTemplate.defaultProps = {
  title: "",
  subtitle: "",
  breadcrumb: false,
  drawer: {
    open: false,
  },
};
