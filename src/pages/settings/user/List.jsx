import React from "react";
import FRHooks from "frhooks";
import { ButtonGroup, Paper } from "@mui/material";
import { IconButton, Button } from "@components/base";
import { useSnackbar } from "notistack";
import SettingTemplate from "@components/templates/SettingTemplate";
import PersonAdd from "@mui/icons-material/PersonAdd";
import Edit from "@mui/icons-material/Edit";
import * as utils from "@utils/";
import * as FORM from "./Form";
import * as Dummy from "../../../constants/dummy";
import DataTable from "../../../components/base/table/DataTable";
import { LoadingButton } from "@mui/lab";
import { Refresh } from "@mui/icons-material";

const columns = (table, utils, onUpdate) => [
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

export default () => {
  const { enqueueSnackbar } = useSnackbar();
  const [trigger, setTrigger] = React.useState({
    form: false,
  });

  const table = FRHooks.useTable(FRHooks.apiRoute().user("index").link(), {
    selector: (resp) => resp.data,
    total: (resp) => resp.meta.total,
  });

  const mutation = FRHooks.useMutation({
    defaultValue: Dummy.user,
    isNewRecord: (data) => data.id === 0,
    schema: (y) =>
      y.object().shape({
        name: y.string().required().min(3),
        email: y.string().required().min(3),
        phoneNumber: y.string().required().min(10).max(12),
        role: y.string().required(),
      }),
  });

  const onOpen = () => {
    setTrigger((state) => ({ ...state, form: !state.form }));
    mutation.clearData();
    mutation.clearError();
  };

  const onUpdate = (id) => async () => {
    mutation.get(FRHooks.apiRoute().user("detail", { id }).link(), {
      onBeforeSend: () => {
        onOpen();
      },
      onSuccess: (resp) => {
        console.log(resp.data);
        mutation.setData({ ...resp.data, email: resp.data.user.email });
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
          data={table.data}
          loading={table.loading}
          column={columns(table, utils, onUpdate)}
          pagination={utils.pagination(table.pagination)}
        />
      </Paper>

      <FORM.UserForm
        open={trigger.form}
        mutation={mutation}
        snackbar={enqueueSnackbar}
        table={table}
        onOpen={onOpen}
      />
    </SettingTemplate>
  );
};
