import { Box, Divider, Stack, Typography } from "@mui/material";
import { Breadcrumb } from "@components/";

const MainTemplate = ({ title, subtitle, breadcrumb, children, headRight }) => {
  document.title = title;
  return (
    <>
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
