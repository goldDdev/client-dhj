import React from "react";
import FRHooks from "frhooks";
import SettingTemplate from "@components/templates/SettingTemplate";
import PersonAdd from "@mui/icons-material/PersonAdd";
import * as utils from "@utils/";
import Create from "./form/Create";
import * as Dummy from "@constants/dummy";
import DataTable from "@components/base/table/DataTable";
import apiRoute from "@services/apiRoute";
import { MoreVert, Refresh, Search } from "@mui/icons-material";
import { useAlert } from "@contexts/AlertContext";
import { ButtonGroup, Paper, Stack, TextField } from "@mui/material";
import { Button, BasicDropdown } from "@components/base";
import { useSnackbar } from "notistack";
import { LoadingButton } from "@mui/lab";

const columns = (table, onUpdate, onDelete) => [
  {
    label: "No",
    value: (_, idx) => {
      return table.pagination.from + idx;
    },
    head: {
      align: "center",
      padding: "checkbox",
    },
    align: "center",
    padding: "checkbox",
    size: "small",
  },

  {
    label: "Nama",
    value: (value) => value.name,
    sx: {
      whiteSpace: "nowrap",
    },
  },

  {
    label: "Latitude",
    value: (value) => value.latitude,
    align: "right",
    head: {
      align: "right",
    },
    sx: {
      whiteSpace: "nowrap",
    },
  },

  {
    label: "Longitude",
    value: (value) => value.longitude,
    align: "right",
    head: {
      align: "right",
    },
    sx: {
      whiteSpace: "nowrap",
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

  const table = FRHooks.useTable(apiRoute.centerLocation.index, {
    selector: (resp) => resp.data,
    total: (resp) => resp.meta.total,
  });

  const mutation = FRHooks.useMutation({
    defaultValue: Dummy.employee,
    isNewRecord: (data) => data.id === 0,
    schema: (y) =>
      y.object().shape({
        name: y.string().required().min(3),
        description: y.string().nullable(),
        latitude: y.number().nullable(),
        longitude: y.number().nullable(),
      }),
  });

  const onOpen = () => {
    setTrigger((state) => ({ ...state, form: !state.form }));
    mutation.clearData();
    mutation.clearError();
  };

  const onUpdate = (id) => () => {
    mutation.get([apiRoute.centerLocation.detail, { id }], {
      onBeforeSend: () => {
        setTrigger((state) => ({ ...state, form: !state.form }));
        mutation.clearData();
      },
      onSuccess: (resp) => {
        mutation.setData({ ...resp.data, email: resp.data.user?.email || "" });
      },
    });
  };

  const onDelete = (id) => () => {
    alert.set({
      open: true,
      title: "Mohon Perhatian",
      message:
        "Anda akan menghapus lokasi pusat ini dari daftar, apakah anda yakin?",
      type: "warning",
      loading: false,
      close: {
        text: "Keluar",
      },
      confirm: {
        text: "Ya, Saya Mengerti",
        onClick: () => {
          mutation.destroy([apiRoute.centerLocation.detail, { id }], {
            onBeforeSend: () => {
              alert.set({ loading: true });
            },
            onSuccess: () => {
              enqueueSnackbar("Center Lokasi berhasil dihapus dari daftar");
              table.reload();
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

  const onSubmit = () => {
    mutation.post(apiRoute.centerLocation.index, {
      except: mutation.isNewRecord ? ["id"] : [],
      method: mutation.isNewRecord ? "post" : "put",
      validation: true,
      onSuccess: ({ data }) => {
        enqueueSnackbar("Center Lokasi baru berhasil disimpan");
        table.reload();
        mutation.clearData();
        mutation.clearError();
        onOpen();
      },
    });
  };

  return (
    <SettingTemplate
      title={"Lokasi Pusat"}
      subtitle={"Daftar semua lokasi yang didaftarkan"}
      headRight={{
        children: (
          <ButtonGroup>
            <Button
              variant="contained"
              disableElevation
              startIcon={<PersonAdd />}
              onClick={onOpen}
            >
              Tambah Center Lokasi
            </Button>
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
          </ButtonGroup>
        ),
      }}
    >
      <Stack mb={2} direction="column" spacing={1}>
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
        >
          <TextField
            fullWidth
            value={table.query("name", "")}
            placeholder="Cari lokasi"
            onChange={(e) => table.setQuery({ name: e.target.value })}
            InputProps={{
              endAdornment: <Search color="disabled" />,
            }}
            sx={{ width: "50%" }}
          />
        </Stack>
      </Stack>

      <Paper elevation={0} variant="outlined">
        <DataTable
          tableProps={{
            size: "small",
            sx: {
              "& thead th": {
                backgroundColor: "#f4f4f4",
              },
            },
          }}
          data={table.data}
          loading={table.loading}
          column={columns(table, onUpdate, onDelete)}
          pagination={utils.pagination(table.pagination)}
        />
      </Paper>

      <Create
        open={trigger.form}
        mutation={mutation}
        onSubmit={onSubmit}
        onOpen={onOpen}
      />
    </SettingTemplate>
  );
};
