import React, { useEffect } from "react";
import FRHooks from "frhooks";
import { useSnackbar } from "notistack";
import { Paper, Stack, Button } from "@mui/material";
import { Add, ListAlt } from "@mui/icons-material";
import MainTemplate from "@components/templates/MainTemplate";
import * as utils from "@utils/";
import * as FORM from "./Form";
import * as Dummy from "../../../constants/dummy";
import DataTable from "../../../components/base/table/DataTable";

const columns = () => [
  {
    label: 'Tangal',
    value: (value) => '',
  },
  {
    label: 'Project',
    value: (value) => '',
  },
  {
    label: "Jumlah",
    value: (value) => "-",
    align: "center",
    head: {
      align: "center",
      sx: {
        width: "10%",
        whiteSpace: "nowrap",
      },
    },
  },
  {
    label: 'Oleh',
    value: (value) => '',
  },
  {
    label: 'Status',
    value: (value) => '',
  },
]

export default () => {
  const { t, r } = FRHooks.useLang();
  const { enqueueSnackbar } = useSnackbar();
  const [trigger, setTrigger] = React.useState({
    form: false,
  });

  const table = FRHooks.useTable(FRHooks.apiRoute().inventory("index").link(), {
    selector: (resp) => resp.data,
    total: (resp) => resp.meta.total,
    disabledOnDidMount: true
  });

  const mutation = FRHooks.useMutation({
    defaultValue: Dummy.user,
    isNewRecord: (data) => data.id === 0,
    schema: (y) =>
      y.object().shape({
        email: y.string().required().min(3),
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

  useEffect(() => {
    // table.setQuery({ type: 'MATERIAL' });
  }, [])

  return (
    <MainTemplate
      title="Permintaan Penggunaan Inventori"
      subtitle={`Daftar penggunaan inventori dalam proyek oleh mandor`}
      headRight={{
        children: (
          <Button startIcon={<Add />} onClick={onOpen}>
            Tambah Penggunaan Inventori
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
            variant={!table.query("type") ? "contained" : "outlined"}
            color={!table.query("type") ? "primary" : "inherit"}
            startIcon={<ListAlt />}
            onClick={() => table.setQuery({ type: '' })}
          >
            Semua Inventori
          </Button>
        </div>
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
            onClick={() => table.setQuery({ type: 'EQUIPMENT' })}
          >
            Equipment
          </Button>
        </div>
      </Stack>

      <Paper elevation={0} variant="outlined">
        <DataTable
          data={[]}
          loading={table.loading}
          column={columns()}
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
    </MainTemplate>
  );
};
