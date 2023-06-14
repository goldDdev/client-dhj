import React from "react";
import {
  Button,
  Stack,
  TextField,
  Skeleton,
  Paper,
  Box,
  IconButton,
  CircularProgress,
  Grid,
  Typography,
  Divider,
  Badge,
  ListItemText,
  ButtonGroup,
} from "@mui/material";
import { BasicDropdown, Timeline } from "@components/base";
import { useSnackbar } from "notistack";
import * as Dummy from "../../constants/dummy";
import * as FORM from "./form";
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
  Edit,
  Close,
  Check,
  RefreshOutlined,
  Refresh,
  ImportExport,
} from "@mui/icons-material";
import { useAlert } from "@contexts/AlertContext";
import { LoadingButton } from "@mui/lab";
import apiRoute from "@services/apiRoute";

const columns = (
  onDelete,
  onUpdate,
  onHistory,
  onBoqUpdate,
  table,
  mutation,
  currentId,
  url,
  postLoading,
  snackbar,
  navigate
) => {
  const borderPlan = { borderRight: 1, borderLeft: 1, borderColor: "divider" };
  return [
    {
      label: "No",
      padding: "checkbox",
      value: (_, idx) => idx + 1,
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
          <ListItemText
            sx={{ mx: 1, my: 0 }}
            primary={value.name || "-"}
            primaryTypographyProps={{ variant: "body2", whiteSpace: "nowrap" }}
            secondary={`Tipe: ${value.type || "-"} | Satuan: ${value.typeUnit || "-"}`}
            secondaryTypographyProps={{ variant: "body2" }}
          />
        ),
      padding: "none",
      sx: {
        whiteSpace: "nowrap"
      }
    },
    {
      label: "Harga",
      value: (value) => utils.formatCurrency(value.price),
      align: "right",
    },

    {
      label: "Jumlah Harga",
      value: (value) => utils.formatCurrency(value.price),
      align: "right",
    },

    {
      label: "Jumlah",
      value: (value) => (
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="center"
          spacing={1}
        >
          <Box>
            {currentId === value.id ? (
              <TextField
                size="small"
                value={mutation.data.unit}
                onChange={(e) => mutation.setData({ unit: +e.target.value })}
                variant="standard"
                error={mutation.error("unit")}
                helperText={mutation.message("unit")}
                InputProps={{
                  inputProps: {
                    style: { textAlign: "center" },
                    maxLength: 5,
                  },
                  startAdornment: (
                    <IconButton
                      disabled={mutation.processing}
                      onClick={onUpdate(value)}
                      size="small"
                    >
                      <Close fontSize="inherit" />
                    </IconButton>
                  ),
                  endAdornment: (
                    <IconButton
                      disabled={mutation.processing}
                      onClick={() => {
                        mutation.put(url, {
                          onSuccess: ({ data }) => {
                            snackbar("BOQ proyek berhasil diperbaharui", {
                              variant: "success",
                            });
                            value.unit = data.unit;
                            value.updatedAt = data.updatedAt;
                            onUpdate(data)();
                          },
                        });
                      }}
                      size="small"
                    >
                      {mutation.processing ? (
                        <CircularProgress size={20} />
                      ) : (
                        <Check fontSize="inherit" />
                      )}
                    </IconButton>
                  ),
                }}
                sx={{ minWidth: "150px" }}
              />
            ) : (
              value.unit
            )}
          </Box>

          {currentId === value.id ? null : (
            <Box display="flex" flexDirection="row" gap={1}>
              <IconButton onClick={onUpdate(value)} size="small">
                <Edit fontSize="inherit" />
              </IconButton>
            </Box>
          )}
        </Stack>
      ),
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

export default () => {
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

  const table = FRHooks.useTable([apiRoute.project.listBoqs, { id }], {
    selector: (resp) => resp.data,
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
        name: y.string().required(),
        typeUnit: y.string().required(),
        price: y.number().nullable(),
        unit: y.number().nullable(),
        totalPrice: y.number().nullable(),
        type: y.string(),
      }),
  });

  const boq = FRHooks.useMutation({
    defaultValue: { id: 0, unit: 0 },
    isNewRecord: (data) => data.id === 0,
    schema: (y) =>
      y.object().shape({
        id: y.number().nullable(),
        unit: y.number().nullable(),
      }),
  });

  const onOpen = () => {
    setTrigger((state) => ({ ...state, form: !state.form }));
    mutation.clearData();
    mutation.clearError();
  };

  const onImport = () => {
    setTrigger((state) => ({ ...state, import: !state.import }));
    setJsonData([]);
    setFileName("");
  };

  const onUpload = (e) => {
    e.preventDefault();
    setJsonData([]);

    // if(e.target.value.length === 0) return

    if (e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    }

    reader.onload = (evt) => {
      const workbook = XLSX.read(evt.target.result, { type: "binary" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(worksheet, {
        defVal: null,
        header: ["name", "typeUnit", "unit", "price", "totalPrice", "type"],
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
              totalPrice: +(vl.totalPrice || 0),
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

  const onUpdate = (value) => () => {
    boq.clearError();
    if (value.id === trigger.currentId) {
      boq.clearData();
    } else {
      boq.setData({ id: value.id, unit: value.unit });
    }
    setTrigger((state) => {
      state.currentId = state.currentId === value.id ? 0 : value.id;
      return state;
    });
  };

  const onBoqUpdate = (value) => () => {
    onOpen();
    mutation.setData(value);
  };

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
            >
              Import BOQ
            </Button>

            <Button
              disableElevation
              variant="outlined"
              startIcon={<Add />}
              onClick={onOpen}
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
      <Stack direction="row" spacing={1} mb={2} alignItems="center">
        <TextField
          placeholder="Cari"
          value={table.query("name", "")}
          onChange={(e) => table.setQuery({ name: e.target.value })}
          InputProps={{ startAdornment: <Search color="disabled" /> }}
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
      </Stack>

      <Grid container direction="row" spacing={1}>
        <Grid item xs={12} sm={12} md={12} lg={9} xl={9}>
          <Paper variant="outlined">
            <DataTable
              tableProps={{ size: "small" }}
              data={table.data}
              loading={table.loading}
              column={columns(
                onDelete,
                onUpdate,
                onHistory,
                onBoqUpdate,
                progres,
                boq,
                trigger.currentId,
                apiRoute.project.boqValue,
                trigger.postLoading,
                enqueueSnackbar,
                () => navigate(`/project/${id}/progres`)
              )}
              selected={(v) => v.id === +progres.getQuery("pboid")}
              order={table.order}
              orderBy={table.orderBy}
              onOrder={table.onOrder}
            />
          </Paper>
        </Grid>

        <Grid item xs={12} sm={12} md={12} lg={3} xl={3}>
          <Paper variant="outlined">
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
          </Paper>
        </Grid>
      </Grid>

      <FORM.BOQCreateV2
        trigger={trigger}
        mutation={mutation}
        onOpen={onOpen}
        onSubmit={onCreate}
      />

      <FORM.BOQImport
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
