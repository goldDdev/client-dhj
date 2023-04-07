import React, { useEffect } from "react";
import FRHooks from "frhooks";
import { useSnackbar } from "notistack";
import { Paper, Stack } from "@mui/material";
import { Add, ListAlt, MoreVert } from "@mui/icons-material";
import MainTemplate from "@components/templates/MainTemplate";
import * as utils from "@utils/";
import { useAlert } from "@contexts/AlertContext";
import apiRoute from "@services/apiRoute";
import { Button, BasicDropdown } from "@components/base";
import * as FORM from "./Form";
import * as Dummy from "../../../constants/dummy";
import DataTable from "../../../components/base/table/DataTable";

const columns = (onUpdate, onDelete) => [
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
]

export default () => {
  const { t, r } = FRHooks.useLang();
  const alert = useAlert();
  const { enqueueSnackbar } = useSnackbar();
  const [trigger, setTrigger] = React.useState({
    form: false,
  });

  const table = FRHooks.useTable(FRHooks.apiRoute().inventory("index").link(), {
    selector: (resp) => resp.data,
    total: (resp) => resp.meta.total,
    disabledOnDidMount: true,
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
    mutation.setData({ type: table.query("type") })
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
      message:
        "Anda akan menghapus item ini dari daftar, apakah anda yakin?",
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
    table.setQuery({ type: 'MATERIAL' });
  }, [])

  return (
    <MainTemplate
      title="Master Data Inventori"
      subtitle={`Daftar semua master data Material & Equipment`}
      headRight={{
        children: (
          <Button startIcon={<Add />} onClick={onOpen}>
            Tambah Data Inventori
          </Button>
        ),
      }}
    >
      <Stack
        direction="row"
        sx={{ mt: { xs: 2 }, mb: 2 }}
        spacing={1}
        alignItems="center"
      >
        <div>
          <Button
            disableElevation
            variant={table.query("type") == 'MATERIAL' ? "contained" : "outlined"}
            color={table.query("type") == 'MATERIAL' ? "primary" : "inherit"}
            startIcon={<ListAlt />}
            onClick={() => table.setQuery({ type: 'MATERIAL' })}
          >
            Material
          </Button>
        </div>
        <div>
          <Button
            disableElevation
            variant={table.query("type") == 'EQUIPMENT' ? "contained" : "outlined"}
            color={table.query("type") == 'EQUIPMENT' ? "primary" : "inherit"}
            startIcon={<ListAlt />}
            onClick={() => table.setQuery({ type: 'EQUIPMENT'})}
          >
            Equipment
          </Button>
        </div>
      </Stack>

      <Paper elevation={0} variant="outlined">
        <DataTable
          data={table.data}
          loading={table.loading}
          column={columns(onUpdate, onDelete)}
          pagination={utils.pagination(table.pagination)}
        />
      </Paper>

      <FORM.InventoryForm
        open={trigger.form}
        t={t}
        r={r}
        mutation={mutation}
        snackbar={enqueueSnackbar}
        table={table}
        onOpen={onOpen}
      />
    </MainTemplate >
  );
};
