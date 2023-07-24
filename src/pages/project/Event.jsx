import React from "react";
import {
  Button,
  Stack,
  Box,
  Typography,
  TextField,
  ButtonGroup,
  Paper,
  Tooltip,
} from "@mui/material";
import { BasicDropdown, IconButton, Select } from "@components/base";
import { useSnackbar } from "notistack";
import * as utils from "@utils/";
import * as Dummy from "@constants/dummy";
import FRHooks from "frhooks";
import DataTable from "@components/base/table/DataTable";
import ProjectTemplate from "@components/templates/ProjectTemplate";
import moment from "moment";
import { useParams } from "react-router-dom";
import {
  ArrowRight,
  MoreVert,
  Add,
  Search,
  Check,
  ArrowUpward,
  ArrowDownward,
  Block,
  Schedule,
  Refresh,
  CalendarMonth,
} from "@mui/icons-material";
import { useAlert } from "@contexts/AlertContext";
import { LoadingButton } from "@mui/lab";
import EventCreate from "./form/EventCreate";
import apiRoute from "@services/apiRoute";

const columns = (onDelete, onUpdate, today) => {
  let isToday = false;

  return [
    {
      label: "Tanggal",
      value: (value) => {
        isToday = false;
        isToday = moment(value.datePlan).format("DD-MM-Y") === today;
        return (
          <Tooltip
            title={`Event berlangsung ${
              isToday ? "hari ini" : moment(value.datePlan).format("DD-MM-Y")
            }`}
            arrow
          >
            <Box
              px={0.8}
              py={0.4}
              sx={{
                backgroundColor: isToday ? "info.main" : "white",
                color: isToday ? "white" : "inherit",
              }}
            >
              <Typography variant="h6">
                {moment(value.datePlan).format("DD")}
              </Typography>
              <Typography variant="caption">
                {utils.getMonth(moment(value.datePlan).format("M") - 1)}
              </Typography>
            </Box>
          </Tooltip>
        );
      },
      align: "center",
      padding: "none",
      sx: {
        width: "1%",
        whiteSpace: "noWrap",
        borderRight: 1,
        borderTop: 1,
        borderColor: "divider",
      },
      size: "small",
    },
    {
      label: "Event",
      value: (value) => (
        <Stack direction="column">
          <Typography variant="body2">{value.title}</Typography>
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
        borderRight: 1,
        borderColor: "divider",
      },
      size: "small",
    },
    {
      label: "Plan",
      value: (value) => {
        const date = moment(value.datePlan).format("DD-MM-Y");
        return (
          <Typography variant="body2">
            {date} {value.timePlan}
          </Typography>
        );
      },
      align: "left",
      sx: {
        whiteSpace: "noWrap",
        width: "1%",
        borderTop: 1,
        px: 1,
      },
      head: {
        align: "center",
      },
      size: "small",
    },
    {
      label: "Revise 1",
      value: (value) => {
        return value.revise1 || value.reviseTime1 ? (
          <Stack direction={"row"} alignItems={"center"}>
            <div>
              <ArrowRight />
            </div>

            <div>
              <Typography variant="body2">
                {moment(value.revise1).format("DD-MM-Y")} {value.reviseTime1}
              </Typography>
            </div>
          </Stack>
        ) : (
          <Tooltip title="Ubah Tanggal (Revise 1)">
            <Button
              fullWidth
              size="small"
              variant="text"
              color="primary"
              endIcon={<CalendarMonth fontSize="inherit" />}
              onClick={onUpdate(value.id, "revise1")}
            >
              Revise 1
            </Button>
          </Tooltip>
        );
      },
      align: "left",
      sx: {
        whiteSpace: "noWrap",
        width: "1%",
        borderTop: 1,
        px: 1,
      },
      head: {
        align: "center",
      },
      size: "small",
    },
    {
      label: "Revise 2",
      value: (value) => {
        return value.revise2 || value.reviseTime2 ? (
          <Stack direction={"row"} alignItems={"center"}>
            <div>
              <ArrowRight />
            </div>

            <div>
              <Typography variant="body2">
                {moment(value.revise2).format("DD-MM-Y")} {value.reviseTime2}
              </Typography>
            </div>
          </Stack>
        ) : (
          <Tooltip title="Ubah Tanggal (Revise 2)">
            <Button
              fullWidth
              size="small"
              variant="text"
              color="primary"
              endIcon={<CalendarMonth fontSize="inherit" />}
              onClick={onUpdate(value.id, "revise2")}
            >
              Revise 2
            </Button>
          </Tooltip>
        );
      },
      align: "left",
      sx: {
        whiteSpace: "noWrap",
        width: "1%",
        borderTop: 1,
        px: 1,
      },
      head: {
        align: "center",
      },
      size: "small",
    },
    {
      label: "Aktual",
      value: (value) => {
        return value.actualDate || value.actualTime ? (
          <Stack direction={"row"} alignItems={"center"}>
            <div>
              <ArrowRight />
            </div>

            <div>
              <Typography variant="body2">
                {moment(value.actualDate).format("DD-MM-Y")} {value.actualTime}
              </Typography>
            </div>
          </Stack>
        ) : (
          <Tooltip title="Tambah Tanggal Aktual">
            <Button
              fullWidth
              size="small"
              variant="text"
              color="primary"
              endIcon={<CalendarMonth fontSize="inherit" />}
              onClick={onUpdate(value.id, "actual")}
            >
              Aktual
            </Button>
          </Tooltip>
        );
      },
      align: "left",
      sx: {
        whiteSpace: "noWrap",
        width: "1%",
        borderTop: 1,
        px: 1,
      },
      head: {
        align: "center",
      },
      size: "small",
    },

    {
      label: "",
      value: (value) => {
        return (
          <BasicDropdown
            size="small"
            type="icon"
            menu={[
              {
                text: "Ubah Data",
                divider: true,
                onClick: onUpdate(value.id, "full"),
              },
              { text: "Hapus Milestone", onClick: onDelete(value.id) },
            ]}
            label={<MoreVert fontSize="inherit" />}
          />
        );
      },
      size: "small",
      align: "center",
      head: {
        padding: "checkbox",
      },
      sx: {
        borderTop: 1,
        borderColor: "divider",
        px: 1,
      },
    },
  ];
};

const Event = () => {
  const { id } = useParams();
  const alert = useAlert();
  const today = moment().format("DD-MM-Y");
  const { enqueueSnackbar } = useSnackbar();
  const [trigger, setTrigger] = React.useState({
    form: false,
    type: "full",
    filter: false,
    curr: "",
  });

  const table = FRHooks.useTable([apiRoute.project.listKoms, { id }], {
    selector: (resp) => resp.data,
    total: (resp) => resp.meta.total,
    sort: {
      orderBy: "date_plan",
      order: "asc",
    },
  });

  const mutation = FRHooks.useMutation({
    defaultValue: { ...Dummy.kom, projectId: id },
    isNewRecord: (data) => data.id === 0,
    schema: (y) =>
      y.object().shape({
        id: y.number().optional(),
        title: y.string().required().label("Event"),
        description: y.string().optional().label("Deskripsi"),
        datePlan: y.string().optional().label("Tanggal Plan"),
        timePlan: y.string().optional().label("Jam Plan"),
        revise1: y.string().optional().label("Revise 1"),
        revise2: y.string().optional().label("Revise 2"),
        reviseTime1: y.string().optional().label("Jam Revise 1"),
        reviseTime2: y.string().optional().label("Jams Revise 2"),
        actualDate: y.string().optional().label("Tanggal Aktual"),
        actualTime: y.string().optional().label("Jam Aktual"),
        status: y.string().optional().label("Status"),
      }),
  });

  const onOpen = () => {
    mutation.clearData();
    mutation.clearError();
    setTrigger((state) => ({
      ...state,
      form: !state.form,
      type: "full",
      curr: btoa(JSON.stringify({ ...Dummy.kom, projectId: id })),
    }));
  };

  const onUpdate = (id, type) => () => {
    mutation.get([apiRoute.project.listKomDetail, { id }], {
      onBeforeSend: () => {
        setTrigger((state) => ({ ...state, form: !state.form, type }));
      },
      onSuccess: (resp) => {
        const data = {
          id: resp.data.id,
          title: resp.data.title,
          projectId: resp.data.projectId,
          description: resp.data.description || "",
          datePlan: resp.data.datePlan,
          timePlan: resp.data.timePlan,
          revise1: resp.data.revise1 || "",
          revise2: resp.data.revise2 || "",
          reviseTime1: resp.data.reviseTime1 || "",
          reviseTime2: resp.data.reviseTime2 || "",
          actualDate: resp.data.actualDate || "",
          actualTime: resp.data.actualTime || "",
          status: resp.data.status,
        };

        setTrigger((state) => ({ ...state, curr: btoa(JSON.stringify(data)) }));
        mutation.setData(data);
      },
    });
  };

  const onDelete = (id) => () => {
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

  const isCurr = React.useMemo(
    () => trigger.curr !== btoa(JSON.stringify(mutation.data)),
    [trigger.curr, mutation.data]
  );

  const col = React.useMemo(() => columns, [table.data])

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
              disabled={table.loading}
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
          InputProps={{ endAdornment: <Search color="disabled" /> }}
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
          value={table.orderBy || "date_plan"}
          onChange={(e) => {
            table.onOrder(e.target.value);
          }}
          InputProps={{
            startAdornment: (
              <IconButton
                title={"urutkan"}
                size="small"
                onClick={() => table.onOrder(table.orderBy)}
                sx={{ mr: 1, border: 1, borderColor: "divider" }}
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

      <Paper variant="outlined">
        <DataTable
          tableProps={{
            sx: {
              "& th": {
                backgroundColor: "#f4f4f4",
              },
              "& tbody > tr:last-child td": {
                borderBottom: 0,
              },
            },
          }}
          data={table.data}
          loading={table.loading}
          column={col(onDelete, onUpdate, today)}
        />
      </Paper>

      <EventCreate
        isCurr={isCurr}
        open={trigger.form}
        mutation={mutation}
        snackbar={enqueueSnackbar}
        table={table}
        onOpen={onOpen}
        type={trigger.type}
      />
    </ProjectTemplate>
  );
};

export default Event;
