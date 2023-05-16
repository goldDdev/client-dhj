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
    label: "Informasi Proyek",
    link: `/project/${id}/detail`,
    startIcon: <ListAlt />,
  },
  {
    label: "Milestone",
    link: `/project/${id}/event`,
    startIcon: <ListAlt />,
  },
  {
    label: "BOQ",
    link: `/project/${id}/boq`,
    startIcon: <ListAlt />,
  },
  {
    label: "Progress",
    link: `/project/${id}/progres`,
    startIcon: <ListAlt />,
  },
  {
    label: "Absen",
    link: `/project/${id}/absent`,
    startIcon: <ListAlt />,
  },
  {
    label: "Lembur",
    link: `/project/${id}/overtime`,
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

        {headRight ? <Box mt={{ xs: 1, sm: 1, md: 1, lg: 0, xl: 0 }}  {...headRight} /> : null}
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
            <Button
              fullWidth
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
        PaperProps={{ sx: {  width: "30%" } }}
        {...drawer.drawerProps}
      >
        <Toolbar>
          <Typography whiteSpace="nowrap" flexGrow={1}>{drawer.title || ""}</Typography>
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
