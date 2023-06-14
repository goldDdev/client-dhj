import {
  Badge,
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
import { apiRoute } from "frhooks";
import React from "react";

const path = (id) => [
  {
    label: "Informasi Proyek",
    link: `/project/${id}/detail`,
    startIcon: <ListAlt />,
    badge: "",
  },
  {
    label: "Milestone",
    link: `/project/${id}/event`,
    startIcon: <ListAlt />,
    badge: "",
  },
  {
    label: "BOQ",
    link: `/project/${id}/boq`,
    startIcon: <ListAlt />,
    badge: "",
  },
  {
    label: "Progress (Plan vs Actual)",
    link: `/project/${id}/progres`,
    startIcon: <ListAlt />,
    badge: "",
  },
  {
    label: "Absen",
    link: `/project/${id}/absent`,
    startIcon: <ListAlt />,
    badge: "",
  },
  {
    label: "Lembur",
    link: `/project/${id}/overtime`,
    startIcon: <ListAlt />,
    badge: "overtime",
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
  const [badge, setBadge] = React.useState({ overtime: 0 });

  React.useEffect(() => {
    if (!id) return;

    (async () => {
      const data = await apiRoute().project("badge", { id }).get();
      setBadge(data);
    })();
  }, []);

  return (
    <Stack direction="column">
      <Stack
        direction={{
          xs: "column",
          sm: "column",
          md: "column",
          lg: "row",
          xl: "row",
        }}
        justifyContent="space-between"
        alignItems={{
          xs: "flex-start",
          sm: "flex-start",
          md: "flex-start",
          lg: "center",
          xl: "center",
        }}
      >
        <Box sx={{ diplay: "flex", flexDirection: "column" }}>
          <Typography component="h5" variant="h5">
            {title}
          </Typography>
          {!breadcrumb && (
            <Typography variant="subtitle1">{subtitle}</Typography>
          )}
          {breadcrumb && <Breadcrumb />}
        </Box>

        {headRight ? (
          <Box mt={{ xs: 1, sm: 1, md: 1, lg: 0, xl: 0 }} {...headRight} />
        ) : null}
      </Stack>

      <Stack
        direction="row"
        sx={{ mt: { xs: 2 } }}
        spacing={1}
        alignItems="center"
        overflow={{
          xs: "scroll",
          sm: "scroll",
          md: "scroll",
          lg: "unset",
          xl: "unset",
        }}
      >
        {path(id).map((v, i) => (
          <div key={"settings-" + i} style={{ whiteSpace: "nowrap" }}>
            <Badge
              invisible={
                badge[v.badge] ? (badge[v.badge] > 0 ? false : true) : true
              }
              badgeContent={badge[v.badge]}
              color="error"
            >
              <Button
                variant={pathname === v.link ? "contained" : "text"}
                startIcon={v.startIcon}
                onClick={() => navigate(v.link)}
                disableElevation
                color="inherit"
              >
                {v.label}
              </Button>
            </Badge>
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
          <Typography whiteSpace="nowrap" flexGrow={1}>
            {drawer.title || ""}
          </Typography>
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
