import React from "react";
import FRHooks from "frhooks";
import {
  Box,
  Button,
  ButtonGroup,
  Collapse,
  IconButton,
  ListItemText,
  Paper,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { useSnackbar } from "notistack";
import moment from "moment";
import MainTemplate from "@components/templates/MainTemplate";
import * as utils from "@utils/";
import * as Dummy from "@constants/dummy";
import * as BASE from "@components/base";
import {
  Add,
  Edit,
  FilterAlt,
  FilterAltOff,
  Refresh,
  Search,
} from "@mui/icons-material";
import apiRoute from "@services/apiRoute";
import { useAlert } from "@contexts/AlertContext";
import DailyCreate from "./form/DailyCreate";

const List = () => {
  const alert = useAlert();
  const today = moment().format("DD-MM-Y");

  const { enqueueSnackbar } = useSnackbar();

  const [trigger, setTrigger] = React.useState({
    form: false,
    filter: false,
    currentData: "",
  });

  const [name, setName] = React.useState("");

  const validation = FRHooks.useServerValidation({
    url: apiRoute.dailyPlan.validation,
    param: {
      path: "field",
      type: "rule",
    },

    selector: (resp) => {
      return resp.error.messages.errors;
    },
    option: {
      unique: (param) =>
        "Karyawan ini sudah memiliki plan proyek pada range tanggal tersebut",
    },
  });

  const table = FRHooks.useFetch(apiRoute.dailyPlan.index, {
    defaultValue: [],
    selector: (resp) => resp.data,
  });

  const projects = FRHooks.useFetch(apiRoute.dailyPlan.project, {
    defaultValue: [],
    selector: (resp) => resp.data,
    disabledOnDidMount: true,
  });

  const employees = FRHooks.useFetch(apiRoute.dailyPlan.employee, {
    defaultValue: [],
    selector: (resp) => resp.data,
    disabledOnDidMount: true,
  });

  const dates = utils.getDaysInMonthUTC(
    table.getQuery("month", moment().format("M")),
    table.getQuery("year", moment().format("Y"))
  );

  const mutation = FRHooks.useMutation({
    defaultValue: Dummy.dailyPlan,
    isNewRecord: (data) => data.id === 0,
    schema: (y) =>
      y.object().shape({
        employeeId: y.number().required().moreThan(0, "Tidak Boleh Kosong"),
        projectId: y.number().required().moreThan(0, "Tidak Boleh Kosong"),
        date: y.string().required(),
        projectName: y.string().nullable(),
        name: y.string().nullable(),
        role: y.string().nullable(),
      }),
  });

  const onOpen = () => {
    mutation.clearData();
    mutation.clearError();
    setTrigger((state) => ({
      ...state,
      form: !state.form,
      currentData: btoa(JSON.stringify(Dummy.dailyPlan)),
    }));

    projects.data = [];
    employees.data = [];
  };

  const onFilter = () => {
    setTrigger((state) => ({ ...state, filter: !state.filter }));
  };

  const onSubmit = () => {
    mutation.post([apiRoute.dailyPlan.index], {
      validation: true,
      method: mutation.isNewRecord ? "post" : "put",
      except: mutation.isNewRecord
        ? ["id", "projectName", "role", "name"]
        : ["projectName", "role", "name"],
      serverValidation: {
        serve: validation.serve,
        method: "post",
      },
      onSuccess: () => {
        enqueueSnackbar(
          mutation.isNewRecord
            ? "Plan harian berhasil ditambahkan"
            : "Plan harian berhasil diperbaharui"
        );
        table.refresh();
        mutation.clearData();
        mutation.clearError();
        setTrigger((state) => ({ ...state, form: false }));
      },
    });
  };

  const onUpdate = (value) => {
    const data = {
      id: value.id,
      projectId: value.projectId,
      employeeId: value.employeeId,
      projectName: value.projectName,
      name: value.name,
      role: value.role,
      date: value.date,
    };

    projects.add({
      id: data.projectId,
      name: data.projectName,
    });

    employees.add({
      id: data.employeeId,
      name: data.name,
      role: data.role,
    });

    setTrigger((state) => ({
      ...state,
      form: true,
      currentData: btoa(JSON.stringify(data)),
    }));
    mutation.setData(data);
  };

  const onDelete = (id) => () => {
    alert.set({
      open: true,
      title: "Mohon Perhatian",
      message:
        "Anda akan menghapus Plan Harian ini dari daftar, apakah anda yakin?",
      type: "warning",
      loading: false,
      close: {
        text: "Keluar",
      },
      confirm: {
        text: "Ya, Saya Mengerti",
        onClick: () => {
          mutation.destroy([apiRoute.dailyPlan.destroy, { id }], {
            onBeforeSend: () => {
              alert.set({ loading: true });
            },
            onSuccess: () => {
              enqueueSnackbar("Plan berhasil dihapus dari daftar");
              table.refresh();
              alert.set({ open: false, loading: false });
              mutation.clearData();
              mutation.clearError();
              setTrigger((state) => ({ ...state, form: false }));
            },
            onAlways: () => {
              alert.set({ loading: false });
            },
          });
        },
      },
    });
  };

  React.useEffect(() => {
    document.getElementById("table-daily").scrollTo({
      left: document.getElementById(today).getBoundingClientRect().left,
    });
  }, []);

  const isCurr = React.useMemo(
    () => trigger.currentData !== btoa(JSON.stringify(mutation.data)),
    [mutation.data, trigger.currentData]
  );

  return (
    <MainTemplate
      title="Daily Plan"
      subtitle={`Daftar semua rencana harian karyawan`}
      headRight={{
        children: (
          <ButtonGroup>
            <Button
              disabled={table.loading}
              variant="outlined"
              onClick={onFilter}
              startIcon={trigger.filter ? <FilterAltOff /> : <FilterAlt />}
            >
              Filter
            </Button>

            <Button
              variant="outlined"
              onClick={table.refresh}
              startIcon={<Refresh />}
              disabled={table.loading}
            >
              Muat Ulang
            </Button>

            <Button
              variant="contained"
              disableElevation
              startIcon={<Add />}
              onClick={onOpen}
              disabled={table.loading}
            >
              Tambah Plan
            </Button>
          </ButtonGroup>
        ),
      }}
    >
      <Collapse in={trigger.filter} unmountOnExit>
        <Stack
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
          spacing={1}
          sx={{ mb: 2 }}
        >
          <Box
            sx={{
              width: {
                md: "25%",
              },
            }}
          >
            <TextField
              placeholder="Cari nama disini"
              InputProps={{ endAdornment: <Search color="disabled" /> }}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </Box>
          <Box
            sx={{
              width: {
                md: "15%",
              },
            }}
          >
            <BASE.Select
              label="Bulan"
              fullWidth={true}
              value={table.getQuery("month", moment().month() + 1)}
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
              onChange={(e) => {
                table.setQuery({ month: +e.target.value });
              }}
            />
          </Box>
          <div>
            <BASE.Select
              label="Tahun"
              value={table.getQuery("year", moment().year())}
              menu={utils.listYear().map((v) => ({ text: v, value: v }))}
              onChange={(e) => {
                table.setQuery({ year: +e.target.value });
              }}
            />
          </div>
        </Stack>
      </Collapse>

      <Paper elevation={0} variant="outlined">
        <TableContainer id="table-daily">
          <Table
            sx={{
              "& thead > tr > th:first-of-type, & tbody > tr > td:first-of-type[rowspan]":
                {
                  position: "-webkit-sticky",
                  position: "sticky",
                  left: 0,
                  zIndex: 2,
                  top: "auto",
                  boxShadow: "inset -2px 0 1px -2px rgba(0,0,0,0.50)",
                },
              "& tbody > tr > td:first-of-type[rowspan]": {
                backgroundColor: "white",
              },
              marginBottom: 1.5,
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell
                  size="small"
                  component="th"
                  sx={{ whiteSpace: "nowrap", backgroundColor: "#f4f4f4" }}
                >
                  Nama
                </TableCell>
                {dates.map((d, _i) => (
                  <TableCell
                    id={moment(d).format("DD-MM-Y")}
                    component="th"
                    key={d}
                    align="center"
                    size="small"
                    sx={{
                      borderRight: _i === dates.length - 1 ? 0 : 1,
                      borderLeft: 1,
                      borderColor: "divider",
                      whiteSpace: "nowrap",
                      backgroundColor:
                        moment(d).format("DD-MM-Y") === today
                          ? "info.main"
                          : "#f4f4f4",
                      color:
                        moment(d).format("DD-MM-Y") === today
                          ? "white"
                          : "inherit",
                    }}
                  >
                    {moment(d).format("DD")}/
                    <sub>{moment(d).format("M").padStart(2, "0")}</sub>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {!table.loading && table.data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} align="left" sx={{ borderBottom: 0 }}>
                    Plan Belum Tersedia
                  </TableCell>
                </TableRow>
              ) : null}

              {table.loading ? (
                <TableRow>
                  <TableCell align="center">
                    <Skeleton width={"100%"} />
                  </TableCell>

                  {dates.map((_d, _l) => (
                    <TableCell key={_l} align="center">
                      <Skeleton width={"100%"} />
                    </TableCell>
                  ))}
                </TableRow>
              ) : (
                table.data
                  .filter((v) =>
                    v.name
                      .toLocaleLowerCase()
                      .includes(name.toLocaleLowerCase())
                  )
                  .map((value, idx) =>
                    value.employees.map((val, idx) => (
                      <TableRow key={idx}>
                        {idx === 0 ? (
                          <>
                            <TableCell
                              size="small"
                              rowSpan={value.employees.length}
                              sx={{
                                borderRight: 1,
                                borderColor: "divider",
                                whiteSpace: "nowrap",
                                p: 0,
                                px: 1,
                              }}
                            >
                              <ListItemText
                                sx={{ p: 0, m: 0 }}
                                primary={value.name || "-"}
                                primaryTypographyProps={{ variant: "body2" }}
                                secondary={utils.typesLabel(value.role)}
                                secondaryTypographyProps={{
                                  variant: "caption",
                                }}
                              />
                            </TableCell>
                          </>
                        ) : null}

                        {dates.map((d, _i) => {
                          const isToday = moment(d).format("DD-MM-Y") === today;
                          const find = val.plans.find(
                            (f) => f.day === d.getDate()
                          );

                          if (!find) {
                            return (
                              <TableCell
                                key={`day-${_i}`}
                                align="center"
                                size="small"
                                sx={{
                                  borderRight: _i === dates.length - 1 ? 0 : 1,
                                  borderColor: "divider",
                                  whiteSpace: "nowrap",
                                  p: 0.5,
                                }}
                              >
                                -
                              </TableCell>
                            );
                          }

                          return (
                            <TableCell
                              key={`day-${_i}`}
                              align="center"
                              size="small"
                              sx={(theme) => ({
                                borderRight: _i === dates.length - 1 ? 0 : 1,
                                borderColor: "divider",
                                whiteSpace: "nowrap",
                                p: 0.5,
                                overflow: "hidden",
                                position: "relative",
                                "&:hover > div": {
                                  border: 1,
                                  borderColor: "success",
                                  zIndex: 1,
                                  top: 0,
                                  left: 0,
                                  backgroundColor: "white",
                                  boxShadow: theme.shadows[10],
                                },
                                "&:hover": {
                                  overflow: "unset",
                                },
                                "&:hover > div > div:nth-of-type(1) > p:not(:first-of-type)":
                                  {
                                    display: "block",
                                  },
                              })}
                            >
                              {find.day === 0 ? (
                                "-"
                              ) : (
                                <Stack
                                  className="test"
                                  direction="row"
                                  alignItems="center"
                                  spacing={1.5}
                                  sx={{
                                    px: 0.5,
                                    position: "absolute",
                                    top: 0,
                                  }}
                                >
                                  <ListItemText
                                    sx={{
                                      p: 0,
                                      m: 0,
                                      flexGrow: 1,
                                    }}
                                    primary={find.projectName || "-"}
                                    primaryTypographyProps={{
                                      variant: "body2",
                                      align: "left",
                                      sx: {
                                        whiteSpace: "nowrap",
                                      },
                                    }}
                                    secondary={
                                      <>
                                        {find.locationAt ? (
                                          <span>
                                            <a
                                              href={`https://www.google.com/maps/search/?api=1&query=${find.latitude}%2C${find.longitude}`}
                                              target="_blank"
                                            >
                                              Lihat Map ({find.locationAt})
                                            </a>
                                          </span>
                                        ) : null}
                                      </>
                                    }
                                    secondaryTypographyProps={{
                                      variant: "body2",
                                      align: "left",
                                      sx: {
                                        whiteSpace: "nowrap",
                                        display: "none",
                                      },
                                    }}
                                  />

                                  <div>
                                    <IconButton
                                      size="small"
                                      onClick={() => {
                                        const fnd = value.data.find(
                                          (fn) => fn.id === find.id
                                        );

                                        if (fnd) {
                                          onUpdate(fnd);
                                        }
                                      }}
                                    >
                                      <Edit fontSize="inherit" />
                                    </IconButton>
                                  </div>
                                </Stack>
                              )}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))
                  )
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <DailyCreate
        isCurr={isCurr}
        open={trigger.form}
        mutation={mutation}
        projects={projects}
        employees={employees}
        onSubmit={onSubmit}
        onOpen={onOpen}
        onDelete={onDelete}
      />
    </MainTemplate>
  );
};

export default List;
