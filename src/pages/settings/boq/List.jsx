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
import * as FORM from "./form";
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
    label: t("unit"),
    value: (value) => utils.ccFormat(value.unit) || "-",
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
        phoneNumber: y.string().required().min(10).max(12),
      }),
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
      title={t("boq")}
      subtitle="Daftar semua master data Bill of Quantity"
      headRight={{
        children: (
          <Button startIcon={<PersonAdd />} onClick={onOpen}>
            {t(["add", "boq"])}
          </Button>
        ),
      }}
    >
      {/* <Filter.TableFilter t={t} table={table} /> */}

      <Paper elevation={0} variant="outlined">
        <DataTable
          data={[]}
          loading={false}
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
