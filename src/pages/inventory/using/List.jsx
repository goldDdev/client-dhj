import React from "react";
import FRHooks from "frhooks";
import moment from "moment";
import { useSnackbar } from "notistack";
import { Paper, Stack, Button, ButtonGroup } from "@mui/material";
import { ListAlt, Refresh } from "@mui/icons-material";
import MainTemplate from "@components/templates/MainTemplate";
import * as utils from "@utils/";
import * as FORM from "./Form";
import DataTable from "@components/base/table/DataTable";
import apiRoute from "@services/apiRoute";
import { LoadingButton } from "@mui/lab";
import { useAlert } from "@contexts/AlertContext";

const columns = (onDetail, onConfirm) => [
  {
    label: "Tangal",
    value: (value) =>
      `${moment(value.startDate).format("DD-MM-yyyy")} s/d ${moment(
        value.endDate
      ).format("DD-MM-yyyy")}`,
      sx:{
        whiteSpace: "nowrap"
      }
  },
  {
    label: "Proyek",
    value: (value) => value.projectName,
    sx:{
      whiteSpace: "nowrap"
    }
  },
  {
    label: "Jumlah",
    value: (value) => (
      <Button
        variant="text"
        size="small"
        onClick={onDetail(value.id)}
        endIcon={<ListAlt fontSize="inherit" />}
      >
        Lihat Item
      </Button>
    ),
    align: "center",
    head: {
      align: "center",
      sx: {
        width: "20%",
        whiteSpace: "nowrap",
      },
    },
    sx:{
      whiteSpace: "nowrap"
    }
  },
  {
    label: "Oleh",
    value: (value) => value.name,
    sx:{
      whiteSpace: "nowrap"
    }
  },
  {
    label: "Status",
    value: (value) => utils.ucword(value.status),
  },
  {
    label: "Aksi",
    value: (value) =>
      value.status === "PENDING" ? (
        <ButtonGroup>
          <Button
            variant="outlined"
            color="primary"
            size="small"
            disableElevation
            onClick={onConfirm(value.id, "REJECTED")}
          >
            Tolak
          </Button>
          <Button
            variant="contained"
            color="primary"
            size="small"
            disableElevation
            onClick={onConfirm(value.id, "APPROVED")}
          >
            Konfirmasi
          </Button>
        </ButtonGroup>
      ) : (
        "-"
      ),
  },
];

export default () => {
  const { enqueueSnackbar } = useSnackbar();
  const alert = useAlert();
  const [trigger, setTrigger] = React.useState({
    form: false,
    detail: false,
  });
  const [items, setItems] = React.useState([]);

  const table = FRHooks.useTable(apiRoute.inventoryUsing.index, {
    selector: (resp) => resp.data,
    total: (resp) => resp.meta.total,
  });

  const mutation = FRHooks.useMutation({
    defaultValue: {
      id: 0,
      status: "PENDING",
    },
    isNewRecord: (data) => data.id === 0,
  });

  const onOpen = () => {
    setTrigger((state) => ({ ...state, form: !state.form }));
    mutation.clearData();
    mutation.clearError();
  };

  const onDetail = (id) => () => {
    mutation.get([apiRoute.inventoryUsing.detail, { id }], {
      onBeforeSend: () => {
        setTrigger((state) => ({ ...state, detail: true }));
      },
      onSuccess: (resp) => {
        setItems(resp.data.items);
      },
    });
  };

  const onConfirm = (id, status) => () => {
    alert.set({
      open: true,
      title: "Mohon Perhatian",
      message: `Anda akan mengambil aksi "${
        status === "REJECTED" ? "Tolak" : "Konfirmasi"
      }" untuk data ini, apakah anda yakin?`,
      type: "warning",
      loading: false,
      close: {
        text: "Keluar",
      },
      confirm: {
        text: "Ya, Saya Mengerti",
        onClick: () => {
          mutation.put(apiRoute.inventoryUsing.status, {
            options: { data: { id, status } },
            onBeforeSend: () => {
              alert.set({ loading: true });
            },
            onSuccess: () => {
              table.reload();
              alert.set({ loading: false, open: false });
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
      title="Permintaan Penggunaan Inventori"
      subtitle={`Daftar penggunaan inventori dalam proyek`}
      headRight={{
        children: (
          <LoadingButton
            variant="outlined"
            loading={table.loading}
            disabled={table.loading}
            onClick={table.reload}
            color="primary"
            startIcon={<Refresh />}
          >
            Muat Ulang
          </LoadingButton>
        ),
      }}
    >
      <Stack
        direction="row"
        sx={{ mt: { xs: 2 }, mb: 2 }}
        spacing={1}
        alignItems="center"
        overflow={{
          xs: "scroll",
          sm: "scroll",
          md: "scroll",
          lg: "unset",
          xl: "unset",
        }}
      >
        <div>
          <Button
            disableElevation
            variant={!table.query("status") ? "contained" : "outlined"}
            color={!table.query("status") ? "primary" : "inherit"}
            startIcon={<ListAlt />}
            onClick={() => table.setQuery({ status: "" })}
            sx={{whiteSpace: "nowrap"}}
          >
            Semua Status
          </Button>
        </div>
        <div>
          <Button
            disableElevation
            variant={
              table.query("status") == "PENDING" ? "contained" : "outlined"
            }
            color={table.query("status") == "PENDING" ? "primary" : "inherit"}
            startIcon={<ListAlt />}
            onClick={() => table.setQuery({ status: "PENDING" })}
          >
            Pending
          </Button>
        </div>
        <div>
          <Button
            disableElevation
            variant={
              table.query("status") == "APPROVED" ? "contained" : "outlined"
            }
            color={table.query("status") == "APPROVED" ? "primary" : "inherit"}
            startIcon={<ListAlt />}
            onClick={() => table.setQuery({ status: "APPROVED" })}
          >
            Selesai
          </Button>
        </div>
        <div>
          <Button
            disableElevation
            variant={
              table.query("status") == "REJECTED" ? "contained" : "outlined"
            }
            color={table.query("status") == "REJECTED" ? "primary" : "inherit"}
            startIcon={<ListAlt />}
            onClick={() => table.setQuery({ status: "REJECTED" })}
          >
            Ditolak
          </Button>
        </div>
      </Stack>

      <Paper elevation={0} variant="outlined">
        <DataTable
          data={table.data}
          loading={table.loading}
          column={columns(onDetail, onConfirm)}
          pagination={utils.pagination(table.pagination)}
        />
      </Paper>

      <FORM.InventoryForm
        open={trigger.form}
        mutation={mutation}
        onOpen={onOpen}
      />

      <FORM.InventoryItem
        open={trigger.detail}
        items={items}
        loading={mutation.loading}
        onOpen={() => {
          setTrigger((state) => ({ ...state, detail: false }));
          setItems([]);
        }}
      />
    </MainTemplate>
  );
};
