import React, { useEffect } from "react";
import FRHooks from "frhooks";
import { Box, Chip, Paper, Stack, Button } from "@mui/material";
import { Add, ListAlt, Close } from "@mui/icons-material";
import { useSnackbar } from "notistack";
import moment from "moment";
import MainTemplate from "@components/templates/MainTemplate";
import * as utils from "@utils/";
// import * as Filter from "./filter";
import * as FORM from "./Form";
import * as Dummy from "../../../constants/dummy";
import DataTable from "../../../components/base/table/DataTable";
import * as BASE from "@components/base";

const columns = (table, t) => [
  {
    label: t("name"),
    value: (value) => value.name,
  },
  {
    label: "Satuan",
    value: (value) => value.unit,
    align: "center",
    head: {
      align: "center",
      sx: {
        width: "20%",
        whiteSpace: "nowrap",
      },
    },
  },
  {
    label: "Jumlah",
    value: (value) => value.qty,
    align: "center",
    head: {
      align: "center",
      sx: {
        width: "20%",
        whiteSpace: "nowrap",
      },
    },
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
    config: {
      // params: { type: 'MATERIAL' }
    }
  });

  const mutation = FRHooks.useMutation({
    defaultValue: Dummy.inventory,
    isNewRecord: (data) => data.id === 0,
    schema: (y) =>
      y.object().shape({
        name: y.string().required(),
        unit: y.string().required(),
        qty: y.number().required().min(0),
        minQty: y.number().required().min(0),
      }),
  });

  const onOpen = () => {
    setTrigger((state) => ({ ...state, form: !state.form }));
    mutation.clearData();
    mutation.clearError();
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
    if (table.query('type')) return;
    table.setQuery('type', 'MATERIAL');
  }, [table.query])

  return (
    <MainTemplate
      title="Master Data Inventori"
      subtitle={`Daftar semua master data Material & Equipment`}
      headRight={{
        children: (
          <Button startIcon={<Add />} onClick={onOpen}>
            Tambah Data Inventori
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
            variant={"contained"}
            startIcon={<ListAlt />}
            onClick={() => console.log('')}
            color="inherit"
          >
            Material
          </Button>
        </div>
        <div>
          <Button
            disableElevation
            variant={"contained"}
            startIcon={<ListAlt />}
            onClick={() => console.log('')}
            color="inherit"
          >
            Equipment
          </Button>
        </div>
      </Stack>

      <Paper elevation={0} variant="outlined">
        <DataTable
          data={table.data}
          loading={table.loading}
          column={columns(table, t)}
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
