import React from "react";
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Stack,
} from "@mui/material";
import * as BASE from "@components/";
import MoreHoriz from "@mui/icons-material/MoreHoriz";

export default ({ keys, data, dropdown }) => {
  return (
    <List>
      {(data || []).map((v, i) => (
        <ListItem
          key={`${keys || ""}-${i}`}
          component={Paper}
          elevation={0}
          variant="outlined"
          sx={{ mb: 1, p: 1.5 }}
        >
          <ListItemText
            sx={{ my: 0 }}
            primary={
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="flex-start"
                spacing={1}
                mb={1}
              >
                <Typography component="p" variant="subtitle2" fontSize={14}>
                  {v.title}
                </Typography>
                <BASE.Dropdown
                  type="Icon"
                  {...dropdown}
                  MenuProps={{ MenuListProps: { dense: true } }}
                >
                  <MoreHoriz fontSize="small" />
                </BASE.Dropdown>
              </Stack>
            }
            secondary={
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing={1}
              >
                <Typography variant="body2" fontSize={14}>
                  {v.companyName}
                </Typography>
                <Typography variant="body2" fontSize={14}>
                  {v.startAt}
                </Typography>
              </Stack>
            }
            disableTypography
          />
        </ListItem>
      ))}
    </List>
  );
};
