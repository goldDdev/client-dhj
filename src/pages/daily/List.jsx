import React from "react";
import FRHooks from "frhooks";
import {
  Button,
  ButtonGroup,
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
} from "@mui/material";
import { useSnackbar } from "notistack";
import moment from "moment";
import MainTemplate from "@components/templates/MainTemplate";
import * as utils from "@utils/";
import * as FORM from "./form";
import * as Dummy from "../../constants/dummy";
import * as BASE from "@components/base";
import { Add, Edit, Refresh } from "@mui/icons-material";
import apiRoute from "@services/apiRoute";
import { useAlert } from "@contexts/AlertContext";

export default () => {
  const alert = useAlert();
  const { enqueueSnackbar } = useSnackbar();

  const [trigger, setTrigger] = React.useState({
    form: false,
  });

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
    setTrigger((state) => ({ ...state, form: !state.form }));
    mutation.clearData();
    mutation.clearError();
    projects.data = [];
    employees.data = [];
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
        enqueueSnackbar("Plan mingguan berhasil ditambahkan");
        table.refresh();
        mutation.clearData();
        mutation.clearError();
        setTrigger((state) => ({ ...state, form: false }));
      },
    });
  };

  const onUpdate = (value) => {
    setTrigger((state) => ({ ...state, form: true }));
    projects.add({
      id: value.projectId,
      name: value.projectName,
    });

    employees.add({
      id: value.employeeId,
      name: value.name,
      role: value.role,
    });

    mutation.setData({
      employeeId: value.employeeId,
      projectId: value.projectId,
      date: value.date,
      projectName: value.projectName,
      name: value.name,
      role: value.role,
      id: value.id,
    });
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

  return (
    <MainTemplate
      title="Daily Plan"
      subtitle={`Daftar semua rencana harian karyawan`}
      headRight={{
        children: (
          <ButtonGroup>
            <Button
              variant="contained"
              disableElevation
              startIcon={<Add />}
              onClick={onOpen}
            >
              Tambah Plan
            </Button>
            <Button
              variant="outlined"
              onClick={table.refresh}
              startIcon={<Refresh />}
            >
              Muat Ulang
            </Button>
          </ButtonGroup>
        ),
      }}
    >
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
        <BASE.Select
          label="Bulan"
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
        <BASE.Select
          label="Tahun"
          value={table.getQuery("year", moment().year())}
          menu={utils.listYear().map((v) => ({ text: v, value: v }))}
          onChange={(e) => {
            table.setQuery({ year: +e.target.value });
          }}
        />
      </Stack>

      <Paper elevation={0} variant="outlined">
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell component="th" sx={{ whiteSpace: "nowrap" }}>
                  Nama
                </TableCell>
                {dates.map((d, _i) => (
                  <TableCell
                    component="th"
                    key={d}
                    align="center"
                    sx={{
                      borderRight: _i === dates.length - 1 ? 0 : 1,
                      borderLeft: 1,
                      borderColor: "divider",
                    }}
                  >
                    {moment(d).format("DD")}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {!table.loading && table.data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} align="center">
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
                table.data.map((value, idx) =>
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
                            }}
                          >
                            <ListItemText
                              sx={{ p: 0, m: 0 }}
                              primary={value.name || "-"}
                              secondary={utils.typesLabel(value.role)}
                            />
                          </TableCell>
                        </>
                      ) : null}

                      {dates.map((d, _i) => {
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
                                backgroundColor: "divider",
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
                            sx={{
                              borderRight: _i === dates.length - 1 ? 0 : 1,
                              borderColor: "divider",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {find.day === 0 ? (
                              "-"
                            ) : (
                              <Stack
                                direction="row"
                                alignItems="center"
                                spacing={1}
                              >
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
                                <ListItemText
                                  sx={{ p: 0, m: 0 }}
                                  primary={find.projectName || "-"}
                                  primaryTypographyProps={{
                                    variant: "body2",
                                  }}
                                  secondary={
                                    <>
                                      <span>
                                        {moment(find.date).format("DD-MM-yyyy")}
                                      </span>

                                      {find.locationAt ? (
                                        <span style={{ marginLeft: "8px" }}>
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
                                  }}
                                />
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

      <FORM.Create
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
