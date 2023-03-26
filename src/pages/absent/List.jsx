import React from "react";
import FRHooks from "frhooks";
import {
  ListItemText,
  Paper,
  Autocomplete,
  TextField,
  CircularProgress,
  Typography,
  Chip,
  Stack,
  Box,
} from "@mui/material";
import moment from "moment";
import MainTemplate from "@components/templates/MainTemplate";
import * as utils from "@utils/";
import * as BASE from "@components/base";
import apiRoute from "@services/apiRoute";
import DataTable from "../../components/base/table/DataTable";

const columns = (table) => [
  {
    label: "Nama",
    value: (value) => value.name,
    sx: {
      borderRight: 1,
      borderColor: "divider",
    },
  },
  {
    label: "role",
    value: (value) => utils.typesLabel(value.role),
    align: "center",
    head: {
      align: "center",
      sx: {
        width: "10%",
        whiteSpace: "nowrap",
      },
    },
    sx: {
      borderRight: 1,
      borderColor: "divider",
    },
  },
  ...utils
    .getDaysInMonthUTC(moment().format("M"), moment().format("Y"))
    .map((v) => ({
      label: moment(v).format("DD"),
      value: (value) => {
        const find = value.data.find((_v) => _v.day === +moment(v).format("D"));
        return find ? (
          find.absent === "A" ? (
            find.absent
          ) : (
            <ListItemText
              primary={find?.comeAt.substring(0, 5) || "-"}
              primaryTypographyProps={{ variant: "body2" }}
              secondary={find?.closeAt?.substring(0, 5) || "-"}
              secondaryTypographyProps={{ variant: "body2" }}
              sx={{ p: 0, m: 0 }}
            />
          )
        ) : (
          "-"
        );
      },
      align: "center",
      head: {
        align: "center",
        sx: {
          width: "10px",
        },
      },
    })),
];
export default () => {
  const table = FRHooks.useTable(apiRoute.absent.index, {
    selector: (resp) => resp.data,
  });

  const projects = FRHooks.useFetch(apiRoute.project.index, {
    selector: (resp) => resp.data.map((v) => ({ id: v.id, name: v.name })),
    defaultValue: [],
    disabledOnDidMount: false,
  });

  return (
    <MainTemplate
      title="Absensi"
      subtitle={`Daftar semua data absensi karyawan`}
    >
      <Stack spacing={2} direction="row" mb={2}>
        <Autocomplete
          id="asynchronous-demo"
          freeSolo
          fullWidth
          isOptionEqualToValue={(option, value) => option.id === value.id}
          getOptionLabel={(option) => option.name}
          options={projects.data}
          onOpen={() => {
            projects.clear();
          }}
          loading={false}
          onChange={(e, v, r) => {
            if (r === "clear") {
              table.clearOnly(["id", "project"]);
            } else {
              table.setQuery({ id: v.id, project: v.name });
            }
          }}
          renderOption={(props, option) => (
            <li {...props} key={option.id} children={option.name} />
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Proyek"
              onChange={(e) => projects.setQuery({ name: e.target.value })}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <React.Fragment>
                    {projects.loading ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </React.Fragment>
                ),
              }}
            />
          )}
        />
        <BASE.Select
          label="Bulan"
          value={table.query("month", +moment().month() + 1)}
          name="month"
          menu={[
            { text: "Januari", value: 1 },
            { text: "Februari", value: 2 },
            { text: "Maret", value: 3 },
            { text: "April", value: 4 },
            { text: "Mei", value: 5 },
            { text: "Juni", value: 6 },
            { text: "Juli", value: 7 },
            { text: "Agustus", value: 8 },
            { text: "September", value: 9 },
            { text: "Oktober", value: 10 },
            { text: "November", value: 11 },
            { text: "Desember", value: 12 },
          ]}
          setValue={table.setQuery}
        />
        <BASE.Select
          label="Tahun"
          value={table.query("year", +moment().year())}
          name="year"
          menu={[
            { text: "2022", value: 2022 },
            { text: "2023", value: 2023 },
          ]}
          setValue={table.setQuery}
        />
      </Stack>

      {Object.keys(table.queryParams).length === 0 ? null : (
        <Stack direction="row" mb={2} spacing={1} alignItems="center">
          <Typography>Hasil Filter :</Typography>
          <Box flexGrow={1}>
            {Object.entries(table.queryParams).map(([k, v]) => (
              <Chip
                key={k}
                label={k === "month" ? utils.getMonth(v) : v}
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

      <Paper elevation={0} variant="outlined">
        <DataTable
          tableProps={{ size: "small" }}
          data={table.data}
          loading={table.loading}
          column={columns(table)}
        />
      </Paper>
    </MainTemplate>
  );
};
