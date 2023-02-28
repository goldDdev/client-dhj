import { Box, BoxProps, Stack, Typography } from "@mui/material";
import { Breadcrumb } from "@components/";

interface MainTemplateProps {
  title: string;
  subTitle?: string;
  breadcrumb: boolean;
  headRight?: BoxProps;
  children: any;
}

const MainTemplate = ({
  title,
  subTitle,
  breadcrumb,
  children,
  headRight,
}: MainTemplateProps): JSX.Element => {
  document.title = title;
  return (
    <>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Box sx={{ diplay: "flex", flexDirection: "column" }}>
          <Typography component="h5" variant="h5">
            {title}
          </Typography>
          {!breadcrumb && (
            <Typography variant="subtitle1">{subTitle}</Typography>
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
  subTitle: "",
  breadcrumb: false,
};
