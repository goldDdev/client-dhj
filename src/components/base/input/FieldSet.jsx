import { Divider, Stack, Typography } from "@mui/material";

export default ({
  label,
  disabledDivider,
  children,
  stackProps,
  labelProps,
}) => {
  return (
    <Stack direction="column" spacing={1}>
      {label ? (
        <div>
          <Typography variant="subtitle1" fontWeight={800} {...labelProps}>
            {label}
          </Typography>
        </div>
      ) : null
      }
      {disabledDivider ? null : <Divider flexItem />}

      <Stack
        justifyContent="space-between"
        alignItems={{
          xs: "flex-start",
          sm: "flex-start",
          md: "flex-start",
          lg: "center",
          xl: "center",
        }}
        pt={0.8}
        spacing={1}
        direction={{
          xs: "column",
          sm: "column",
          md: "column",
          lg: "row",
          xl: "row",
        }}
        {...stackProps}
      >
        {children}
      </Stack>
    </Stack>
  );
};
