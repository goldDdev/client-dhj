import React from "react";
import FRHooks from "frhooks";
import { Chip, Paper } from "@mui/material";
import { IconButton, Button } from "@components/base";
import { useSnackbar } from "notistack";
import SettingTemplate from "@components/templates/SettingTemplate";
import PersonAdd from "@mui/icons-material/PersonAdd";
import Edit from "@mui/icons-material/Edit";
import * as utils from "@utils/";
import * as Filter from "./filter";
import * as FORM from "./form";
import * as Dummy from "../../constants/dummy";
import DataTable from "../../components/base/table/DataTable";

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
    label: "ID",
    value: (value, idx) => {
      return value.cardID;
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
    label: t("status"),
    value: (value) => (
      <Chip
        label={t(value.status)}
        color={!value.invoiceAt ? "success" : "default"}
        size="small"
        variant="outlined"
      />
    ),
    align: "center",
    head: {
      align: "center",
      sx: {
        width: "10%",
      },
    },
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

  const table = FRHooks.useTable(FRHooks.apiRoute().employee("index").link(), {
    selector: (resp) => resp.data,
    total: (resp) => resp.meta.total,
  });

  const mutation = FRHooks.useMutation({
    defaultValue: Dummy.employee,
    isNewRecord: (data) => data.id === 0,
    schema: (y) =>
      y.object().shape({
        name: y.string().required().min(3),
        cardID: y.string().required(),
        phoneNumber: y.string().required().max(12),
      }),
      format: {
        phoneNumber: (value) => String(value) 
      }
  });

  const onOpen = () => {
    setTrigger((state) => ({ ...state, form: !state.form }));
    mutation.clearData();
    mutation.clearError();
  };

  const onUpdate = (id) => async () => {
    mutation.get(FRHooks.apiRoute().employee("detail", { id }).link(), {
      onBeforeSend: () => {
        onOpen();
      },
      onSuccess: (resp) => {
        mutation.setData(resp.data);
      },
    });
  };

  return (
    <SettingTemplate
      title={t("employee")}
      subtitle={t("employeeSubtitlePage")}
      headRight={{
        children: (
          <Button startIcon={<PersonAdd />} onClick={onOpen}>
            {t(["add", "employee"])}
          </Button>
        ),
      }}
    >
      <Filter.TableFilter t={t} table={table} />

      <Paper elevation={0} variant="outlined">
        <DataTable
          data={table.data}
          loading={table.loading}
          column={columns(table, t, utils, onUpdate)}
          pagination={utils.pagination(table.pagination)}
        />
      </Paper>

      <FORM.Create
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
