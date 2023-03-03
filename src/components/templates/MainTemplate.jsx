import { Box, Divider, Stack, Typography } from "@mui/material";
import { Breadcrumb } from "@components/";

const MainTemplate = ({ title, subtitle, breadcrumb, children, headRight }) => {
  document.title = title;
  return (
    <>
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

      <Box sx={{ mt: "24px" }}>{children}</Box>
    </>
  );
};

export default MainTemplate;

MainTemplate.defaultProps = {
  title: "",
  subtitle: "",
  breadcrumb: false,
};
