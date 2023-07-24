import React from "react";
import FRHooks, { useServerValidation } from "frhooks";
import { ButtonGroup, Paper } from "@mui/material";
import { IconButton, Button } from "@components/base";
import { useSnackbar } from "notistack";
import SettingTemplate from "@components/templates/SettingTemplate";
import PersonAdd from "@mui/icons-material/PersonAdd";
import Edit from "@mui/icons-material/Edit";
import * as utils from "@utils/";
import * as Dummy from "@constants/dummy";
import DataTable from "../../../components/base/table/DataTable";
import { LoadingButton } from "@mui/lab";
import { Refresh } from "@mui/icons-material";
import apiRoute from "@services/apiRoute";
import UserCreate from "./UserCreate";
import { useAlert } from "@contexts/AlertContext";

const columns = (table, utils, onUpdate, onReset) => [
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
  },
  {
    label: "Email",
    value: (value) => value.email,
  },
  {
    label: "NO HP",
    value: (value) => utils.ccFormat(value.phoneNumber) || "-",
    align: "center",
    head: {
      align: "center",
      sx: {
        width: "10%",
      },
    },
    sx: {
      whiteSpace: "nowrap",
    },
  },
  {
    label: "Role",
    value: (value) => utils.typesLabel(value.role),
    align: "center",
    head: {
      align: "center",
      sx: {
        width: "15%",
      },
    },
  },
  {
    label: "Reset Kata Sandi",
    value: (value) => (
      <Button size="small" variant="text" onClick={onReset(value.id)}>
        Reset
      </Button>
    ),
    align: "center",
    head: {
      align: "center",
      sx: {
        width: "15%",
      },
    },
  },
  {
    label: "",
    value: (value) => (
      <IconButton title={"Ubah"} size="small" onClick={onUpdate(value.id)}>
        <Edit fontSize="inherit" />
      </IconButton>
    ),
    align: "center",
    head: {
      align: "center",
      padding: "checkbox",
    },
  },
];

const List = () => {
  const alert = useAlert();
  const { enqueueSnackbar } = useSnackbar();
  const [trigger, setTrigger] = React.useState({
    form: false,
  });

  const table = FRHooks.useTable(apiRoute.user.index, {
    selector: (resp) => resp.data,
    total: (resp) => resp.meta.total,
  });

  const mutation = FRHooks.useMutation({
    defaultValue: Dummy.user,
    isNewRecord: (data) => data.id === 0,
    schema: (y) =>
      y.object().shape({
        name: y.string().required().min(3).label("Nama"),
        email: y.string().required().min(3).label("Email"),
        phoneNumber: y
          .string()
          .required()
          .min(10)
          .max(12)
          .label("No Handphone"),
        role: y.string().required().label("Role"),
      }),
  });

  const server = useServerValidation({
    field: {
      phoneNumber: {
        url: apiRoute.user.validation,
        method: "post",
        selector: (resp) => {
          return resp.data.phoneNumber || "";
        },
      },

      email: {
        url: apiRoute.user.validation,
        method: "post",
        selector: (resp) => {
          return resp.data.email || "";
        },
      },
    },
    callback: (err) => mutation.setError(err),
  });

  const onOpen = () => {
    setTrigger((state) => ({ ...state, form: !state.form }));
    mutation.clearData();
    mutation.clearError();
  };

  const onUpdate = (id) => async () => {
    mutation.get([apiRoute.user.detail, { id }], {
      onBeforeSend: () => {
        onOpen();
      },
      onSuccess: (resp) => {
        mutation.setData({ ...resp.data, email: resp.data.user.email });
      },
    });
  };

  const onReset = (id) => async () => {
    mutation.get([apiRoute.user.detail, { id }], {
      onSuccess: (resp) => {
        alert.set({
          open: true,
          title: "Reset Kata Sandi",
          message:
            "Apakah yakin ingin mereset kata sandi? kata sandi akan menjadi no HP",
          type: "warning",
          confirm: {
            text: "Ya, saya mengerti",
            onClick: () => {
              mutation.put([apiRoute.user.detail, { id }], {
                options: {
                  data: {
                    ...resp.data,
                    email: resp.data.user.email,
                    password: resp.data.phoneNumber,
                  },
                },
                onSuccess: (resp) => {
                  enqueueSnackbar("Kata sandi berhasil dipulihkan");
                  mutation.clearData();
                  mutation.clearError();
                  alert.reset();
                },
              });
            },
          },
        });
      },
    });
  };

  return (
    <SettingTemplate
      title={"Pengguna"}
      subtitle={`Daftar semua data pengguna`}
      headRight={{
        children: (
          <ButtonGroup>
            <Button
              variant="contained"
              disableElevation
              startIcon={<PersonAdd />}
              onClick={onOpen}
              disabled={table.loading}
            >
              Tambah Pengguna
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
          column={columns(table, utils, onUpdate, onReset)}
          pagination={utils.pagination(table.pagination)}
        />
      </Paper>

      <UserCreate
        open={trigger.form}
        mutation={mutation}
        server={server}
        snackbar={enqueueSnackbar}
        table={table}
        onOpen={onOpen}
      />
    </SettingTemplate>
  );
};

export default List;
