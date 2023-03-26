import React from "react";
import { Button, Chip, Paper } from "@mui/material";
import { IconButton, LinearProgress } from "@components/base";
import { useSnackbar } from "notistack";

import Add from "@mui/icons-material/Add";
import Edit from "@mui/icons-material/Edit";
import * as utils from "@utils/";
import * as Filter from "./filter";
import * as Dummy from "../../constants/dummy";
import FRHooks from "frhooks";
import DataTable from "../../components/base/table/DataTable";
import MainTemplate from "@components/templates/MainTemplate";
import * as FORM from "./form";
import moment from "moment";
import { Link } from "react-router-dom";

const columns = (table, onUpdate) => [
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
    value: (value) => (
      <Link
        to={`/project/${value.id}/detail`}
        style={{ textDecoration: "none", fontWeight: 500 }}
      >
        {value.name}
      </Link>
    ),
  },
  {
    label: "Perusahaan",
    value: (value) => value.companyName,
    head: {
      noWrap: true,
      sx: {
        width: "15%",
      },
    },
  },
  {
    label: "Status",
    value: (value) => value.status,
    head: {
      sx: {
        width: "10%",
      },
    },
  },
  {
    label: "Durasi",
    value: (value) => {
      const total =
        value.duration - (moment(value.finishAt).diff(moment(), "days") || 0);
      const percent =
        ((total < 0 ? 0 : total > value.duration ? value.duration : total) /
          value.duration) *
        100;
      return (
        <LinearProgress
          color="success"
          label={`${
            total < 0 ? 0 : total > value.duration ? value.duration : total
          }/${value.duration}Hari`}
          value={percent}
        />
      );
    },
    head: {
      noWrap: true,
      sx: {
        width: "15%",
      },
    },
  },
  {
    label: "",
    value: (value) => (
      <IconButton title="Ubah" size="small" onClick={onUpdate(value.id)}>
        <Edit fontSize="small" />
      </IconButton>
    ),
    align: "center",
    head: {
      noWrap: true,
      align: "center",
      padding: "checkbox",
    },
  },
];

export default () => {
  const { enqueueSnackbar } = useSnackbar();
  const [trigger, setTrigger] = React.useState({
    form: false,
  });

  const table = FRHooks.useTable(FRHooks.apiRoute().project("index").link(), {
    selector: (resp) => resp.data,
    total: (resp) => resp.meta.total,
  });

  const mutation = FRHooks.useMutation({
    defaultValue: Dummy.project,
    isNewRecord: (data) => data.id === 0,
    schema: (y) =>
      y.object().shape({
        name: y.string().required(),
        companyName: y.string().required(),
        noSpk: y.string().nullable(),
        contact: y.string().nullable(),
        location: y.string().nullable(),
        latitude: y.number().nullable(),
        longitude: y.number().nullable(),
        startAt: y.date().nullable(),
        finishAt: y.date().nullable(),
        status: y.string().required(),
        duration: y.number().nullable(),
      }),
  });

  const onOpen = () => {
    setTrigger((state) => ({ ...state, form: !state.form }));
    mutation.clearData();
    mutation.clearError();
  };

  const onUpdate = (id) => async () => {
    mutation.get(FRHooks.apiRoute().project("detail", { id }).link(), {
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
      title="Proyek"
      subtitle="Manampilkan semua daftar proyek yang terbuat."
      headRight={{
        children: (
          <Button disableElevation startIcon={<Add />} onClick={onOpen}>
            Tambah Proyek
          </Button>
        ),
      }}
    >
      <Filter.ButtonFilter />

      <Paper elevation={0} variant="outlined">
        <DataTable
          data={table.data}
          loading={table.loading}
          column={columns(table, onUpdate)}
          pagination={utils.pagination(table.pagination)}
        />
      </Paper>

      <FORM.Create
        open={trigger.form}
        mutation={mutation}
        route={FRHooks.apiRoute}
        snackbar={enqueueSnackbar}
        table={table}
        onOpen={onOpen}
      />
    </MainTemplate>
  );
};
