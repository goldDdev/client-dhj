import React from "react";
import {
  Button,
  Stack,
  Box,
  Typography,
  TextField,
  ButtonGroup,
} from "@mui/material";
import { BasicDropdown, IconButton, Select } from "@components/base";
import { useSnackbar } from "notistack";
import * as utils from "@utils/";
import * as Dummy from "../../constants/dummy";
import * as FORM from "./form";
import FRHooks from "frhooks";
import DataTable from "../../components/base/table/DataTable";
import ProjectTemplate from "@components/templates/ProjectTemplate";
import moment from "moment";
import { useParams } from "react-router-dom";
import {
  ArrowRight,
  MoreVert,
  Add,
  Notes,
  Search,
  Check,
  ArrowUpward,
  ArrowDownward,
  Block,
  Schedule,
  Refresh,
} from "@mui/icons-material";
import { useAlert } from "@contexts/AlertContext";
import { LoadingButton } from "@mui/lab";

const columns = (onDelete, onUpdate) => [
  {
    value: (value) => (
      <Box px={0.8} py={0.4}>
        <Typography variant="h6">
          {moment(value.datePlan).format("DD")}
        </Typography>
        <Typography variant="caption">
          {utils.getMonth(moment(value.datePlan).format("M")-1)}
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
    },
  },
  {
    value: (value) => (
      <Stack direction="column">
        <Typography variant="body2">
          {value.title}
        </Typography>
        <Stack direction="row" alignItems="center" spacing={0.25}>
          {value.status === "PLAN" ? (
            <Schedule fontSize="inherit" sx={{ verticalAlign: "center" }} />
          ) : value.status === "CANCEL" ? (
            <Block fontSize="inherit" sx={{ verticalAlign: "center" }} />
          ) : (
            <Check fontSize="inherit" sx={{ verticalAlign: "center" }} />
          )}
          <div>
            <Typography variant="caption">
              {utils.komStatusLabel(value.status)}
            </Typography>
          </div>
        </Stack>
      </Stack>
    ),
    sx: {
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

          {value.revise1 || value.reviseTime1 ? (
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
                  Tanggal Revise 1
                </Typography>
                <Typography variant="body2">
                  {moment(value.revise1).format("DD-MM-Y")} {value.reviseTime1}
                </Typography>
              </div>
            </>
          ) : null}

          {value.revise2 || value.reviseTime2 ? (
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
                  Tanggal Revise 2
                </Typography>
                <Typography variant="body2">
                  {moment(value.revise2).format("DD-MM-Y")} {value.reviseTime2}
                </Typography>
              </div>
            </>
          ) : null}

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
                    : date}{" "}
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
  // {
  //   value: (value) => (
  //     <IconButton title="Lihat Detail">
  //       <Notes />
  //     </IconButton>
  //   ),
  //   align: "center",
  //   padding: "checkbox",
  //   sx: { borderTop: 1, borderColor: "divider" },
  // },

  {
    value: (value) => {
      let menu = [
        {
          text: "Revise 1",
          divider: true,
          onClick: onUpdate(value.id, "revise1"),
        },
        {
          text: "Ubah Data",
          divider: true,
          onClick: onUpdate(value.id, "full"),
        },
        { text: "Hapus Milestone", onClick: onDelete(value.id) },
      ];

      if (!!value.revise1 || !!value.reviseTime1) {
        menu[0] = {
          text: "Revise 2",
          divider: true,
          onClick: onUpdate(value.id, "revise2"),
        };
      }

      if (!!value.revise2 || !!value.reviseTime2) {
        menu[0] = {
          text: "Aktual",
          divider: true,
          onClick: onUpdate(value.id, "actual"),
        };
      }

      if (!!value.actualDate || !!value.actualTime) {
        delete menu[0];
      }

      return (
        <BasicDropdown
          size="small"
          type="icon"
          menu={menu}
          label={<MoreVert fontSize="inherit" />}
        />
      );
    },
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
    FRHooks.apiRoute().project("listKoms").params({ projectId: id }).link(),
    {
      selector: (resp) => resp.data,
      total: (resp) => resp.meta.total,
      sort: {
        orderBy: 'date_plan',
        order: 'asc',
      }
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
        revise1: y.string().nullable(),
        revise2: y.string().nullable(),
        reviseTime1: y.string().nullable(),
        reviseTime2: y.string().nullable(),
        actualDate: y.string().nullable(),
        actualTime: y.string().nullable(),
        status: y.string().nullable(),
      }),
  });

  const onOpen = () => {
    setTrigger((state) => ({ ...state, form: !state.form, type: "full" }));
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
        mutation.setData(
          {
            ...data,
            reviseTime1: !!!data.reviseTime1 ? data.timePlan : data.reviseTime1,
            reviseTime2: !!!data.reviseTime2
              ? data.reviseTime1
              : data.reviseTime2,
            actualTime: !!!data.actualTime ? data.reviseTime2 : data.actualTime,
          },
          { include: ["id"] }
        );
      },
    });
  };

  const onDelete = (id) => async () => {
    alert.set({
      open: true,
      title: "Mohon Perhatian",
      message:
        "Anda akan menghapus Milestone ini dari daftar, apakah anda yakin?",
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
                enqueueSnackbar("Agend berhasil dihapus dari daftar");
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
      title="Milestone"
      subtitle="Menampilkan daftar Plan Milestone proyek"
      headRight={{
        children: (
          <ButtonGroup>
            <Button
              disableElevation
              variant="contained"
              startIcon={<Add />}
              onClick={onOpen}
            >
              Tambah Milestone
            </Button>
            <LoadingButton
              loading={table.loading}
              disabled={table.loading}
              onClick={table.reload}
              color="primary"
              startIcon={<Refresh />}
              variant="outlined"
            >
              Muat Ulang
            </LoadingButton>
          </ButtonGroup>
        ),
      }}
    >
      <Stack
        direction={{
          xs: "column",
          sm: "column",
          md: "column",
          lg: "row",
          xl: "row",
        }}
        justifyContent="space-between"
        alignItems={{
          xs: "flex-start",
          sm: "flex-start",
          md: "flex-start",
          lg: "center",
          xl: "center",
        }}
        spacing={1}
        mb={2}
      >
        <TextField
          placeholder="Cari"
          value={table.query("title", "")}
          onChange={(e) => table.setQuery({ title: e.target.value })}
          InputProps={{ startAdornment: <Search color="disabled" /> }}
        />
        <Select
          label="Urutkan"
          menu={[
            { text: "Pilih", divider: true, value: "id" },
            { text: "Tanggal Plan", divider: true, value: "date_plan" },
            { text: "Revise 1", divider: true, value: "revise_1" },
            { text: "Revise 2", divider: true, value: "revise_2" },
            { text: "Tanggal Aktual", value: "actual_date" },
          ]}
          sx={{
            width: {
              xs: "100%",
              sm: "100%",
              md: "100%",
              lg: "25%",
              xl: "25%",
            },
            "& .MuiOutlinedInput-root": {
              paddingLeft: 0.8,
            },
          }}
          value={table.orderBy || 'date_plan'}
          onChange={(e) => {
            table.onOrder(e.target.value);
          }}
          InputProps={{
            startAdornment: (
              <IconButton
                title={"urutkan"}
                size="small"
                onClick={() => table.onOrder(table.orderBy)}
                sx={{ mr: 1 }}
              >
                {table.order === "asc" ? (
                  <ArrowUpward fontSize="inherit" />
                ) : (
                  <ArrowDownward fontSize="inherit" />
                )}
              </IconButton>
            ),
          }}
        />
        <Select
          label="Status"
          name="status"
          menu={[
            { text: "Pilih Status", divider: true, value: "00" },
            { text: "Plan", divider: true, value: "PLAN" },
            { text: "Batal", divider: true, value: "CANCEL" },
            { text: "Selesai", value: "DONE" },
          ]}
          sx={{
            width: {
              xs: "100%",
              sm: "100%",
              md: "100%",
              lg: "25%",
              xl: "25%",
            },
          }}
          value={table.query("status", "00")}
          onChange={(e) => {
            if (e.target.value === "00") {
              table.remove("status");
            } else {
              table.setQuery({ status: e.target.value });
            }
          }}
        />
      </Stack>

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
