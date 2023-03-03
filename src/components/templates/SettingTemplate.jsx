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
      link: "/settings/employee",
      startIcon: <icon.People />,
    },
    {
      label: t("boc"),
      link: "/settings/employee",
      startIcon: <icon.ListAlt />,
    },
    {
      label: t("general"),
      link: "/settings/employee",
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
  const navigate = useNavigate();
  const { t } = useLang();
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
