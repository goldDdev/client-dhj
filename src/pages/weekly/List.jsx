import React from "react";
import FRHooks from "frhooks";
import {
  Box,
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
  const days = {
    1: [1, 2, 3, 4, 5, 6, 7],
    2: [8, 9, 10, 11, 12, 13, 14],
    3: [15, 16, 17, 18, 19, 20, 21],
    4: [22, 23, 24, 25, 26, 27, 28],
    0: [29, 30, 31, 0, 0, 0, 0],
  };
  const [filter, setFilter] = React.useState({
    week: 1,
  });
  const [trigger, setTrigger] = React.useState({
    form: false,
  });

  const validation = FRHooks.useServerValidation({
    url: apiRoute.weeklyPlan.validation,
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

  const table = FRHooks.useFetch(apiRoute.weeklyPlan.index, {
    defaultValue: [],
    selector: (resp) => resp.data,
  });

  const projects = FRHooks.useFetch(apiRoute.weeklyPlan.project, {
    defaultValue: [],
    selector: (resp) => resp.data,
    disabledOnDidMount: true,
  });

  const employees = FRHooks.useFetch(apiRoute.weeklyPlan.employee, {
    defaultValue: [],
    selector: (resp) => resp.data,
    disabledOnDidMount: true,
  });

  const mutation = FRHooks.useMutation({
    defaultValue: Dummy.weeklyPlan,
    isNewRecord: (data) => data.id === 0,
    schema: (y) =>
      y.object().shape({
        employeeId: y.number().required().moreThan(0, "Tidak Boleh Kosong"),
        projectId: y.number().required().moreThan(0, "Tidak Boleh Kosong"),
        startDate: y.string().required(),
        endDate: y.string().required(),
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
    mutation.post([apiRoute.weeklyPlan.index], {
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
      startDate: value.startDate,
      endDate: value.endDate,
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
        "Anda akan menghapus Plan Mingguan ini dari daftar, apakah anda yakin?",
      type: "warning",
      loading: false,
      close: {
        text: "Keluar",
      },
      confirm: {
        text: "Ya, Saya Mengerti",
        onClick: () => {
          mutation.destroy([apiRoute.weeklyPlan.destroy, { id }], {
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
      title="Weekly Plan"
      subtitle={`Daftar semua rencana mingguan karyawan (QC Team, Material Team, Equipment Team)`}
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
          label="Minggu"
          value={filter.week}
          menu={[
            { text: "Minggu ke-1", value: 1 },
            { text: "Minggu ke-2", value: 2 },
            { text: "Minggu ke-3", value: 3 },
            { text: "Minggu ke-4", value: 4 },
            { text: "Tanggal Lainya", value: 0 },
          ]}
          onChange={(e) => {
            setFilter((state) => ({ ...state, week: +e.target.value }));
          }}
        />
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
                <TableCell component="th">Nama</TableCell>
                {days[filter.week].map((v, i) => (
                  <TableCell key={i} align="center">
                    {v > 0 ? v : "-"}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {!table.loading &&
              table.data.filter((fl) =>
                fl.projects.filter((_fl) =>
                  _fl.plans.some((d) => days[filter.week].includes(d.day))
                )
              ).length === 0 ? (
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
                  <TableCell align="center">
                    <Skeleton width={"100%"} />
                  </TableCell>
                  <TableCell align="center">
                    <Skeleton width={"100%"} />
                  </TableCell>
                  <TableCell align="center">
                    <Skeleton width={"100%"} />
                  </TableCell>
                  <TableCell align="center">
                    <Skeleton width={"100%"} />
                  </TableCell>
                  <TableCell align="center">
                    <Skeleton width={"100%"} />
                  </TableCell>
                  <TableCell align="center">
                    <Skeleton width={"100%"} />
                  </TableCell>
                  <TableCell align="center">
                    <Skeleton width={"100%"} />
                  </TableCell>
                </TableRow>
              ) : (
                table.data
                  .filter((fl) =>
                    fl.projects.filter((_fl) =>
                      _fl.plans.some((d) => days[filter.week].includes(d.day))
                    )
                  )
                  .map((value) => {
                    return {
                      ...value,
                      projects: value.projects.map((vl) => {
                        const plans = [];
                        for (const dd of days[filter.week]) {
                          if (vl.plans.map((v) => v.day).includes(dd)) {
                            const find = vl.plans.find((fn) => fn.day === dd);
                            if (find) {
                              plans.push(find);
                            }
                          } else {
                            plans.push({
                              startDate: null,
                              endDate: null,
                              projectId: null,
                              day: 0,
                            });
                          }
                        }

                        return { ...vl, plans };
                      }),
                    };
                  })
                  .map((value) =>
                    value.projects.map((val, idx) => (
                      <TableRow key={idx}>
                        {idx === 0 ? (
                          <>
                            <TableCell
                              size="small"
                              rowSpan={value.projects.length}
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

                        {val.plans
                          .reduce((p, n) => {
                            if (val.plans.length > 0) {
                              if (p.length === 0) {
                                p.push({ ...n, colSpan: 1 });
                              } else {
                                const last = p[p.length - 1];
                                if (last.day === 0 && n.day === 0) {
                                  p.push({ ...n, colSpan: 1 });
                                } else if (last.day > 0 && n.day === 0) {
                                  p.push({ ...n, colSpan: 1 });
                                } else if (
                                  last.id === n.id &&
                                  last.projectId === n.projectId
                                ) {
                                  last["colSpan"] = last["colSpan"] + 1;
                                } else {
                                  p.push({ ...n, colSpan: 1 });
                                }
                              }
                            }
                            return p;
                          }, [])
                          .map((_v, _i) => (
                            <TableCell
                              key={`day-${_i}`}
                              colSpan={+_v.colSpan}
                              align="center"
                              size="small"
                              sx={{
                                borderRight: _i === 6 ? 0 : 1,

                                borderColor: "divider",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {_v.day === 0 ? (
                                "-"
                              ) : (
                                <Stack direction="row" alignItems="center">
                                  <div>
                                    <IconButton
                                      size="small"
                                      onClick={() => {
                                        const find = value.data.find(
                                          (fn) => fn.id === _v.id
                                        );
                                        if (find) {
                                          onUpdate(find);
                                        }
                                      }}
                                    >
                                      <Edit fontSize="inherit" />
                                    </IconButton>
                                  </div>
                                  <ListItemText
                                    sx={{ p: 0, m: 0 }}
                                    primary={_v.projectName || "-"}
                                    primaryTypographyProps={{
                                      variant: "body2",
                                    }}
                                    secondary={`${moment(_v.startDate).format(
                                      "DD-MM-yyyy"
                                    )} - ${moment(_v.endDate).format(
                                      "DD-MM-yyyy"
                                    )}`}
                                    secondaryTypographyProps={{
                                      variant: "body2",
                                    }}
                                  />
                                </Stack>
                              )}
                            </TableCell>
                          ))}
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