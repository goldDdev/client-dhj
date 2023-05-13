import React, { useEffect } from "react";
import FRHooks from "frhooks";
import { Box, Chip, Paper, Stack, Button } from "@mui/material";
import { People, ListAlt, Close } from "@mui/icons-material";
import { useSnackbar } from "notistack";
import moment from "moment";
import MainTemplate from "@components/templates/MainTemplate";
import * as utils from "@utils/";
// import * as Filter from "./filter";
// import * as FORM from "./Form";
import * as Dummy from "../../../constants/dummy";
import DataTable from "../../../components/base/table/DataTable";
import * as BASE from "@components/base";

const columns = () => [
  {
    label: "Tangal",
    value: (value) =>
      `${moment(value.startDate).format("DD-MM-yyyy")} s/d ${moment(
        value.endDate
      ).format("DD-MM-yyyy")}`,
  },
  {
    label: "Nama",
    value: (value) => value.name,
  },
  {
    label: "Satuan",
    value: (value) => value.unit,
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
    label: "Jumlah",
    value: (value) => value.qty,
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
    label: "Proyek",
    value: (value) => value.projectName,
  },
  {
    label: "Oleh",
    value: (value) => value.creator,
  },
]

export default () => {
  const { t, r } = FRHooks.useLang();
  const { enqueueSnackbar } = useSnackbar();
  const [trigger, setTrigger] = React.useState({
    form: false,
  });

  const table = FRHooks.useTable(FRHooks.apiRoute().inventoryUsing("report").link(), {
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

  useEffect(() => {
    table.setQuery({ type: 'MATERIAL' });
  }, [])

  return (
    <MainTemplate
      title="Laporan Inventori"
      subtitle={`Laporan penggunaan inventori`}
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
          data={table.data}
          loading={table.loading}
          column={columns()}
          pagination={utils.pagination(table.pagination)}
        />
      </Paper>
    </MainTemplate>
  );
};
