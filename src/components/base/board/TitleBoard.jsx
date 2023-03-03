import React from "react";
import { Stack, Typography, Divider, Chip } from "@mui/material";

export default ({ title, divider, total }) => {
  return (
    <>
      <Stack
        direction="row"
        justifyContent="flex-start"
        alignItems="center"
        spacing={1}
        mb={1}
      >
        <Typography>{title}</Typography>
        {total ? <Chip label={total} size="small" /> : null}
      </Stack>

      {divider ? <Divider /> : null}
    </>
  );
};
