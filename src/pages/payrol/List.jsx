import React from "react";
import FRHooks from "frhooks";
import { Box, Chip, Paper } from "@mui/material";
import { useSnackbar } from "notistack";
import MainTemplate from "@components/templates/MainTemplate";
import * as utils from "@utils/";
// import * as Filter from "./filter";
// import * as FORM from "./Form";
import * as Dummy from "../../constants/dummy";
import DataTable from "../../components/base/table/DataTable";
import * as BASE from "@components/base";

const columns = (table, t) => [
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
    label: 'Potongan',
    value: (value) => 'Rp.0',
  },
  {
    label: 'Tunjangan',
    value: (value) => 'Rp.0',
  },
  {
    label: 'Total Gaji',
    value: (value) => 'Rp.0',
  },
  {
    label: "Aksi",
    value: (value) => (
      <IconButton title="Kalkulasi" size="small">
        <Edit fontSize="small" />
      </IconButton>
    ),
    align: "center",
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
        email: y.string().required().min(3),
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
        mutation.setData(resp.data);
      },
    });
  };

  return (
    <MainTemplate
      title="Penggajian"
      subtitle={`Daftar semua data penggajian karyawan`}
    >
      {/* <Filter.TableFilter t={t} table={table} /> */}
      <Box display="flex" gap={2} sx={{ mb: 2 }}>
        <BASE.Select
          label="Bulan"
          value={3}
          menu={[
            { text: 'Januari', value: 1 },
            { text: 'Februari', value: 2 },
            { text: 'Maret', value: 3 },
            { text: 'April', value: 4 },
            { text: 'Mei', value: 5 },
            { text: 'Juni', value: 6 },
            { text: 'Juli', value: 7 },
            { text: 'Agustus', value: 8 },
            { text: 'September', value: 9 },
            { text: 'Oktober', value: 10 },
            { text: 'November', value: 11 },
            { text: 'Desember', value: 12 },
          ]}
        />
        <BASE.Select
          label="Tahun"
          value={2023}
          menu={[
            { text: '2022', value: 2022 },
            { text: '2023', value: 2023 },
          ]}
        />
      </Box>

      <Paper elevation={0} variant="outlined">
        <DataTable
          data={[]}
          loading={table.loading}
          column={columns(table, t)}
          pagination={utils.pagination(table.pagination)}
        />
      </Paper>

      {/* Modal to open calculation */}
    </MainTemplate>
  );
};
