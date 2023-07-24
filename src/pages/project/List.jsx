import React from "react";
import { Button, ButtonGroup, Paper } from "@mui/material";
import { LinearProgress, BasicDropdown } from "@components/base";
import { useSnackbar } from "notistack";
import { MoreVert, Refresh } from "@mui/icons-material";
import { useAlert } from "@contexts/AlertContext";
import { Link } from "react-router-dom";

import Add from "@mui/icons-material/Add";
import * as utils from "@utils/";
import * as Filter from "./filter";
import * as Dummy from "@constants/dummy";
import FRHooks from "frhooks";
import DataTable from "@components/base/table/DataTable";
import MainTemplate from "@components/templates/MainTemplate";
import moment from "moment";
import apiRoute from "@services/apiRoute";
import { LoadingButton } from "@mui/lab";
import ProjectCreate from "./form/ProjectCreate";

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
    value: (value) => (
      <Link
        to={`/project/detail/${value.id}`}
        style={{ textDecoration: "none", fontWeight: 500 }}
      >
        {value.name}
      </Link>
    ),
    sx: {
      whiteSpace: "nowrap",
    },
  },
  {
    label: "Nilai Proyek",
    value: (value) => utils.formatCurrency(value.price),
    head: {
      noWrap: true,
      sx: {
        width: "15%",
      },
    },
    sx: { whiteSpace: "nowrap" },
  },
  {
    label: "Team",
    value: (value) => value.companyName,
    head: {
      noWrap: true,
      sx: {
        width: "15%",
      },
    },
    sx: { whiteSpace: "nowrap" },
  },
  {
    label: "Status",
    value: (value) => value.status,
    head: {
      noWrap: true,
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
      <BasicDropdown
        type="icon"
        size="small"
        label={<MoreVert fontSize="inherit" />}
        menu={[
          { text: "Ubah", onClick: onUpdate(value.id), divider: true },
          { text: "Hapus", onClick: onDelete(value.id) },
        ]}
      />
    ),
    align: "center",
    head: {
      noWrap: true,
      align: "center",
      padding: "checkbox",
    },
  },
];

const List = () => {
  const alert = useAlert();
  const { enqueueSnackbar } = useSnackbar();
  const [trigger, setTrigger] = React.useState({
    form: false,
    curr: "",
  });

  const validation = FRHooks.useServerValidation({
    url: apiRoute.project.validation,
    param: {
      path: "field",
      type: "rule",
    },
    withErrorResponse: (resp) => resp.response.data.error.messages.errors,
    option: {
      unique: (param) => "Nomor SPK ini sudah ada",
    },
  });

  const table = FRHooks.useTable(apiRoute.project.index, {
    selector: (resp) => resp.data,
    total: (resp) => resp.meta.total,
  });

  const mutation = FRHooks.useMutation({
    defaultValue: Dummy.project,
    isNewRecord: (data) => data.id === 0,
    schema: (y) =>
      y.object().shape({
        id: y.number().optional(),
        name: y.string().required().label("Nama"),
        noSpk: y.string().required().label("No SPK"),
        companyName: y.string().required().label("Team"),
        contact: y.string().optional(),
        startAt: y.date().optional(),
        finishAt: y.date().optional(),
        duration: y.number().optional(),
        price: y.number().optional(),
        location: y.string().optional(),
        latitude: y.number().optional(),
        longitude: y.number().optional(),
        targetDate: y.date().optional(),
        status: y.string().required(),
        note: y.string().optional(),
      }),
  });

  const onOpen = () => {
    mutation.clearData();
    mutation.clearError();
    setTrigger((state) => ({
      ...state,
      form: !state.form,
      curr: btoa(JSON.stringify(Dummy.project)),
    }));
  };

  const onUpdate = (id) => () => {
    mutation.get([apiRoute.project.detail, { id }], {
      onBeforeSend: () => {
        setTrigger((state) => ({
          ...state,
          form: !state.form,
        }));
      },
      onSuccess: (resp) => {
        const data = {
          id: resp.data.id,
          name: resp.data.name,
          noSpk: resp.data.noSpk,
          companyName: resp.data.companyName,
          contact: resp.data.contact || "",
          startAt: resp.data.startAt,
          finishAt: resp.data.finishAt,
          duration: resp.data.duration,
          price: resp.data.price,
          location: resp.data.location || "",
          latitude: resp.data.latitude,
          longitude: resp.data.longitude,
          targetDate: resp.data.targetDate,
          status: resp.data.status,
          note: resp.data.note || "",
        };
        setTrigger((state) => ({
          ...state,
          curr: btoa(JSON.stringify(data)),
        }));
        mutation.setData(data);
      },
    });
  };

  const onSubmit = () => {
    mutation.post(apiRoute.project.index, {
      serverValidation: {
        serve: validation.serve,
        method: "post",
      },
      validation: true,
      except: mutation.isNewRecord ? ["id"] : [],
      method: mutation.isNewRecord ? "post" : "put",
      onSuccess: ({ data }) => {
        enqueueSnackbar(`Proyek Berhasil disimpan`, {
          variant: "success",
        });
        if (mutation.isNewRecord) {
          table.add(data, "start");
        } else {
          table.update((c) => c.id === data.id, data);
        }
        onOpen();
      },
    });
  };

  const onDelete = (id) => () => {
    alert.set({
      open: true,
      title: "Mohon Perhatian",
      message: "Anda akan menghapus proyek ini dari daftar, apakah anda yakin?",
      type: "warning",
      loading: false,
      close: {
        text: "Keluar",
      },
      confirm: {
        text: "Ya, Saya Mengerti",
        onClick: () => {
          mutation.destroy([apiRoute.project.detail, { id }], {
            onBeforeSend: () => {
              alert.set({ loading: true });
            },
            onSuccess: () => {
              enqueueSnackbar("Proyek berhasil dihapus dari daftar");
              table.destroy((v) => v.id === id);
              alert.reset();
            },
            onAlways: () => {
              alert.set({ loading: false });
            },
          });
        },
      },
    });
  };

  const isCurr = React.useMemo(
    () => trigger.curr !== btoa(JSON.stringify(mutation.data)),
    [trigger.curr, mutation.data]
  );

  return (
    <MainTemplate
      title="Proyek"
      subtitle="Manampilkan semua daftar proyek yang terbuat."
      headRight={{
        children: (
          <ButtonGroup>
            <Button
              disableElevation
              variant="contained"
              startIcon={<Add />}
              onClick={onOpen}
              disabled={table.loading}
            >
              Tambah Proyek
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
      <Filter.ButtonFilter table={table} />

      <Paper elevation={0} variant="outlined">
        <DataTable
          data={table.data}
          loading={table.loading}
          column={columns(table, onUpdate, onDelete)}
          pagination={utils.pagination(table.pagination)}
        />
      </Paper>

      <ProjectCreate
        isCurr={isCurr}
        open={trigger.form}
        mutation={mutation}
        onOpen={onOpen}
        onSubmit={onSubmit}
      />
    </MainTemplate>
  );
};

export default List;
