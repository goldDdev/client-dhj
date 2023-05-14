import { Box, Button, Stack, Typography } from "@mui/material";
import { Breadcrumb } from "@components/";
import * as icon from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useLang } from "frhooks";

const path = (t) => {
  return [
    {
      label: t("employee"),
      link: "/settings/employee",
      startIcon: <icon.People />,
    },
    {
      label: t("user"),
      link: "/settings/user",
      startIcon: <icon.People />,
    },
    {
      label: t("boq"),
      link: "/settings/boq",
      startIcon: <icon.ListAlt />,
    },
    {
      label: t("general"),
      link: "/settings/general",
      startIcon: <icon.Settings />,
    },
  ];
};

const SettingTemplate = ({
  title,
  subtitle,
  breadcrumb,
  children,
  headRight,
}) => {
  document.title = title;
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

      {/* <Stack direction="row" sx={{ mt: { xs: 2 } }} spacing={1} alignItems="center">
        <Typography fontWeight={700}>{t("page")}:</Typography>
        {path(t).map((v, i) => (
          <div key={"settings-" + i}>
            <Button
              variant="outlined"
              startIcon={v.startIcon}
              onClick={() => navigate(v.link)}
            >
              {v.label}
            </Button>
          </div>
        ))}
      </Stack> */}

      <Box sx={{ mt: "24px" }}>{children}</Box>
    </Stack>
  );
};

export default SettingTemplate;

SettingTemplate.defaultProps = {
  title: "",
  subtitle: "",
  breadcrumb: false,
};
