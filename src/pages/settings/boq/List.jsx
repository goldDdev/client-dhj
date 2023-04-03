import React from "react";
import FRHooks from "frhooks";
import { Paper } from "@mui/material";
import { IconButton, Button } from "@components/base";
import { useSnackbar } from "notistack";
import SettingTemplate from "@components/templates/SettingTemplate";
import Add from "@mui/icons-material/Add";
import Edit from "@mui/icons-material/Edit";
import Delete from "@mui/icons-material/Delete";
import * as utils from "@utils/";
// import * as Filter from "./filter";
import * as FORM from "./Form";
import * as Dummy from "../../../constants/dummy";
import DataTable from "../../../components/base/table/DataTable";

const columns = (table, t, onUpdate, onDelete) => [
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
    value: (value) => value.typeUnit || "-",
    align: "center",
    head: {
      align: "center",
      sx: {
        width: "15%",
      },
    },
    sx: {
      whiteSpace: "nowrap",
    },
  },
  {
    label: "Aksi",
    value: (value) => (
      <>
        <IconButton title={t("edit")} size="small" onClick={onUpdate(value.id)}>
          <Edit fontSize="small" />
        </IconButton>
        <IconButton title={t("delete")} size="small" onClick={onDelete(value.id)}>
          <Delete fontSize="small" />
        </IconButton>
      </>
    ),
    align: "center",
    head: {
      align: "center",
      sx: {
        width: "10%",
      },
    },
  },
];

export default () => {
  const { t, r } = FRHooks.useLang();
  const { enqueueSnackbar } = useSnackbar();
  const [trigger, setTrigger] = React.useState({
    form: false,
  });

  const table = FRHooks.useTable(FRHooks.apiRoute().boq("index").link(), {
    selector: (resp) => resp.data,
    total: (resp) => resp.meta.total,
  });

  const mutation = FRHooks.useMutation({
    defaultValue: Dummy.boq,
    isNewRecord: (data) => data.id === 0,
    schema: (y) =>
      y.object().shape({
        name: y.string().required(),
        typeUnit: y.string().required(),
      }),
  });

  const onOpen = () => {
    setTrigger((state) => ({ ...state, form: !state.form }));
    mutation.clearData();
    mutation.clearError();
  };

  const onUpdate = (id) => async () => {
    mutation.get(FRHooks.apiRoute().boq("detail", { id }).link(), {
      onBeforeSend: () => {
        onOpen();
      },
      onSuccess: (resp) => {
        mutation.setData({ ...resp.data, typeUnit: resp.data.typeUnit });
      },
    });
  };

  const onDelete = (id) => async () => {
    // TODO: confirm delete
    mutation.destroy(FRHooks.apiRoute().boq("detail", { id }).link(), {
      onSuccess: () => {
        enqueueSnackbar(t("commonSuccessDelete"));
        const idx = table.data.findIndex(d => d.id === id)
        table.data.splice(idx, 1);
      },
    });
  }

  const onSubmit = async () => {
    const isNew = mutation.isNewRecord;
    const editId = mutation.data.id;
    const route = isNew ? FRHooks.apiRoute().boq("index") : FRHooks.apiRoute().boq("detail", { id: editId })
    mutation.post(route.link(), {
      method: isNew ? "post" : "put",
      except: isNew ? ["id"] : [],
      validation: true,
      onSuccess: (resp) => {
        enqueueSnackbar(t(isNew ? "commonSuccessCreate" : "commonSuccessUpdate"));
        if (isNew) {
          table.data.unshift(resp.data);
        } else {
          const idx = table.data.findIndex(d => d.id === editId)
          table.data[idx] = resp.data;
        }
        mutation.clearData();
        mutation.clearError();
        onOpen();
      },
    });
  }

  return (
    <SettingTemplate
      title={t("boq")}
      subtitle="Daftar semua master data Bill of Quantity"
      headRight={{
        children: (
          <Button startIcon={<Add />} onClick={onOpen}>
            {t(["add", "boq"])}
          </Button>
        ),
      }}
    >
      {/* <Filter.TableFilter t={t} table={table} /> */}

      <Paper elevation={0} variant="outlined">
        <DataTable
          data={table.data}
          loading={table.loading}
          column={columns(table, t, onUpdate, onDelete)}
          pagination={utils.pagination(table.pagination)}
        />
      </Paper>

      <FORM.BoqForm
        open={trigger.form}
        t={t}
        r={r}
        mutation={mutation}
        snackbar={enqueueSnackbar}
        table={table}
        onOpen={onOpen}
        onSubmit={onSubmit}
      />
    </SettingTemplate>
  );
};
