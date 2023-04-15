import React, { useState } from "react";
import {
  Button,
  Stack,
  TextField,
  Skeleton,
  Paper,
  Box,
  IconButton,
  CircularProgress,
  Grid,
  Typography,
  Divider,
  Badge,
  ListItemText,
} from "@mui/material";
import { BasicDropdown, Timeline } from "@components/base";
import { useSnackbar } from "notistack";
import * as Dummy from "../../constants/dummy";
import * as FORM from "./form";
import FRHooks from "frhooks";
import DataTable from "../../components/base/table/DataTable";
import ProjectTemplate from "@components/templates/ProjectTemplate";
import moment from "moment";
import { useNavigate, useParams } from "react-router-dom";
import {
  MoreVert,
  Add,
  Search,
  Edit,
  Close,
  Check,
  Clear,
  RefreshOutlined,
  Refresh,
  NotificationImportant,
  ErrorOutline,
} from "@mui/icons-material";
import { useAlert } from "@contexts/AlertContext";
import apiRoute from "@services/apiRoute";
import { LoadingButton } from "@mui/lab";

const columns = (
  onDelete,
  onUpdate,
  onHistory,
  table,
  mutation,
  currentId,
  url,
  postLoading,
  snackbar,
  navigate
) => {
  const borderPlan = { borderRight: 1, borderLeft: 1, borderColor: "divider" };
  return [
    {
      label: "Nama",
      sortKey: "name",
      value: (value) =>
        postLoading.some((v) => v === value.boqId) ? (
          <Skeleton width="100%" />
        ) : (
          <ListItemText
            sx={{ mx: 1, my: 0 }}
            primary={value.name || "-"}
            primaryTypographyProps={{ variant: "body2" }}
            secondary={value.typeUnit || "-"}
            secondaryTypographyProps={{ variant: "body2" }}
          />
        ),
      padding: "none",
    },

    {
      label: "Jumlah",
      value: (value) => (
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="center"
          spacing={1}
        >
          <Box>
            {currentId === value.id ? (
              <TextField
                size="small"
                value={mutation.data.unit}
                onChange={(e) => mutation.setData({ unit: +e.target.value })}
                variant="standard"
                error={mutation.error("unit")}
                helperText={mutation.message("unit")}
                InputProps={{
                  inputProps: {
                    style: { textAlign: "center" },
                    maxLength: 5,
                  },
                  startAdornment: (
                    <IconButton
                      disabled={mutation.processing}
                      onClick={onUpdate(value)}
                      size="small"
                    >
                      <Close fontSize="inherit" />
                    </IconButton>
                  ),
                  endAdornment: (
                    <IconButton
                      disabled={mutation.processing}
                      onClick={() => {
                        mutation.put(url, {
                          onSuccess: ({ data }) => {
                            snackbar("BOQ proyek berhasil diperbaharui", {
                              variant: "success",
                            });
                            value.unit = data.unit;
                            value.updatedAt = data.updatedAt;
                            onUpdate(data)();
                          },
                        });
                      }}
                      size="small"
                    >
                      {mutation.processing ? (
                        <CircularProgress size={20} />
                      ) : (
                        <Check fontSize="inherit" />
                      )}
                    </IconButton>
                  ),
                }}
                sx={{ minWidth: "150px" }}
              />
            ) : (
              value.unit
            )}
          </Box>

          {currentId === value.id ? null : (
            <Box display="flex" flexDirection="row" gap={1}>
              <IconButton onClick={onUpdate(value)} size="small">
                <Edit fontSize="inherit" />
              </IconButton>
            </Box>
          )}
        </Stack>
      ),
      align: "center",
      padding: "checkbox",
      head: {
        align: "center",
      },
      sx: {
        ...borderPlan,
      },
    },
    {
      label: "Progres",
      value: (value) =>
        postLoading.some((v) => v === value.boqId) ? (
          <Skeleton width="100%" />
        ) : (
          value.totalProgres
        ),
      align: "center",
      padding: "checkbox",
      head: {
        align: "center",
      },
      sx: {
        whiteSpace: "noWrap",
        ...borderPlan,
        fontWeight: 700,
        fontSize: "16px",
        minWidth: "80px",
      },
    },
    {
      label: "Plan",
      value: (value) =>
        postLoading.some((v) => v === value.boqId) ? (
          <Skeleton width="100%" />
        ) : (
          value.planProgres
        ),
      align: "center",
      padding: "checkbox",
      head: {
        align: "center",
      },
      sx: {
        whiteSpace: "noWrap",
        fontWeight: 700,
        fontSize: "16px",
        minWidth: "80px",
      },
    },
    {
      label: "Tanggal Progres",
      sortKey: "updated_at",
      value: (value) => (
        <ListItemText
          sx={{ m: 0 }}
          primary={value.progresBy || "-"}
          primaryTypographyProps={{ variant: "body2" }}
          secondary={value.lastProgresAt || "-"}
          secondaryTypographyProps={{ variant: "body2" }}
        />
      ),
      align: "center",
      padding: "checkbox",
      head: {
        align: "center",
        sx: {
          whiteSpace: "nowrap",
        },
      },
      sx: {
        ...borderPlan,
      },
    },
    {
      label: "Tanggal Plan",
      value: (value) =>
        postLoading.some((v) => v === value.boqId) ? (
          <Skeleton width="100%" />
        ) : (
          <ListItemText
            sx={{ m: 0 }}
            secondary={`${value.planStart || ""} - ${value.planEnd || ""}`}
            primaryTypographyProps={{ variant: "body2" }}
            primary={value.planBy || "-"}
            secondaryTypographyProps={{ variant: "body2" }}
          />
        ),
      align: "center",
      head: {
        align: "center",
        sx: {
          whiteSpace: "nowrap",
        },
      },
      padding: "checkbox",
      sx: {
        whiteSpace: "noWrap",
        padding: 0.4,
        ...borderPlan,
      },
    },

    {
      value: (value) => (
        <Badge
          badgeContent={value.totalPending || 0}
          color="error"
          anchorOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
        >
          <BasicDropdown
            type="icon"
            size="small"
            menu={[
              {
                text: `${
                  value.totalPending > 0 ? `(${value.totalPending})` : ""
                } Menunggu Konfirmasi`,
                onClick: navigate,
                disabled: value.totalPending === 0,
                divider: true,
              },
              {
                text: "Riwayat",
                onClick: onHistory(value),
                divider: true,
              },
              { text: "Hapus", onClick: onDelete(value.id) },
            ]}
            label={<MoreVert fontSize="inherit" />}
          />
        </Badge>
      ),
      head: {
        padding: "checkbox",
      },
      align: "center",
      padding: "checkbox",
    },
  ];
};

export default () => {
  const alert = useAlert();
  const navigate = useNavigate();
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const [trigger, setTrigger] = React.useState({
    form: false,
    postLoading: [],
    currentId: 0,
    pboid: 0,
    history: false,
  });

  const table = FRHooks.useTable([apiRoute.project.listBoqs, { id }], {
    selector: (resp) => resp.data,
  });

  const boqs = FRHooks.useFetch([apiRoute.project.listBoqSearch, { id }], {
    selector: (resp) => resp.data,
    defaultValue: [],
    disabledOnDidMount: true,
  });

  const progres = FRHooks.useFetch([apiRoute.project.listProgress, { id }], {
    defaultValue: [],
    selector: (resp) => resp.data,
    total: (resp) => resp.data.meta.total,
  });

  const mutation = FRHooks.useMutation({
    defaultValue: { ...Dummy.projectBoq, projectId: +id },
    isNewRecord: (data) => data.id === 0,
    schema: (y) =>
      y.object().shape({
        projectId: y.number().nullable(),
        boqId: y.number().nullable(),
      }),
  });

  const boq = FRHooks.useMutation({
    defaultValue: { id: 0, unit: 0 },
    isNewRecord: (data) => data.id === 0,
    schema: (y) =>
      y.object().shape({
        id: y.number().nullable(),
        unit: y.number().nullable(),
      }),
  });

  const onOpen = () => {
    setTrigger((state) => ({ ...state, form: !state.form }));
    boqs.refresh();
    mutation.clearData();
    mutation.clearError();
  };

  const onHistory = (value) => () => {
    setTrigger((state) => ({ ...state, history: !state.history }));
    progres.setQuery({ pboid: value.id });
  };

  const onUpdate = (value) => () => {
    boq.clearError();
    if (value.id === trigger.currentId) {
      boq.clearData();
    } else {
      boq.setData({ id: value.id, unit: value.unit });
    }
    setTrigger((state) => {
      state.currentId = state.currentId === value.id ? 0 : value.id;
      return state;
    });
  };

  const onDelete = (id) => () => {
    alert.set({
      open: true,
      title: "Mohon Perhatian",
      message: "Anda akan menghapus BOQ ini dari daftar, apakah anda yakin?",
      type: "warning",
      loading: false,
      close: {
        text: "Keluar",
      },
      confirm: {
        text: "Ya, Saya Mengerti",
        onClick: () => {
          mutation.destroy(
            FRHooks.apiRoute().project("listBoqDetail", { id }).link(),
            {
              onBeforeSend: () => {
                alert.set({ loading: true });
              },
              onSuccess: () => {
                enqueueSnackbar("BOQ berhasil dihapus dari daftar");
                table.destroy((v) => v.id === id);
                alert.reset();
              },
              onAlways: () => {
                alert.set({ loading: false });
              },
            }
          );
        },
      },
    });
  };

  return (
    <ProjectTemplate
      title="BOQ"
      subtitle="Menampilkan daftar Item Pekerjaan (BOQ) dalam proyek"
      headRight={{
        children: (
          <>
            <Button disableElevation startIcon={<Add />} onClick={onOpen}>
              Tambah BOQ
            </Button>
            <LoadingButton
              loading={table.loading}
              disabled={table.loading}
              onClick={() => table.reload()}
              color="primary"
              startIcon={<Refresh />}
            >
              Muat Ulang
            </LoadingButton>
          </>
        ),
      }}
    >
      <Stack direction="row" spacing={1} mb={2} alignItems="center">
        <TextField
          placeholder="Cari"
          value={table.query("name", "")}
          onChange={(e) => table.setQuery({ name: e.target.value })}
          InputProps={{ startAdornment: <Search color="disabled" /> }}
          sx={{ width: "30%" }}
        />
      </Stack>

      <Grid container direction="row" spacing={1}>
        <Grid item xs={9}>
          <Paper variant="outlined">
            <DataTable
              tableProps={{ size: "small" }}
              data={table.data}
              loading={table.loading}
              column={columns(
                onDelete,
                onUpdate,
                onHistory,
                progres,
                boq,
                trigger.currentId,
                apiRoute.project.boqValue,
                trigger.postLoading,
                enqueueSnackbar,
                () => navigate(`/project/${id}/progres`)
              )}
              selected={(v) => v.id === +progres.getQuery("pboid")}
              order={table.order}
              orderBy={table.orderBy}
              onOrder={table.onOrder}
            />
          </Paper>
        </Grid>

        <Grid item xs={3}>
          <Paper variant="outlined">
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              m={1}
            >
              <Typography flexGrow={1}>Riwayat</Typography>
              <div>
                <IconButton size="small" onClick={() => progres.clear()}>
                  <RefreshOutlined fontSize="inherit" />
                </IconButton>
              </div>
            </Stack>

            <Divider />

            {progres.isEmpty ? (
              <Typography variant="body2" m={2}>
                Belum Ada Riwayat Pengerjaan
              </Typography>
            ) : null}

            <Box
              sx={{ height: "480px", maxHeight: "420px", overflow: "scroll" }}
            >
              <Timeline
                data={progres.data}
                value={(v, i) => {
                  return (
                    <>
                      <Typography variant="body2" fontWeight={600}>
                        {v.submitedName}
                      </Typography>
                      <Typography variant="body2">
                        {v.progres} {v.typeUnit} ({v.name})
                      </Typography>
                      <Typography variant="caption" fontStyle="italic">
                        {moment(v.createdAt).format("DD-MM-yyyy HH:mm:ss")}
                      </Typography>
                    </>
                  );
                }}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <FORM.BOQCreate
        trigger={trigger}
        table={boqs}
        list={table}
        mutation={mutation}
        route={FRHooks.apiRoute}
        onOpen={onOpen}
        setTrigger={setTrigger}
      />
    </ProjectTemplate>
  );
};
