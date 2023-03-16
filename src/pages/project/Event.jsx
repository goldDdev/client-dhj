import React from "react";
import { Button, Stack, Box, Typography } from "@mui/material";
import { BasicDropdown, IconButton } from "@components/base";
import { useSnackbar } from "notistack";
import * as utils from "@utils/";
import * as Filter from "./filter";
import * as Dummy from "../../constants/dummy";
import * as FORM from "./form";
import FRHooks from "frhooks";
import DataTable from "../../components/base/table/DataTable";
import ProjectTemplate from "@components/templates/ProjectTemplate";
import moment from "moment";
import { useParams } from "react-router-dom";
import { ArrowRight, MoreVert, Add, Notes } from "@mui/icons-material";
import { useAlert } from "@contexts/AlertContext";

const columns = (onDelete, onUpdate) => [
  {
    value: (value) => (
      <Box px={0.8} py={0.4}>
        <Typography variant="h6">
          {moment(value.datePlan).format("DD")}
        </Typography>
        <Typography variant="caption">
          {utils.getMonth(moment(value.datePlan).format("m"))}
        </Typography>
      </Box>
    ),
    align: "center",
    padding: "none",
    sx: {
      width: "1%",
      whiteSpace: "noWrap",
      borderLeft: 1,
      borderRight: 1,
      borderTop: 1,
      borderColor: "divider",
      backgroundColor: "primary.main",
      color: "white"

    },
  },
  {
    value: (value) => (
      <Typography variant="subtitle2">{value.title}</Typography>
    ),
    sx: {
      borderTop: 1,
      borderColor: "divider",
    },
  },
  {
    value: (value) => <Filter.ChipKom status={value.status} />,
    align: "center",
    sx: {
      whiteSpace: "noWrap",
      width: "1%",
      borderTop: 1,
      borderColor: "divider",
    },
  },
  {
    value: (value) => {
      const date = moment(value.datePlan).format("DD-MM-Y");

      return (
        <Stack direction="row" alignItems="center" spacing={1}>
          <div>
            <Typography variant="caption">Tanggal Plan</Typography>
            <Typography variant="body2">
              {date} {value.timePlan}
            </Typography>
          </div>

          {value.actualDate || value.actualTime ? (
            <>
              <div>
                <ArrowRight />
              </div>

              <div>
                <Typography
                  variant="caption"
                  color="success.main"
                  fontWeight={600}
                >
                  Tanggal Aktual
                </Typography>
                <Typography variant="body2">
                  {value.actualDate
                    ? moment(value.actualDate).format("DD-MM-Y")
                    : date}
                    {" "}
                   {value.actualTime || value.timePlan}
                </Typography>
              </div>
            </>
          ) : null}
        </Stack>
      );
    },
    align: "left",
    padding: "none",
    sx: {
      whiteSpace: "noWrap",
      width: "1%",
      borderTop: 1,
      borderColor: "divider",
    },
  },
  {
    value: (value) => (
      <IconButton title="Lihat Detail">
        <Notes />
      </IconButton>
    ),
    align: "center",
    padding: "checkbox",
    sx: { borderTop: 1, borderColor: "divider" },
  },

  {
    value: (value) => (
      <BasicDropdown
        type="icon"
        menu={[
          {
            text: "Agenda Ulang",
            divider: true,
            onClick: onUpdate(value.id, "actual"),
          },
          {
            text: "Ubah Data",
            divider: true,
            onClick: onUpdate(value.id, "full"),
          },
          { text: "Hapus Agenda", onClick: onDelete(value.id) },
        ]}
        label={<MoreVert />}
      />
    ),
    align: "center",
    padding: "checkbox",
    sx: {
      borderRight: 1,
      borderTop: 1,
      borderColor: "divider",
    },
  },
];

export default () => {
  const { id } = useParams();
  const alert = useAlert();
  const { enqueueSnackbar } = useSnackbar();
  const [trigger, setTrigger] = React.useState({
    form: false,
    type: "full",
  });

  const table = FRHooks.useTable(
    FRHooks.apiRoute().project("listKoms").link(),
    {
      selector: (resp) => resp.data,
      total: (resp) => resp.meta.total,
    }
  );

  const mutation = FRHooks.useMutation({
    defaultValue: { ...Dummy.kom, projectId: id },
    isNewRecord: (data) => data.id === 0,
    schema: (y) =>
      y.object().shape({
        title: y.string().required(),
        description: y.string().nullable(),
        datePlan: y.string().nullable(),
        timePlan: y.string().nullable(),
        status: y.string().nullable(),
      }),
  });

  const onOpen = () => {
    setTrigger((state) => ({ ...state, form: !state.form }));
    mutation.clearData();
    mutation.clearError();
  };

  const onUpdate = (id, type) => async () => {
    mutation.get(FRHooks.apiRoute().project("listKomDetail", { id }).link(), {
      onBeforeSend: () => {
        setTrigger((state) => ({ ...state, form: !state.form, type }));
        mutation.clearData();
        mutation.clearError();
      },
      onSuccess: ({ data }) => {
        mutation.setData(data, { include: ["id"] });
      },
    });
  };

  const onDelete = (id) => async () => {
    alert.set({
      open: true,
      title: "Mohon Perhatian",
      message: "Anda akan mengahapus agenda ini dari daftar, apakah anda yain?",
      type: "warning",
      loading: false,
      close: {
        text: "Keluar",
      },
      confirm: {
        text: "Ya, Saya Mengerti",
        onClick: () => {
          mutation.destroy(
            FRHooks.apiRoute().project("listKomDetail", { id }).link(),
            {
              onBeforeSend: () => {
                alert.set({ loading: true });
              },
              onSuccess: () => {
                enqueueSnackbar("Agend berhasil dihapus dari daftar", {
                  variant: "success",
                });
                table.data.splice(
                  table.data.findIndex((v) => v.id === id),
                  1
                );
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
      title="Agenda"
      headRight={{
        children: (
          <Button disableElevation startIcon={<Add />} onClick={onOpen}>
            Tambah Agenda
          </Button>
        ),
      }}
    >
      <DataTable
        disableHeader
        data={table.data}
        loading={table.loading}
        column={columns(onDelete, onUpdate)}
        tableProps={{
          size: "small",
          sx: { borderCollapse: "separate", borderSpacing: "0 8px" },
        }}
        row={{ sx: { backgroundColor: "white" } }}
      />

      <FORM.EventCreate
        open={trigger.form}
        mutation={mutation}
        route={FRHooks.apiRoute}
        snackbar={enqueueSnackbar}
        table={table}
        onOpen={onOpen}
        type={trigger.type}
      />
    </ProjectTemplate>
  );
};
