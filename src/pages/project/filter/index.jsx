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
import { Block, CheckCircle, Schedule, Work } from "@mui/icons-material";
import { Select } from "@components/base";

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

export const ButtonFilter = ({ table }) => {
  return (
    <Stack
      mb={2}
      direction={{
        xs: "column",
        sm: "column",
        md: "column",
        lg: "row",
        xl: "row",
      }}
      spacing={1}
      justifyContent="space-between"
      alignItems={{
        xs: "flex-start",
        sm: "flex-start",
        md: "flex-start",
        lg: "center",
        xl: "center",
      }}
    >
      <Stack
        direction="row"
        overflow={{
          xs: "scroll",
          sm: "scroll",
          md: "scroll",
          lg: "unset",
          xl: "unset",
        }}
        width={"100%"}
        spacing={1}
      >
        <Box>
          <Button
            fullWidth
            key={99}
            variant={!table.query("status") ? "contained" : "outlined"}
            color={!table.query("status") ? "primary" : "inherit"}
            onClick={() => {
              table.setQuery({ status: "" });
            }}
            sx={{ whiteSpace: "nowrap", minWidth: "30%" }}
          >
            Semua Status
          </Button>
        </Box>

        <Select
          fullWidth
          name="status"
          label="Status"
          menu={[
            { text: "Pilih Status", value: "00" },
            ...Object.keys(utils.projectStatus).map((v) => ({
              text: utils.projectStatus[v],
              value: v,
            })),
          ]}
          value={table.query("status", "00")}
          onChange={(e) => {
            if (e.target.value === "00") {
              table.clearOnly(["status"]);
            } else {
              table.setQuery({ status: e.target.value });
            }
          }}
        />
        {/* {Object.keys(utils.projectStatus).map((v) => (
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
        ))} */}
      </Stack>

      <TextField
        fullWidth
        value={table.query("name", "")}
        placeholder="Cari disini"
        InputProps={{
          endAdornment: <Search />,
        }}
        onChange={(e) => table.setQuery({ name: e.target.value })}
      />
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
