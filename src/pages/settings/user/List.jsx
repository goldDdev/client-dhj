import React from "react";
import FRHooks from "frhooks";
import { Chip, Paper } from "@mui/material";
import { IconButton, Button } from "@components/base";
import { useSnackbar } from "notistack";
import SettingTemplate from "@components/templates/SettingTemplate";
import PersonAdd from "@mui/icons-material/PersonAdd";
import Edit from "@mui/icons-material/Edit";
import * as utils from "@utils/";
// import * as Filter from "./filter";
import * as FORM from "./Form";
import * as Dummy from "../../../constants/dummy";
import DataTable from "../../../components/base/table/DataTable";

const columns = (table, t, utils, onUpdate) => [
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
    label: t("name"),
    value: (value) => value.name,
  },
  {
    label: 'Email',
    value: (value) => value.email,
  },
  {
    label: t("phoneNumber"),
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
    label: t("role"),
    value: (value) => t(value.role) || "-",
    align: "center",
    head: {
      align: "center",
      sx: {
        width: "10%",
      },
    },
  },
  {
    label: "",
    value: (value) => (
      <IconButton title={t("edit")} size="small" onClick={onUpdate(value.id)}>
        <Edit fontSize="small" />
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
  const { t, r } = FRHooks.useLang();
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
      title={t("user")}
      subtitle={`Daftar semua data ${t("user")}`}
      headRight={{
        children: (
          <Button startIcon={<PersonAdd />} onClick={onOpen}>
            {t(["add", "user"])}
          </Button>
        ),
      }}
    >
      {/* <Filter.TableFilter t={t} table={table} /> */}

      <Paper elevation={0} variant="outlined">
        <DataTable
          data={table.data}
          loading={table.loading}
          column={columns(table, t, utils, onUpdate)}
          pagination={utils.pagination(table.pagination)}
        />
      </Paper>

      <FORM.UserForm
        open={trigger.form}
        t={t}
        r={r}
        mutation={mutation}
        snackbar={enqueueSnackbar}
        table={table}
        onOpen={onOpen}
      />
    </SettingTemplate>
  );
};
