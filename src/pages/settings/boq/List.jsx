import React from "react";
import FRHooks from "frhooks";
import { ButtonGroup, Paper } from "@mui/material";
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
import { LoadingButton } from "@mui/lab";
import { Refresh } from "@mui/icons-material";

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
  },
  {
    label: "Unit",
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
        <IconButton title={"Ubah"} size="small" onClick={onUpdate(value.id)}>
          <Edit fontSize="inherit" />
        </IconButton>
        <IconButton title={"Hapus"} size="small" onClick={onDelete(value.id)}>
          <Delete fontSize="inherit" />
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
    sx:{
      whiteSpace: "nowrap"
    }
  },
];

export default () => {
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
    mutation.destroy(FRHooks.apiRoute().boq("detail", { id }).link(), {
      onSuccess: () => {
        enqueueSnackbar("BOQ berhasil dihapus");
        table.reload();
      },
    });
  };

  const onSubmit = async () => {
    const isNew = mutation.isNewRecord;
    const editId = mutation.data.id;
    const route = isNew
      ? FRHooks.apiRoute().boq("index")
      : FRHooks.apiRoute().boq("detail", { id: editId });
    mutation.post(route.link(), {
      method: isNew ? "post" : "put",
      except: isNew ? ["id"] : [],
      validation: true,
      onSuccess: (resp) => {
        enqueueSnackbar(
          isNew ? "BOQ berhasil ditambahkan" : "BOQ berhasil diperbaharui"
        );
        table.reload();
        mutation.clearData();
        mutation.clearError();
        onOpen();
      },
    });
  };

  return (
    <SettingTemplate
      title={"BOQ"}
      subtitle="Daftar semua master data Bill of Quantity"
      headRight={{
        children: (
          <ButtonGroup>
            <Button
              disableElevation
              variant="contained"
              startIcon={<Add />}
              onClick={onOpen}
            >
              Tambah BOQ
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
      {/* <Filter.TableFilter t={t} table={table} /> */}

      <Paper elevation={0} variant="outlined">
        <DataTable
          data={table.data}
          loading={table.loading}
          column={columns(table, onUpdate, onDelete)}
          pagination={utils.pagination(table.pagination)}
        />
      </Paper>

      <FORM.BoqForm
        open={trigger.form}
        mutation={mutation}
        onOpen={onOpen}
        onSubmit={onSubmit}
      />
    </SettingTemplate>
  );
};
