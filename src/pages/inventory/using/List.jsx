import React, { useEffect } from "react";
import FRHooks from "frhooks";
import moment from "moment";
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
    value: (value) => `${moment(value.startDate).format("DD-MM-yyyy")} s/d ${moment(value.endDate).format("DD-MM-yyyy") }`,
  },
  {
    label: 'Proyek',
    value: (value) => value.projectName,
  },
  {
    label: "Jumlah",
    value: (value) => `MT: ${value.total_material}, EQ:  ${value.total_equipment}`,
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
    label: 'Oleh',
    value: (value) => value.name,
  },
  {
    label: 'Status',
    value: (value) => utils.ucword(value.status),
  },
  {
    label: 'Aksi',
    value: (value) => '-',
  },
]

export default () => {
  const { t, r } = FRHooks.useLang();
  const { enqueueSnackbar } = useSnackbar();
  const [trigger, setTrigger] = React.useState({
    form: false,
  });

  const table = FRHooks.useTable(FRHooks.apiRoute().inventoryUsing("index").link(), {
    selector: (resp) => resp.data,
    total: (resp) => resp.meta.total,
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
      subtitle={`Daftar penggunaan inventori dalam proyek`}
      headRight={{
        // children: (
        //   <Button startIcon={<Add />} onClick={onOpen}>
        //     Tambah Penggunaan Inventori
        //   </Button>
        // ),
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
            variant={!table.query("status") ? "contained" : "outlined"}
            color={!table.query("status") ? "primary" : "inherit"}
            startIcon={<ListAlt />}
            onClick={() => table.setQuery({ status: '' })}
          >
            Semua Status
          </Button>
        </div>
        <div>
          <Button
            disableElevation
            variant={table.query("status") == 'PENDING' ? "contained" : "outlined"}
            color={table.query("status") == 'PENDING' ? "primary" : "inherit"}
            startIcon={<ListAlt />}
            onClick={() => table.setQuery({ status: 'PENDING' })}
          >
            Pending
          </Button>
        </div>
        <div>
          <Button
            disableElevation
            variant={table.query("status") == 'APPROVED' ? "contained" : "outlined"}
            color={table.query("status") == 'APPROVED' ? "primary" : "inherit"}
            startIcon={<ListAlt />}
            onClick={() => table.setQuery({ status: 'APPROVED' })}
          >
            Selesai
          </Button>
        </div>
        <div>
          <Button
            disableElevation
            variant={table.query("status") == 'REJECTED' ? "contained" : "outlined"}
            color={table.query("status") == 'REJECTED' ? "primary" : "inherit"}
            startIcon={<ListAlt />}
            onClick={() => table.setQuery({ status: 'REJECTED' })}
          >
            Ditolak
          </Button>
        </div>
      </Stack>

      <Paper elevation={0} variant="outlined">
        <DataTable
          data={table.data}
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
