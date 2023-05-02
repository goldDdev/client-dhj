import {
  Stack,
  Paper,
  TextField,
  MenuItem,
  Typography,
  Chip,
  Box,
} from "@mui/material";
import Search from "@mui/icons-material/Search";
import * as utils from "@utils/";
import _ from "lodash";

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
        <Paper elevation={0} sx={{ width: { xs: "100%", sm: "12%" } }}>
          <TextField
            value={table.query("role", "")}
            onChange={(e) => table.setQuery({ role: e.target.value })}
            select
          >
            <MenuItem value="" selected>
              {t("choose")}
            </MenuItem>
            {utils.types.map((v) => (
              <MenuItem key={v} value={v}>
                {t(v)}
              </MenuItem>
            ))}
          </TextField>
        </Paper>
      </Stack>

      {Object.keys(table.queryParams).length === 0 ? null : (
        <Stack direction="row" mt={1} spacing={1} alignItems="center">
          <Typography>Hasil Pencarian :</Typography>
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
