import {
  Stack,
  Paper,
  TextField,
  MenuItem,
  Typography,
  Chip,
  Box,
  Button,
} from "@mui/material";
import Search from "@mui/icons-material/Search";
import * as utils from "@utils/";
import _ from "lodash";
import {
  Block,
  Check,
  CheckCircle,
  ExpandMore,
  FilterAlt,
  Schedule,
  Work,
} from "@mui/icons-material";

export const TableFilter = ({ t, table }) => {
  return (
    <Stack mb={2} direction="column" spacing={1}>
      <Stack direction="row" spacing={1} alignItems="center">
        <Paper elevation={0}>
          <TextField
            value={table.query("name", "")}
            placeholder={t("search")}
            onChange={(e) => table.setQuery({ name: e.target.value })}
            InputProps={{
              startAdornment: <Search />,
            }}
          />
        </Paper>
        <Paper elevation={0} sx={{ width: { xs: "100%", sm: "10%" } }}>
          <TextField
            value={table.query("status", "")}
            onChange={(e) => table.setQuery({ status: e.target.value })}
            select
          >
            <MenuItem value="" selected>
              {t("choose")}
            </MenuItem>
            <MenuItem value="ACTIVE">{t("ACTIVE")}</MenuItem>
            <MenuItem value="INACTIVE">{t("INACTIVE")}</MenuItem>
          </TextField>
        </Paper>
      </Stack>

      {Object.keys(table.queryParams).length === 0 ? null : (
        <Stack direction="row" mt={1} spacing={1} alignItems="center">
          <Typography>{t("searchResult")} :</Typography>
          <Box flexGrow={1}>
            {Object.entries(table.queryParams).map(([k, v]) => (
              <Chip
                key={k}
                label={t(v)}
                size="small"
                variant="outlined"
                color="primary"
                sx={{ ml: 0.5 }}
                clickable
                onDelete={() => table.clearOnly([k])}
              />
            ))}
          </Box>
        </Stack>
      )}
    </Stack>
  );
};

export const ButtonFilter = ({ table }) => {
  return (
    <Stack
      mb={2}
      direction="row"
      spacing={1}
      justifyContent="space-between"
      alignItems="center"
    >
      <Stack direction="row" spacing={1}>
        {Object.keys(utils.projectStatus).map((v) => (
          <Button
            key={v}
            variant={table.query("status") === v ? "contained" : "outlined"}
            color={table.query("status") === v ? "primary" : "inherit"}
            onClick={() => {
              table.setQuery({ status: v });
            }}
          >
            {utils.projectLabel(v)}
          </Button>
        ))}
      </Stack>

      <Stack direction="row" flexGrow={1} spacing={1} alignItems="center">
        <TextField
          value={table.query("name", "")}
          placeholder="Cari disini"
          InputProps={{
            endAdornment: <Search />,
          }}
          onChange={(e) => table.setQuery({ name: e.target.value })}
        />
      </Stack>
    </Stack>
  );
};

export const ChipKom = ({ status, ...props }) => {
  const icon = {
    PLAN: <Schedule fontSize="small" />,
    CANCEL: <Block fontSize="small" />,
    DONE: <CheckCircle fontSize="small" />,
  };

  return (
    <Button variant="outlined" startIcon={icon[status]} {...props}>
      {utils.komStatusLabel(status)}
    </Button>
  );
};
