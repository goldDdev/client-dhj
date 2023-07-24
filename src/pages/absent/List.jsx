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
  ButtonGroup,
  Button,
  Collapse,
} from "@mui/material";
import moment from "moment";
import MainTemplate from "@components/templates/MainTemplate";
import * as utils from "@utils/";
import * as BASE from "@components/base";
import apiRoute from "@services/apiRoute";
import DataTable from"@components/base/table/DataTable";
import { FilterAlt, FilterAltOff, Refresh, Search } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";

const columns = (table, today) => [
  {
    label: "No",
    align: "center",
    padding: "checkbox",
    size: "small",
    value: (value, i) => table.pagination.from + i,
  },
  {
    label: "Nama",
    size: "small",
    value: (value) => (
      <ListItemText
        sx={{ m: 0, px: 0.5 }}
        primary={value.name}
        primaryTypographyProps={{ variant: "body2" }}
        secondary={utils.typesLabel(value.role)}
        secondaryTypographyProps={{ variant: "body2" }}
      />
    ),
    sx: {
      borderRight: 1,
      borderColor: "divider",
      whiteSpace: "nowrap",
    },
  },

  ...utils
    .getDaysInMonthUTC(moment().format("M"), moment().format("Y"))
    .map((v) => ({
      label: moment(v).format("DD"),
      size: "small",
      value: (value) => {
        const find = value.data.find(
          (_v) => +_v.day === +moment(v).format("D")
        );
        return find ? (
          find.absent === "A" ? (
            find.absent
          ) : (
            <ListItemText
              primary={`${find?.comeAt.substring(0, 5) || "-"} ${
                find?.closeAt ? "-" : ""
              } ${find?.closeAt?.substring(0, 5) || ""}`}
              primaryTypographyProps={{ variant: "body2" }}
              secondary={
                find?.note ? (
                  <span style={{ marginLeft: "8px" }}>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${find.latitude}%2C${find.longitude}`}
                      target="_blank"
                    >
                      {find.note}
                    </a>
                  </span>
                ) : (
                  ""
                )
              }
              secondaryTypographyProps={{ variant: "body2" }}
              sx={{ p: 0, m: 0 }}
            />
          )
        ) : (
          "-"
        );
      },
      align: "center",
      sx: {
        whiteSpace: "nowrap",
      },
      head: {
        align: "center",
        sx: {
          width: "10px",
          backgroundColor:
            moment(v).format("DD-MM-Y") === today ? "info.main" : "#f4f4f4",
          color: moment(v).format("DD-MM-Y") === today ? "white" : "inherit",
        },
        id: moment(v).format("DD-MM-Y"),
      },
    })),
];

const List = () => {
  const today = moment().format("DD-MM-Y");
  const table = FRHooks.useTable(apiRoute.absent.index, {
    selector: (resp) => resp.data,
  });

  const [trigger, setTrigger] = React.useState({
    filter: false,
  });

  const projects = FRHooks.useFetch(apiRoute.project.index, {
    selector: (resp) => resp.data.map((v) => ({ id: v.id, name: v.name })),
    defaultValue: [],
    disabledOnDidMount: false,
  });

  const onFilter = () => {
    setTrigger((state) => ({ ...state, filter: !state.filter }));
  };

  React.useEffect(() => {
    document.getElementById("table-absent").scrollTo({
      left: document.getElementById(today).getBoundingClientRect().left,
    });
  }, []);

  return (
    <MainTemplate
      title="Absensi"
      subtitle={`Daftar semua data absensi karyawan`}
      headRight={{
        children: (
          <ButtonGroup>
            <Button
              variant="outlined"
              color="primary"
              startIcon={trigger.filter ? <FilterAltOff /> : <FilterAlt />}
              onClick={onFilter}
              disabled={table.loading}
            >
              Filter
            </Button>
            <LoadingButton
              onClick={() => {
                table.clear();
                table.reload();
              }}
              disabled={table.loading}
              variant="outlined"
              startIcon={<Refresh />}
              sx={{ whiteSpace: "nowrap" }}
            >
              Muat Ulang
            </LoadingButton>
          </ButtonGroup>
        ),
      }}
    >
      <Collapse in={trigger.filter} unmountOnExit>
        <Stack
          spacing={1}
          mb={2}
          justifyContent="flex-start"
          direction={{
            xs: "column",
            sm: "column",
            md: "column",
            lg: "row",
            xl: "row",
          }}
          alignItems={{
            xs: "flex-start",
            sm: "flex-start",
            md: "flex-start",
            lg: "center",
            xl: "center",
          }}
        >
          <Box minWidth={"25%"}>
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
                  label="Pilih Proyek"
                  onChange={(e) => projects.setQuery({ name: e.target.value })}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <React.Fragment>
                        {projects.loading ? (
                          <CircularProgress color="inherit" size={20} />
                        ) : (
                          <Search color="disabled" />
                        )}
                        {params.InputProps.endAdornment}
                      </React.Fragment>
                    ),
                  }}
                />
              )}
            />
          </Box>
          <Box minWidth={"15%"}>
            <BASE.Select
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
          </Box>
          <Box>
            <BASE.Select
              value={table.query("year", +moment().year())}
              name="year"
              menu={utils.listYear().map((v) => ({ text: v, value: v }))}
              setValue={table.setQuery}
            />
          </Box>
        </Stack>
      </Collapse>

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
          container={{ id: "table-absent" }}
          headProps={{ sx: { backgroundColor: "#f4f4f4" } }}
          tableProps={{
            sx: {
              "& > thead > tr > th:nth-of-type(1), & > thead > tr > th:nth-of-type(2)":
                {
                  position: "-webkit-sticky",
                  position: "sticky",
                  backgroundColor: "#f4f4f4",
                  left: 0,
                  minWidth: "50px",
                },

              "& > tbody > tr > td:nth-of-type(1), & > tbody > tr > td:nth-of-type(2)":
                {
                  backgroundColor: "white",
                  position: "-webkit-sticky",
                  position: "sticky",
                  left: 0,
                  minWidth: "50px",
                  zIndex: 3,
                },
              "& > thead > tr > th:nth-of-type(2), & > tbody > tr > td:nth-of-type(2)":
                {
                  left: 50,
                  zIndex: 389,
                  borderRight: 1,
                  borderColor: "divider",
                  boxShadow: "inset -2px 0 1px -2px rgba(0,0,0,0.50)",
                },
              "& > tbody > tr > td:nth-of-type(1)": {
                boxShadow: "inset -2px 0 1px -2px rgba(0,0,0,0.50)",
              },
              "& td:not(:nth-of-type(1)), & td:not(:nth-of-type(2))": {
                borderRight: 1,
                borderColor: "divider",
              },
              marginBottom: 1.5,
            },
          }}
          data={table.data}
          loading={table.loading}
          column={columns(table, today)}
        />
      </Paper>
    </MainTemplate>
  );
};

export default List;
