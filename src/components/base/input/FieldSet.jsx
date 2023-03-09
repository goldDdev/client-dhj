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
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        pt={0.8}
        spacing={1}
        {...stackProps}
      >
        {children}
      </Stack>
    </Stack>
  );
};
