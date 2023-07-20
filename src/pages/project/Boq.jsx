import React, { useCallback } from "react";
import {
  Button,
  Stack,
  TextField,
  Skeleton,
  Paper,
  Box,
  IconButton,
  Typography,
  Divider,
  Badge,
  ListItemText,
  ButtonGroup,
} from "@mui/material";
import { BasicDropdown, Timeline } from "@components/base";
import { useSnackbar } from "notistack";
import * as Dummy from "../../constants/dummy";
import * as utils from "@utils/";
import FRHooks from "frhooks";
import DataTable from "../../components/base/table/DataTable";
import ProjectTemplate from "@components/templates/ProjectTemplate";
import moment from "moment";
import { useNavigate, useParams } from "react-router-dom";
import {
  MoreVert,
  Add,
  Search,
  RefreshOutlined,
  Refresh,
  ImportExport,
} from "@mui/icons-material";
import { useAlert } from "@contexts/AlertContext";
import { LoadingButton } from "@mui/lab";
import apiRoute from "@services/apiRoute";
import BOQCreate from "./form/BOQCreate";
import BOQImport from "./form/BOQImport";

const columns = (
  onDelete,
  onHistory,
  onBoqUpdate,
  postLoading,
  navigate,
  from
) => {
  const borderPlan = { borderRight: 1, borderColor: "divider" };
  return [
    {
      label: "No",
      padding: "checkbox",
      value: (_, idx) => from + idx,
      align: "center",
      head: {
        padding: "checkbox",
        align: "center",
      },
    },

    {
      label: "Nama",
      sortKey: "name",
      value: (value) =>
        postLoading.some((v) => v === value.boqId) ? (
          <Skeleton width="100%" />
        ) : (
          value.name
        ),
      sx: {
        whiteSpace: "nowrap",
      },
    },
    {
      label: "Satuan",
      align: "center",
      value: (value) => value.typeUnit || "-",
      sx: {
        whiteSpace: "nowrap",
      },
    },

    {
      label: "Tipe",
      value: (value) => value.type || "-",
      align: "center",
      sx: {
        whiteSpace: "nowrap",
      },
    },
    {
      label: "Harga",
      value: (value) => utils.formatCurrency(value.price),
      align: "right",
    },

    {
      label: "Jumlah",
      value: (value) => value.unit,
      align: "center",
      padding: "checkbox",
      head: {
        align: "center",
      },
      sx: {
        ...borderPlan,
      },
    },

    {
      label: "Jumlah Harga",
      value: (value) => utils.formatCurrency(value.price * value.unit),
      align: "right",
      sx: {
        ...borderPlan,
      },
    },

    {
      label: "Plan",
      value: (value) =>
        postLoading.some((v) => v === value.boqId) ? (
          <Skeleton width="100%" />
        ) : (
          value.planProgres
        ),
      align: "center",
      padding: "checkbox",
      head: {
        align: "center",
      },
      sx: {
        whiteSpace: "noWrap",
        fontWeight: 700,
        fontSize: "16px",
        minWidth: "80px",
        ...borderPlan,
      },
    },
    {
      label: "Jumlah Plan",
      value: (value) => utils.formatCurrency(value.price * value.planProgres),
      align: "right",
      sx: {
        ...borderPlan,
      },
    },

    {
      label: "Progres",
      value: (value) =>
        postLoading.some((v) => v === value.boqId) ? (
          <Skeleton width="100%" />
        ) : (
          value.totalProgres
        ),
      align: "center",
      padding: "checkbox",
      head: {
        align: "center",
      },
      sx: {
        whiteSpace: "noWrap",
        ...borderPlan,
        fontWeight: 700,
        fontSize: "16px",
        minWidth: "80px",
      },
    },

    {
      label: "Jumlah Progres",
      value: (value) => utils.formatCurrency(value.price * value.totalProgres),
      align: "right",
      sx: {
        ...borderPlan,
      },
    },

    {
      label: "Tanggal Progres",
      sortKey: "updated_at",
      value: (value) => (
        <ListItemText
          sx={{ m: 0 }}
          primary={value.progresBy || "-"}
          primaryTypographyProps={{ variant: "body2" }}
          secondary={value.lastProgresAt || "-"}
          secondaryTypographyProps={{ variant: "body2" }}
        />
      ),
      align: "center",
      padding: "checkbox",
      head: {
        align: "center",
        sx: {
          whiteSpace: "nowrap",
        },
      },
      sx: {
        ...borderPlan,
      },
    },
    {
      label: "Tanggal Plan",
      value: (value) =>
        postLoading.some((v) => v === value.boqId) ? (
          <Skeleton width="100%" />
        ) : (
          <ListItemText
            sx={{ m: 0 }}
            secondary={`${value.planStart || ""} - ${value.planEnd || ""}`}
            primaryTypographyProps={{ variant: "body2" }}
            primary={value.planBy || "-"}
            secondaryTypographyProps={{ variant: "body2" }}
          />
        ),
      align: "center",
      head: {
        align: "center",
        sx: {
          whiteSpace: "nowrap",
        },
      },
      padding: "checkbox",
      sx: {
        whiteSpace: "noWrap",
        padding: 0.4,
        ...borderPlan,
      },
    },

    {
      value: (value) => (
        <Badge
          badgeContent={value.totalPending || 0}
          color="error"
          anchorOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
        >
          <BasicDropdown
            type="icon"
            size="small"
            menu={[
              {
                text: `${
                  value.totalPending > 0 ? `(${value.totalPending})` : ""
                } Menunggu Konfirmasi`,
                onClick: navigate,
                disabled: value.totalPending === 0,
                divider: true,
              },
              {
                text: "Riwayat",
                onClick: onHistory(value),
                divider: true,
              },
              {
                text: "Ubah",
                onClick: onBoqUpdate(value),
                divider: true,
              },
              { text: "Hapus", onClick: onDelete(value.id) },
            ]}
            label={<MoreVert fontSize="inherit" />}
          />
        </Badge>
      ),
      head: {
        padding: "checkbox",
      },
      align: "center",
      padding: "checkbox",
    },
  ];
};

const Boq = () => {
  const reader = new FileReader();
  const alert = useAlert();
  const navigate = useNavigate();
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const [jsonData, setJsonData] = React.useState([]);
  const [filename, setFileName] = React.useState("");
  const [trigger, setTrigger] = React.useState({
    form: false,
    import: false,
    postLoading: [],
    currentId: 0,
    pboid: 0,
    history: false,
  });
  const [isSwitch, setSwitch] = React.useState(true);

  const table = FRHooks.useTable([apiRoute.project.listBoqs, { id }], {
    selector: (resp) => resp.data,
    total: (resp) => resp.meta.total,
    pagination: {
      perPage: 100,
      perPageOptions: [50, 100, 200]
    },
  });

  const progres = FRHooks.useFetch([apiRoute.project.listProgress, { id }], {
    defaultValue: [],
    selector: (resp) => resp.data,
    total: (resp) => resp.data.meta.total,
  });

  const mutation = FRHooks.useMutation({
    defaultValue: { ...Dummy.projectBoq, projectId: +id },
    isNewRecord: (data) => data.id === 0,
    schema: (y) =>
      y.object().shape({
        id: y.number(),
        projectId: y.number().nullable(),
        name: y.string().required().label("Nama"),
        typeUnit: y.string().required().label("Satuan"),
        price: y.number().nullable().label("Harga"),
        unit: y.number().nullable().label("Unit"),
        totalPrice: y.number().nullable(),
        type: y.string().required().label("Tipe"),
      }),
  });

  const onOpen = React.useCallback(() => {
    setTrigger((state) => ({ ...state, form: !state.form }));
    mutation.clearData();
    mutation.clearError();
  }, [mutation.data]);

  const onImport = () => {
    setTrigger((state) => ({ ...state, import: !state.import }));
    setJsonData([]);
    setFileName("");
  };

  const onUpload = (e) => {
    e.preventDefault();
    setJsonData([]);

    if (e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    }

    reader.onload = (evt) => {
      const workbook = XLSX.read(evt.target.result, { type: "binary" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(worksheet, {
        defVal: null,
        header: ["name", "typeUnit", "unit", "price", "type"],
        blankrows: null,
      });

      if (!!data.length) {
        delete data[0];

        setJsonData(
          data
            .map((vl, i) => ({
              name: vl.name || "",
              typeUnit: vl.typeUnit ?? "",
              unit: parseFloat(vl.unit || 0),
              price: +vl.price,
              type: vl.type || "",
              row: vl.__rowNum__ || i,
            }))
            .filter((v) => v !== null)
        );
      }
    };

    reader.readAsArrayBuffer(e.target.files[0]);
    e.target.value = null;
  };

  const onHistory = (value) => () => {
    setTrigger((state) => ({ ...state, history: !state.history }));
    progres.setQuery({ pboid: value.id });
  };

  const onBoqUpdate = useCallback(
    (value) => () => {
      setTrigger((state) => ({ ...state, form: !state.form }));
      mutation.clearData();
      mutation.clearError();
      mutation.setData(value);
    },
    [mutation.data]
  );

  const onDelete = (id) => () => {
    alert.set({
      open: true,
      title: "Mohon Perhatian",
      message: "Anda akan menghapus BOQ ini dari daftar, apakah anda yakin?",
      type: "warning",
      loading: false,
      close: {
        text: "Keluar",
      },
      confirm: {
        text: "Ya, Saya Mengerti",
        onClick: () => {
          mutation.destroy(
            FRHooks.apiRoute().project("listBoqDetail", { id }).link(),
            {
              onBeforeSend: () => {
                alert.set({ loading: true });
              },
              onSuccess: () => {
                enqueueSnackbar("BOQ berhasil dihapus dari daftar");
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

  const onCreate = () => {
    mutation.post(apiRoute.project.boq, {
      method: mutation.isNewRecord ? "post" : "put",
      except: mutation.isNewRecord ? ["id"] : [],
      validation: true,
      onSuccess: () => {
        table.reload();
        enqueueSnackbar(
          mutation.isNewRecord
            ? "BOQ berhasil Ditambahkan"
            : "BOQ berhasil diperbaharui"
        );
        onOpen();
      },
      onAlways: () => {},
    });
  };

  const onSubmit = () => {
    mutation.post(apiRoute.project.boqImport, {
      options: {
        data: {
          projectId: +id,
          items: jsonData.map(({ __rowNum__, ...dt }) => dt),
        },
      },
      onBeforeSend: () => {},
      onSuccess: ({ data }) => {
        table.reload();
        enqueueSnackbar("Import BOQ berhasil");
        onImport();
      },
      onAlways: () => {},
    });
  };

  return (
    <ProjectTemplate
      title="BOQ"
      subtitle="Menampilkan daftar Item Pekerjaan (BOQ) dalam proyek"
      headRight={{
        children: (
          <ButtonGroup>
            <Button
              disableElevation
              variant="contained"
              startIcon={<ImportExport />}
              onClick={onImport}
              disabled={table.loading}
            >
              Import BOQ
            </Button>

            <Button
              disableElevation
              variant="outlined"
              startIcon={<Add />}
              onClick={onOpen}
              disabled={table.loading}
            >
              Tambah BOQ
            </Button>

            <LoadingButton
              loading={table.loading}
              disabled={table.loading}
              onClick={() => table.reload()}
              color="primary"
              variant="outlined"
              startIcon={<Refresh />}
            >
              Muat Ulang
            </LoadingButton>
          </ButtonGroup>
        ),
      }}
    >
      <Stack
        direction="row"
        spacing={1}
        mb={2}
        alignItems="center"
        justifyContent="flex-start"
      >
        <ButtonGroup>
          <Button
            disabled={table.loading}
            variant={isSwitch ? "contained" : "outlined"}
            onClick={() => setSwitch(true)}
          >
            Daftar BOQ
          </Button>
          <Button
            disabled={table.loading}
            variant={!isSwitch ? "contained" : "outlined"}
            onClick={() => setSwitch(false)}
          >
            Riwayat
          </Button>
        </ButtonGroup>

        <TextField
          placeholder="Cari"
          value={table.query("name", "")}
          onChange={(e) => table.setQuery({ name: e.target.value })}
          InputProps={{ endAdornment: <Search color="disabled" /> }}
          sx={{
            width: {
              xs: "100%",
              sm: "100%",
              md: "100%",
              lg: "30%",
              xl: "30%",
            },
          }}
        />

        <Box>
          <Typography variant="body2">{table.pagination.text}</Typography>
        </Box>
      </Stack>

      <Paper variant="outlined">
        {isSwitch ? (
          <DataTable
            container={{ sx: { height: "500px" } }}
            tableProps={{
              size: "small",
              stickyHeader: true,
              sx: {
                "& th": {
                  backgroundColor: "#f4f4f4",
                },
                "& > thead > tr > th:nth-of-type(1), & > thead > tr > th:nth-of-type(2)":
                  {
                    position: "sticky",
                    left: 0,
                    zIndex: 3,
                  },

                "& > tbody > tr > td:nth-of-type(1), & > tbody > tr > td:nth-of-type(2)":
                  {
                    backgroundColor: "white",
                    position: "sticky",
                    left: 0,
                    zIndex: 1,
                  },
                "& > thead > tr > th:nth-of-type(2), & > tbody > tr > td:nth-of-type(2)":
                  {
                    left: 46,
                    borderRight: 1,
                    borderColor: "divider",
                    boxShadow: "inset -2px 0 1px -2px rgba(0,0,0,0.50)",
                  },
              },
            }}
            data={table.data}
            loading={table.loading}
            column={columns(
              onDelete,
              onHistory,
              onBoqUpdate,
              trigger.postLoading,
              () => navigate(`/project/${id}/progres`),
              table.pagination.from
            )}
            selected={(v) => v.id === +progres.getQuery("pboid")}
            order={table.order}
            orderBy={table.orderBy}
            onOrder={table.onOrder}
            pagination={utils.pagination(table.pagination)}
          />
        ) : (
          <>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              m={1}
            >
              <Typography flexGrow={1}>Riwayat</Typography>
              <div>
                <IconButton size="small" onClick={() => progres.clear()}>
                  <RefreshOutlined fontSize="inherit" />
                </IconButton>
              </div>
            </Stack>

            <Divider />

            {progres.isEmpty ? (
              <Typography variant="body2" m={2}>
                Belum Ada Riwayat Pengerjaan
              </Typography>
            ) : null}

            <Box
              sx={{ height: "480px", maxHeight: "420px", overflow: "scroll" }}
            >
              <Timeline
                data={progres.data}
                value={(v, i) => {
                  return (
                    <>
                      <Typography variant="body2" fontWeight={600}>
                        {v.submitedName}
                      </Typography>
                      <Typography variant="body2">
                        {v.progres} {v.typeUnit} ({v.name})
                      </Typography>
                      <Typography variant="caption" fontStyle="italic">
                        {moment(v.createdAt).format("DD-MM-yyyy HH:mm:ss")}
                      </Typography>
                    </>
                  );
                }}
              />
            </Box>
          </>
        )}
      </Paper>

      <BOQCreate
        trigger={trigger}
        mutation={mutation}
        onOpen={onOpen}
        onSubmit={onCreate}
      />

      <BOQImport
        data={jsonData}
        loading={mutation.processing}
        trigger={trigger}
        onOpen={onImport}
        onUpload={onUpload}
        onSubmit={onSubmit}
        setJsonData={setJsonData}
        filename={filename}
      />
    </ProjectTemplate>
  );
};

export default Boq;
