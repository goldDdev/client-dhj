import React from "react";
import FRHooks from "frhooks";
import DataTable from"@components/base/table/DataTable";
import ProjectTemplate from "@components/templates/ProjectTemplate";
import moment from "moment";
import apiRoute from "@services/apiRoute";
import * as BASE from "@components/base";
import { UpdateOvertime } from "./form";
import { LoadingButton } from "@mui/lab";
import { Stack, TextField, Paper, ListItemText } from "@mui/material";
import { BasicDropdown, Select } from "@components/base";
import { useSnackbar } from "notistack";
import { useParams } from "react-router-dom";
import { MoreVert, Search, Refresh } from "@mui/icons-material";
import { useAlert } from "@contexts/AlertContext";
import {
  formatCurrency,
  listYear,
  overtimeStatus,
  overtimeStatusLabel,
  typesLabel,
} from "@utils/index";

const columns = (onDelete, onAction, onUpdate) => [
  {
    label: "No",
    value: (_, idx) => {
      return idx + 1;
    },
    head: {
      align: "center",
      padding: "checkbox",
    },
    align: "center",
    size: "small",
  },
  {
    label: "Nama",
    value: (value) => (
      <ListItemText
        primary={value.employeeName}
        primaryTypographyProps={{ variant: "body2" }}
        secondaryTypographyProps={{ variant: "body2" }}
        secondary={typesLabel(value.employeeRole)}
      />
    ),
    size: "small",
    sx: {
      whiteSpace: "nowrap",
    },
  },

  {
    label: "Tanggal",
    value: (value) => moment(value.absentAt).format("DD-MM-yyyy"),
    align: "center",
    head: {
      align: "center",
    },
    sx: {
      whiteSpace: "nowrap",
    },
    size: "small",
  },
  {
    label: "Pekerja",
    value: (value) => value.totalWorker,
    align: "center",
    head: {
      align: "center",
    },
    sx: {
      whiteSpace: "nowrap",
      fontSize: "16px",
    },
    size: "small",
  },
  {
    label: "Durasi",
    value: (value) => `${value.overtimeDuration / 60} Jam`,
    align: "center",
    head: {
      align: "center",
    },
    size: "small",
  },
  {
    label: "Biaya",
    value: (value) => (
      <ListItemText
        primary={formatCurrency(value.totalEarn)}
        primaryTypographyProps={{ variant: "body2" }}
      />
    ),
    align: "center",
    head: {
      align: "center",
    },
    sx: {
      whiteSpace: "nowrap",
    },
    size: "small",
  },
  {
    label: "Status SPV",
    value: (value) => <strong>{overtimeStatusLabel(value.status)}</strong>,
    align: "center",
    head: {
      align: "center",
      sx: { whiteSpace: "nowrap" },
    },
    size: "small",
  },
  {
    label: "Status",
    value: (value) => (
      <strong>{overtimeStatusLabel(value.confirmStatus)}</strong>
    ),
    align: "center",
    head: {
      align: "center",
      sx: { whiteSpace: "nowrap" },
    },
    size: "small",
  },
  {
    label: "Diajukan Oleh",
    value: (value) => (
      <ListItemText
        primary={value.requestName}
        primaryTypographyProps={{ variant: "body2" }}
        secondaryTypographyProps={{ variant: "body2" }}
        secondary={typesLabel(value.requestRole)}
      />
    ),
    size: "small",
    sx: {
      whiteSpace: "nowrap",
    },
  },
  {
    label: "Disetujui SPV",
    value: (value) =>
      value.actionEmployee ? (
        <ListItemText
          primary={value.actionEmployee?.name || "-"}
          primaryTypographyProps={{ variant: "body2" }}
          secondaryTypographyProps={{ variant: "body2" }}
          secondary={value.actionEmployee?.role || "-"}
        />
      ) : (
        "Belum Ada Aksi"
      ),
    align: "center",
    head: {
      align: "center",
      sx: { whiteSpace: "nowrap" },
    },
    size: "small",
    sx: {
      whiteSpace: "nowrap",
    },
  },
  {
    label: "Disetujui Oleh",
    value: (value) =>
      value.actionEmployee ? (
        <ListItemText
          primary={value.confirmEmployee?.name || "-"}
          primaryTypographyProps={{ variant: "body2" }}
          secondaryTypographyProps={{ variant: "body2" }}
          secondary={value.confirmEmployee?.role || "-"}
        />
      ) : (
        "Belum Ada Aksi"
      ),
    align: "center",
    head: {
      align: "center",
      sx: { whiteSpace: "nowrap" },
    },
    size: "small",
    sx: {
      whiteSpace: "nowrap",
    },
  },
  {
    value: (value) => {
      const menu = [];

      if (value.confirmStatus === "PENDING") {
        menu.push({
          text: "Hapus",
          onClick: onDelete(value.id),
          id: "DELETE",
          divider: true,
        });

        menu.push({
          text: "Ubah",
          onClick: onUpdate(value.id),
          id: "UPDATE",
          divider: true,
        });
        menu.push({
          text: "Setujui",
          onClick: onAction(value.id, "CONFIRM"),
          id: "CONFIRM",
          divider: true,
        });
        menu.push({
          text: "Tolak",
          onClick: onAction(value.id, "REJECT"),
          id: "REJECT",
        });
      }

      return (
        <BasicDropdown
          disabled={
            value.status === "PENDING" && value.confirmStatus !== "PENDING"
          }
          type="icon"
          menu={menu}
          size="small"
          label={<MoreVert fontSize="inherit" />}
        />
      );
    },
    head: {
      align: "center",
      padding: "checkbox",
    },
    padding: "checkbox",
    align: "center",
    size: "small",
  },
];

export default () => {
  const { id } = useParams();
  const alert = useAlert();
  const { enqueueSnackbar } = useSnackbar();
  const [trigger, setTrigger] = React.useState({
    open: false,
    current: {
      id: 0,
      employeeId: 0,
      projectId: 0,
      type: "TEAM",
    },
  });

  const mutation = FRHooks.useMutation({
    defaultValue: { id: 0, duration: 60 },
  });

  const table = FRHooks.useTable([apiRoute.project.listOvertimes, { id }], {
    total: (resp) => resp.meta.total,
    selector: (resp) => resp.data,
  });

  const onDelete = (id) => async () => {
    alert.set({
      open: true,
      title: "Mohon Perhatian",
      message: "Anda akan menghapus permintaan lembur, apakah anda yakin?",
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
              .project("overtimeDetail", { id })
              .destroy();

            enqueueSnackbar("Permintaan lembur berhasil dihapus dari daftar", {
              variant: "success",
            });
            table.destroy((v) => v.id === id);
          } catch (err) {
          } finally {
            alert.reset();
          }
        },
      },
    });
  };

  const onAction = (id, status) => async () => {
    alert.set({
      open: true,
      title: "Mohon Perhatian",
      message: `Anda akan ${
        status === "CONFIRM" ? "menyetujui" : "menolak"
      } permintaan lembur apakah anda yakin?`,
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
            const data = await FRHooks.apiRoute()
              .project("overtimeStatus")
              .data({ id, status })
              .sendJson("put", (resp) => resp.data);
            enqueueSnackbar(
              `Permintaan lembur berhasil ${
                status === "CONFIRM" ? "Disetujui" : "Ditolak"
              }`,
              {
                variant: "success",
              }
            );
            table.reload();
          } catch (err) {
          } finally {
            alert.reset();
          }
        },
      },
    });
  };

  const onUpdate = (id) => async () => {
    setTrigger((state) => ({ ...state, open: true }));
    mutation.get([apiRoute.project.overtime, { id }], {
      onSuccess: ({ data }) => {
        setTrigger((state) => ({ ...state, current: data }));
        mutation.setData({ id, duration: data.overtimeDuration || 0 });
      },
    });
  };

  const onSubmit = () => {
    mutation.put(apiRoute.project.updateOvertime, {
      onSuccess: () => {
        table.reload();
        enqueueSnackbar("Permintaan Lembur Berhasil diubah");
      },
      onAlways: () => {
        setTrigger((state) => ({ ...state, open: false }));
      },
    });
  };

  return (
    <ProjectTemplate
      title="Daftar Lembur"
      subtitle="Menampilkan daftar permintaan lembur"
      headRight={{
        children: (
          <LoadingButton
            loading={table.loading}
            disabled={table.loading}
            onClick={() => table.reload()}
            color="primary"
            variant="outlined"
            startIcon={<Refresh />}
          >
            Muat Ulang
          </LoadingButton>
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
        mb={2}
      >
        {/* <TextField
          placeholder="Cari"
          value={table.query("name", "")}
          onChange={(e) => table.setQuery({ name: e.target.value })}
          InputProps={{ startAdornment: <Search color="disabled" /> }}
        /> */}
        <TextField
          label="Tanggal"
          type="date"
          value={table.query("absentAt", "")}
          onChange={(e) => table.setQuery({ absentAt: e.target.value })}
          InputLabelProps={{ shrink: true }}
        />
        <BASE.Select
          label="Bulan"
          value={table.query("month", moment().month() + 1)}
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
          value={table.query("year", moment().year())}
          menu={listYear().map((v) => ({ text: v, value: v }))}
          onChange={(e) => {
            table.setQuery({ year: +e.target.value });
          }}
        />
        <Select
          label="Status SPV"
          menu={[
            { text: "Pilih", divider: true, value: "00" },
            ...Object.keys(overtimeStatus).map((v) => ({
              text: overtimeStatusLabel(v),
              value: v,
            })),
          ]}
          sx={{
            "& .MuiOutlinedInput-root": {
              paddingLeft: 0.8,
            },
          }}
          value={table.query("status", "00")}
          onChange={(e) => {
            table.setQuery({
              status: e.target.value === "00" ? "" : e.target.value,
            });
          }}
        />

        <Select
          label="Status"
          menu={[
            { text: "Pilih", divider: true, value: "00" },
            ...Object.keys(overtimeStatus).map((v) => ({
              text: overtimeStatusLabel(v),
              value: v,
            })),
          ]}
          sx={{
            "& .MuiOutlinedInput-root": {
              paddingLeft: 0.8,
            },
          }}
          value={table.query("approval", "00")}
          onChange={(e) => {
            table.setQuery({
              approval: e.target.value === "00" ? "" : e.target.value,
            });
          }}
        />
      </Stack>

      <Paper elevation={0} variant="outlined">
        <DataTable
          tableProps={{ size: "small" }}
          data={table.data}
          loading={table.loading}
          column={columns(onDelete, onAction, onUpdate)}
          row={{ sx: { backgroundColor: "white" } }}
        />
      </Paper>

      <UpdateOvertime
        open={trigger.open}
        onOpen={() => setTrigger((state) => ({ ...state, open: !state.open }))}
        mutation={mutation}
        data={trigger.current}
        onSubmit={onSubmit}
      />
    </ProjectTemplate>
  );
};
