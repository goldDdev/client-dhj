import React, { useEffect } from "react";
import FRHooks from "frhooks";
import { useSnackbar } from "notistack";
import { ButtonGroup, Paper, Stack, TextField } from "@mui/material";
import { Add, MoreVert, Refresh, Search } from "@mui/icons-material";
import { Button, BasicDropdown } from "@components/base";
import { useAlert } from "@contexts/AlertContext";
import MainTemplate from "@components/templates/MainTemplate";
import apiRoute from "@services/apiRoute";
import * as Dummy from "../../../constants/dummy";
import * as utils from "@utils/";
import DataTable from "../../../components/base/table/DataTable";
import InventoryForm from "./InventoryForm";

const columns = (onUpdate, onDelete, from) => [
  {
    label: "No",
    value: ({}, i) => from + i,
    head: {
      align: "center",
      padding: "checkbox",
    },
  },
  {
    label: "Nama",
    value: (value) => value.name,
  },
  {
    label: "Satuan",
    value: (value) => value.unit,
    align: "center",
    head: {
      align: "center",
      sx: {
        width: "20%",
        whiteSpace: "nowrap",
      },
    },
  },
  {
    label: "Jumlah",
    value: (value) => value.qty,
    align: "center",
    head: {
      align: "center",
      sx: {
        width: "20%",
        whiteSpace: "nowrap",
      },
    },
  },
  {
    label: "",
    value: (value) => (
      <BasicDropdown
        type="icon"
        size="small"
        label={<MoreVert fontSize="inherit" />}
        menu={[
          { text: "Ubah", onClick: onUpdate(value.id), divider: true },
          { text: "Hapus", onClick: onDelete(value.id) },
        ]}
      />
    ),
    align: "center",
    head: {
      align: "center",
      padding: "checkbox",
    },
  },
];

export default () => {
  const alert = useAlert();
  const { enqueueSnackbar } = useSnackbar();
  const [trigger, setTrigger] = React.useState({
    form: false,
  });

  const table = FRHooks.useTable(apiRoute.inventory.index, {
    selector: (resp) => resp.data,
    total: (resp) => resp.meta.total,
  });

  const mutation = FRHooks.useMutation({
    defaultValue: Dummy.inventory,
    isNewRecord: (data) => data.id === 0,
    schema: (y) =>
      y.object().shape({
        name: y.string().required(),
        unit: y.string().required(),
        qty: y.number().required().min(0),
        minQty: y.number().required().min(0),
      }),
  });

  const onOpen = () => {
    setTrigger((state) => ({ ...state, form: !state.form }));
    mutation.clearData();
    mutation.clearError();
    mutation.setData({ type: table.query("type") });
  };

  const onUpdate = (id) => async () => {
    mutation.get(FRHooks.apiRoute().inventory("detail", { id }).link(), {
      onBeforeSend: () => {
        onOpen();
      },
      onSuccess: (resp) => {
        mutation.setData(resp.data);
      },
    });
  };

  const onDelete = (id) => () => {
    alert.set({
      open: true,
      title: "Mohon Perhatian",
      message: "Anda akan menghapus item ini dari daftar, apakah anda yakin?",
      type: "warning",
      loading: false,
      close: {
        text: "Keluar",
      },
      confirm: {
        text: "Ya, Saya Mengerti",
        onClick: () => {
          mutation.destroy([apiRoute.inventory.detail, { id }], {
            onBeforeSend: () => {
              alert.set({ loading: true });
            },
            onSuccess: () => {
              enqueueSnackbar("Item berhasil dihapus dari daftar", {
                variant: "success",
              });
              table.destroy((v) => v.id === id);
              alert.reset();
            },
            onAlways: () => {
              alert.set({ loading: false });
            },
          });
        },
      },
    });
  };

  useEffect(() => {
    table.setQuery({ type: "MATERIAL" });
  }, []);

  return (
    <MainTemplate
      title="Master Data Inventori"
      subtitle={`Daftar semua master data Material & Equipment`}
      headRight={{
        children: (
          <ButtonGroup>
            <Button
              disabled={table.loading}
              variant="contained"
              startIcon={<Add />}
              onClick={onOpen}
            >
              Tambah Data Inventori
            </Button>
            <Button
              disabled={table.loading}
              startIcon={<Refresh />}
              onClick={table.reload}
            >
              Muat Ulang
            </Button>
          </ButtonGroup>
        ),
      }}
    >
      <Stack direction={"row"} my={2}>
        <TextField
          placeholder="Cari disini"
          value={table.query("name", "")}
          onChange={(e) => table.setQuery({ name: e.target.valueF })}
          InputProps={{ endAdornment: <Search color="disabled" /> }}
          sx={{ width: "50%" }}
        />
      </Stack>

      <Paper elevation={0} variant="outlined">
        <DataTable
          tableProps={{
            sx: {
              "& th": {
                backgroundColor: "#f4f4f4",
              },
            },
          }}
          data={table.data}
          loading={table.loading}
          column={columns(onUpdate, onDelete, table.pagination.from)}
          pagination={utils.pagination(table.pagination)}
        />
      </Paper>

      <InventoryForm
        open={trigger.form}
        mutation={mutation}
        snackbar={enqueueSnackbar}
        table={table}
        onOpen={onOpen}
      />
    </MainTemplate>
  );
};
