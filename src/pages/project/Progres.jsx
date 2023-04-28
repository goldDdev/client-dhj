import React from "react";
import FRHooks from "frhooks";
import {
  ListItemText,
  Paper,
  Typography,
  Chip,
  Stack,
  Box,
  IconButton,
  Popper,
  ListItemButton,
  List,
  TableHead,
  TableRow,
  Table,
  TableCell,
  TableContainer,
  TableBody,
  Tooltip,
} from "@mui/material";
import moment from "moment";
import ProjectTemplate from "@components/templates/ProjectTemplate";
import * as utils from "@utils/";
import * as BASE from "@components/base";
import * as FORM from "./form";
import apiRoute from "@services/apiRoute";

import { Refresh, Square } from "@mui/icons-material";
import { useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useAlert } from "@contexts/AlertContext";
import _ from "lodash";

export default () => {
  const { id } = useParams();
  const alert = useAlert();
  let currentPlanId = 0;
  let colSpan = 0;
  const { enqueueSnackbar } = useSnackbar();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [currentProgres, setCurrentProgres] = React.useState({});
  const [boq, setBoq] = React.useState({});
  const [trigger, setTrigger] = React.useState({
    open: false,
    loading: false,
    tooltip: undefined,
  });

  const progres = FRHooks.useFetch([apiRoute.progres.all, { id }], {
    selector: (resp) => resp.data,
    defaultValue: [],
  });

  const handleClick = (value) => (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
    setCurrentProgres(value);
    setTrigger((state) => ({ ...state }));
    const find = progres.data.find((v) => v.id === value.projectBoqId);
    if (find) {
      setBoq(_.omit(find, ["data"]));
    }
  };

  const onOpen = () => {
    setTrigger((state) => ({ ...state, open: !state.open }));
    setAnchorEl(undefined);
  };

  const onDelete = async () => {
    alert.set({
      open: true,
      title: "Mohon Perhatian",
      message:
        "Anda akan menghapus Progres ini dari daftar, apakah anda yakin?",
      type: "warning",
      loading: false,
      close: {
        text: "Keluar",
      },
      confirm: {
        text: "Ya, Saya Mengerti",
        onClick: async () => {
          try {
            alert.set({ loading: true });
            await FRHooks.apiRoute()
              .progres("detail", { id: currentProgres?.id || 0 })
              .destroy();
            alert.reset();
            const index = progres.data.findIndex(
              (v) => v.id === currentProgres.projectBoqId
            );

            if (index > -1) {
              progres.data[index]["data"] = progres.data[index]["data"].filter(
                (v) => v.id !== currentProgres.id
              );
              enqueueSnackbar("Progres berhasil dihapus dari daftar");
              alert.reset();
              setAnchorEl(undefined);
              setCurrentProgres({});
            }
          } catch (err) {
            console.log(err);
          } finally {
            alert.set({ loading: false });
          }
        },
      },
    });
  };

  const onConfirm = async () => {
    alert.set({
      open: true,
      title: "Mohon Perhatian",
      message: "Apakah anda menyetujui progres ini?",
      type: "warning",
      loading: false,
      close: {
        text: "Keluar",
      },
      confirm: {
        text: "Ya, Saya Mengerti",
        onClick: async () => {
          try {
            const currentId = currentProgres?.id || 0;
            alert.set({ loading: true });
            await FRHooks.apiRoute()
              .progres("confirm")
              .data({ id: currentId })
              .sendJson("put");

            const index = progres.data.findIndex(
              (v) => v.id === currentProgres.projectBoqId
            );

            const idxData = progres.data[index]["data"].findIndex(
              (v) => v.id === currentId
            );

            progres.data[index]["data"][idxData]["aproveName"] = "APPROVE";
            alert.reset();
            enqueueSnackbar("Progres berhasil dikonfirmasi");
            setCurrentProgres({});
            setAnchorEl(undefined);
          } catch (err) {
          } finally {
            alert.set({ loading: false });
          }
        },
      },
    });
  };

  return (
    <ProjectTemplate
      title="Progres"
      subtitle={`Daftar semua data progres`}
      headRight={{
        sx: { width: "50%" },
        children: (
          <Stack
            spacing={2}
            direction="row"
            mb={2}
            justifyContent="flex-start"
            alignItems="center"
          >
            <Paper elevation={0} sx={{ width: "80%" }}></Paper>

            <Paper elevation={0}>
              <BASE.Select
                value={progres.getQuery("month", +moment().month() + 1)}
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
                setValue={progres.setQuery}
              />
            </Paper>
            <Paper elevation={0}>
              <BASE.Select
                value={progres.getQuery("year", +moment().year())}
                name="year"
                menu={[
                  { text: "2022", value: 2022 },
                  { text: "2023", value: 2023 },
                ]}
                setValue={progres.setQuery}
              />
            </Paper>
            <IconButton
              sx={{ border: 1, borderColor: "divider" }}
              onClick={() => {
                progres.clear();
              }}
            >
              <Refresh />
            </IconButton>
          </Stack>
        ),
      }}
    >
      {Object.keys(progres.query).length === 0 ? null : (
        <Stack direction="row" mb={2} spacing={1} alignItems="center">
          <Typography>Hasil Filter :</Typography>
          <Box flexGrow={1}>
            {Object.entries(progres.query).map(([k, v]) => (
              <Chip
                key={k}
                label={k === "month" ? utils.getMonth(v - 1) : v}
                size="small"
                variant="outlined"
                color="primary"
                sx={{ ml: 0.5 }}
                clickable
                onDelete={() =>
                  progres.clear([
                    Object.keys(progres.query).filter((_k) => _k !== k),
                  ])
                }
              />
            ))}
          </Box>
        </Stack>
      )}

      <Stack
        direction="row"
        spacing={1}
        justifyContent="flex-end"
        alignItems="center"
      >
        <Square color="warning" />
        <div>Progres Belum Dikonfirmasi</div>
      </Stack>

      <Stack
        direction="row"
        mb={2}
        spacing={1}
        justifyContent="flex-end"
        alignItems="center"
      >
        <Square sx={{ color: "gainsboro" }} />
        <div>Plan SPV</div>
      </Stack>

      <Paper elevation={0} variant="outlined">
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell component="th">Nama</TableCell>
                {...utils
                  .getDaysInMonthUTC(
                    progres.getQuery("month", moment().format("M")),
                    progres.getQuery("year", moment().format("Y"))
                  )
                  .map((d) => (
                    <TableCell
                      component="th"
                      key={d}
                      align="center"
                      sx={{
                        borderRight: 1,
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
              {progres.data.map((value, i) => {
                return (
                  <React.Fragment key={i}>
                    <TableRow>
                      <TableCell rowSpan={2} sx={{ whiteSpace: "nowrap" }}>
                        <ListItemText
                          primary={value.name}
                          secondary={value.typeUnit}
                          sx={{ m: 0 }}
                        />
                      </TableCell>
                      {utils
                        .getDaysInMonthUTC(
                          progres.getQuery("month", moment().format("M")),
                          progres.getQuery("year", moment().format("Y"))
                        )
                        .map((d) => {
                          const find = value.data.find(
                            (_v) => _v.day === +moment(d).format("D")
                          );
                          return (
                            <TableCell
                              key={d}
                              sx={{
                                borderRight: 1,
                                borderLeft: 1,
                                borderColor: "divider",
                              }}
                              padding="none"
                              align="center"
                            >
                              {find ? (
                                <Box
                                  sx={{
                                    backgroundColor: find.aproveName
                                      ? "inherit"
                                      : "warning.main",
                                  }}
                                >
                                  <Tooltip
                                  placement="top-end"
                                  open={trigger.tooltip}
                                    arrow
                                    title={
                                      <ListItemText
                                        primary={`Ditambahkan Oleh: ${
                                          find.submitedName || "-"
                                        }`}
                                        primaryTypographyProps={{
                                          variant: "body2",
                                        }}
                                        secondary={`Disetujui Oleh: ${
                                          find.approveName || "-"
                                        }`}
                                        secondaryTypographyProps={{
                                          variant: "body2",
                                          color: "white",
                                        }}
                                      />
                                    }
                                  >
                                    <IconButton
                                      aria-describedby={`row-${i}-col-${moment(
                                        d
                                      ).format("D")}`}
                                      size="small"
                                      onClick={handleClick(find)}
                                    >
                                      {find.progres}
                                    </IconButton>
                                  </Tooltip>
                                </Box>
                              ) : (
                                <>&nbsp;</>
                              )}
                            </TableCell>
                          );
                        })}
                    </TableRow>

                    <TableRow key={i}>
                      {utils
                        .getDaysInMonthUTC(
                          progres.getQuery("month", moment().format("M")),
                          progres.getQuery("year", moment().format("Y"))
                        )
                        .map((d) => {
                          const progress = 0;
                          const tmp = currentPlanId;
                          const find = value.plans.find(
                            (_v) => _v.day === +moment(d).format("D")
                          );

                          if (find) {
                            currentPlanId =
                              currentPlanId === find.id
                                ? currentPlanId
                                : find.id;
                            colSpan = value.plans.filter(
                              (f) => f.id === find.id
                            ).length;
                          } else {
                            currentPlanId = 0;
                            colSpan = 0;
                          }

                          return find ? (
                            find.id === tmp ? null : (
                              <TableCell
                                key={d}
                                colSpan={colSpan}
                                sx={{
                                  borderRight: 1,
                                  borderLeft: 1,
                                  borderColor: "divider",
                                  backgroundColor: "whitesmoke",
                                  fontWeight: 700,
                                }}
                                padding="none"
                              >
                                <Tooltip
                                  arrow
                                  title={
                                    <ListItemText
                                      primary={`${moment(find.startDate).format(
                                        "DD/MM/yyyy"
                                      )} - ${moment(find.endDate).format(
                                        "DD/MM/yyyy"
                                      )}`}
                                      secondary={`Dibuat Oleh: ${
                                        find.planBy || "-"
                                      }`}
                                      primaryTypographyProps={{
                                        variant: "body2",
                                      }}
                                      secondaryTypographyProps={{
                                        variant: "body2",
                                        color: "white",
                                      }}
                                    />
                                  }
                                >
                                  {find ? (
                                    <div
                                      style={{
                                        flexGrow: 1,
                                        backgroundColor: "gainsboro",
                                        textAlign: "right",
                                        padding: "4px",
                                      }}
                                    >
                                      {colSpan === 1 ? "" : "Plan "}
                                      {find.progress}
                                    </div>
                                  ) : null}
                                </Tooltip>
                              </TableCell>
                            )
                          ) : (
                            <TableCell
                              key={d}
                              sx={{
                                borderRight: 1,
                                borderLeft: 1,
                                borderColor: "divider",
                                backgroundColor: "whitesmoke",
                              }}
                            >
                              &nbsp;
                            </TableCell>
                          );
                        })}
                    </TableRow>
                  </React.Fragment>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Popper id={"simple-popper"} open={Boolean(anchorEl)} anchorEl={anchorEl}>
        <List
          dense
          sx={{
            bgcolor: "background.paper",
            border: 1,
            borderColor: "divider",
          }}
        >
          <ListItemButton divider onClick={onOpen}>
            Ubah
          </ListItemButton>
          {Object.keys(currentProgres).length > 0 &&
          currentProgres.aproveName !== null ? null : (
            <ListItemButton divider onClick={onConfirm}>
              Konfirmasi
            </ListItemButton>
          )}
          {/* <ListItemButton onClick={onDelete}>Hapus</ListItemButton> */}
        </List>
      </Popper>

      <FORM.ProgresUpdate
        loading={trigger.loading}
        open={trigger.open}
        onOpen={onOpen}
        current={currentProgres}
        boq={boq}
        onChange={(e) => {
          setCurrentProgres((state) => ({
            ...state,
            progres: +e.target.value,
          }));
        }}
        onSubmit={async () => {
          try {
            setTrigger((state) => ({ ...state, loading: true }));
            await FRHooks.apiRoute()
              .progres("index")
              .data({
                id: currentProgres?.id || 0,
                progres: currentProgres?.progres || 0,
              })
              .sendJson("put");
            const index = progres.data.findIndex(
              (v) => v.id === currentProgres.projectBoqId
            );

            if (index > -1) {
              const idxData = progres.data[index]["data"].findIndex(
                (v) => v.id === currentProgres.id
              );
              if (idxData > -1) {
                progres.data[index]["data"][idxData]["progres"] =
                  currentProgres.progres;
                progres.data[index]["data"][idxData]["submitedProgres"] =
                  currentProgres.progres;
                enqueueSnackbar("Progres berhasil diperbaharui");
                setTrigger((state) => ({ ...state, open: false }));
              }
            }
          } catch (err) {
            setCurrentProgres((state) => ({
              ...state,
              progres: state.submitedProgres,
            }));
          } finally {
            setTrigger((state) => ({ ...state, loading: false }));
          }
        }}
      />
    </ProjectTemplate>
  );
};
