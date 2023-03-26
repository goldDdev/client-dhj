import React from "react";
import { Button, Stack, TextField, Skeleton, Paper } from "@mui/material";
import { BasicDropdown } from "@components/base";
import { useSnackbar } from "notistack";
import * as Dummy from "../../constants/dummy";
import * as FORM from "./form";
import FRHooks from "frhooks";
import DataTable from "../../components/base/table/DataTable";
import ProjectTemplate from "@components/templates/ProjectTemplate";
import moment from "moment";
import { useParams } from "react-router-dom";
import { MoreVert, Add, Search } from "@mui/icons-material";
import { useAlert } from "@contexts/AlertContext";
import apiRoute from "@services/apiRoute";

const columns = (onDelete, postLoading) => [
  {
    label: "No",
    value: (_, idx) => {
      return idx + 1;
    },
    head: {
      align: "center",
      padding: "checkbox",
    },
    align: "center",
    padding: "checkbox",
  },
  {
    label: "Nama",
    sortKey: "name",
    value: (value) =>
      postLoading.some((v) => v === value.boqId) ? (
        <Skeleton width="100%" />
      ) : (
        value.name
      ),
  },
  {
    label: "Satuan",
    sortKey: "unit",
    value: (value) =>
      postLoading.some((v) => v === value.boqId) ? (
        <Skeleton width="100%" />
      ) : (
        value.typeUnit
      ),
    align: "center",
    padding: "checkbox",
    head: {
      align: "center",
    },
    sx: {
      whiteSpace: "noWrap",
    },
  },
  {
    label: "Jumlah",
    value: (value) => value.unit,
    align: "center",
    padding: "checkbox",
    head: {
      align: "center",
    },
  },

  {
    label: "Tambahan",
    value: (value) => value.additionalUnit,
    align: "center",
    padding: "checkbox",
    head: {
      align: "center",
      sx: { whiteSpace: "nowrap" },
    },
  },

  {
    label: "Perbaharui Pada",
    sortKey: "updated_at",
    value: (value) => moment(value.updatedAt).fromNow(),
    align: "center",
    padding: "checkbox",
    head: {
      align: "center",
      sx: { whiteSpace: "nowrap" },
    },
  },

  {
    value: (value) => (
      <BasicDropdown
        type="icon"
        menu={[{ text: "Hapus", onClick: onDelete(value.id) }]}
        label={<MoreVert />}
      />
    ),
    align: "center",
    padding: "checkbox",
  },
];

export default () => {
  const { id } = useParams();
  const alert = useAlert();
  const { enqueueSnackbar } = useSnackbar();
  const [trigger, setTrigger] = React.useState({
    form: false,
    postLoading: [],
  });

  const table = FRHooks.useTable([apiRoute.project.listBoqs, { id }], {
    selector: (resp) => resp.data,
  });

  const boqs = FRHooks.useFetch([apiRoute.project.listBoqSearch, { id }], {
    selector: (resp) => resp.data,
    defaultValue: [],
    disabledOnDidMount: true,
  });

  const mutation = FRHooks.useMutation({
    defaultValue: { ...Dummy.projectBoq, projectId: +id },
    isNewRecord: (data) => data.id === 0,
    schema: (y) =>
      y.object().shape({
        projectId: y.number().nullable(),
        boqId: y.number().nullable(),
      }),
  });

  const onOpen = () => {
    setTrigger((state) => ({ ...state, form: !state.form }));
    boqs.refresh();
    mutation.clearData();
    mutation.clearError();
  };

  const onDelete = (id) => async () => {
    alert.set({
      open: true,
      title: "Mohon Perhatian",
      message: "Anda akan menghapus BOQ ini dari daftar, apakah anda yakin?",
      type: "warning",
      loading: false,
      close: {
        text: "Keluar",
      },
      confirm: {
        text: "Ya, Saya Mengerti",
        onClick: () => {
          mutation.destroy(
            FRHooks.apiRoute().project("listBoqDetail", { id }).link(),
            {
              onBeforeSend: () => {
                alert.set({ loading: true });
              },
              onSuccess: () => {
                enqueueSnackbar("BOQ berhasil dihapus dari daftar", {
                  variant: "success",
                });
                table.destroy((v) => v.id === id);
                alert.reset();
              },
              onAlways: () => {
                alert.set({ loading: false });
              },
            }
          );
        },
      },
    });
  };

  return (
    <ProjectTemplate
      title="BOQ"
      subtitle="Menampilkan daftar BOQ proyek yang sudah dibuat"
      headRight={{
        children: (
          <Button disableElevation startIcon={<Add />} onClick={onOpen}>
            Tambah BOQ
          </Button>
        ),
      }}
    >
      <Stack direction="row" spacing={1} mb={2} alignItems="center">
        <TextField
          placeholder="Cari"
          value={table.query("name", "")}
          onChange={(e) => table.setQuery({ name: e.target.value })}
          InputProps={{ startAdornment: <Search color="disabled" /> }}
          sx={{ width: "30%" }}
        />
      </Stack>

      <Paper variant="outlined">
        <DataTable
          data={table.data}
          loading={table.loading}
          column={columns(onDelete, trigger.postLoading)}
          order={table.order}
          orderBy={table.orderBy}
          onOrder={table.onOrder}
        />
      </Paper>

      <FORM.BOQCreate
        trigger={trigger}
        table={boqs}
        list={table}
        mutation={mutation}
        route={FRHooks.apiRoute}
        onOpen={onOpen}
        setTrigger={setTrigger}
      />
    </ProjectTemplate>
  );
};
