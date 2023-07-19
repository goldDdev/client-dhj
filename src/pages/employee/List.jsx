import React from "react";
import FRHooks from "frhooks";
import SettingTemplate from "@components/templates/SettingTemplate";
import PersonAdd from "@mui/icons-material/PersonAdd";
import * as utils from "@utils/";
import * as Filter from "./filter";
import * as FORM from "./form";
import * as Dummy from "../../constants/dummy";
import DataTable from "../../components/base/table/DataTable";
import apiRoute from "@services/apiRoute";
import { Link } from "react-router-dom";
import {
  Filter1,
  FilterAlt,
  FilterAltOff,
  Key,
  MoreVert,
  Refresh,
} from "@mui/icons-material";
import { useAlert } from "@contexts/AlertContext";
import {
  ButtonGroup,
  Chip,
  Collapse,
  Paper,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Button, BasicDropdown } from "@components/base";
import { useSnackbar } from "notistack";
import { LoadingButton } from "@mui/lab";

const columns = (table, utils, onUpdate, onDelete) => [
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
    label: "ID Karyawan",
    value: (value, idx) => (
      <Link to={`/employee/${value.id}/detail`}>{value.cardID}</Link>
    ),
    head: {
      align: "center",
      padding: "checkbox",
      noWrap: true,
    },
    padding: "checkbox",
    size: "small",
  },
  {
    label: "Nama",
    value: (value) => value.name,
    sx: {
      whiteSpace: "nowrap",
    },
  },

  {
    label: "No HP",
    value: (value) => utils.ccFormat(value.phoneNumber) || "-",
    align: "center",
    head: {
      align: "center",
      sx: {
        width: "10%",
      },
    },
    sx: {
      whiteSpace: "nowrap",
    },
  },
  {
    label: "Alamat Email",
    value: (value) => value.email || "-",
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
    label: "Role",
    value: (value) => utils.typesLabel(value.role),
    align: "center",
    head: {
      align: "center",
      sx: {
        width: "10%",
        whiteSpace: "nowrap",
      },
    },
    sx: {
      whiteSpace: "nowrap",
    },
  },
  {
    label: "Tipe",
    value: (value) =>
      value.type ? (
        <Chip label={value.type} variant="outlined" size="small" color="info" />
      ) : (
        "-"
      ),
    align: "center",
    head: {
      align: "center",
      sx: {
        width: "10%",
        whiteSpace: "nowrap",
      },
    },
    sx: {
      whiteSpace: "nowrap",
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
      align: "center",
      padding: "checkbox",
    },
  },
];

export default () => {
  const alert = useAlert();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.between("xs", "sm"));
  const { enqueueSnackbar } = useSnackbar();
  const [trigger, setTrigger] = React.useState({
    form: false,
    filter: false,
  });

  const table = FRHooks.useTable(apiRoute.employee.index, {
    selector: (resp) => resp.data,
    total: (resp) => resp.meta.total,
  });

  const mutation = FRHooks.useMutation({
    defaultValue: Dummy.employee,
    isNewRecord: (data) => data.id === 0,
    schema: (y) =>
      y.object().shape({
        name: y.string().required().min(3),
        cardID: y.string().required(),
        phoneNumber: y.string().required().min(10),
        email: y.string().when("role", {
          is: (role) => {
            return role !== "WORKER";
          },
          then: y.string().required(),
        }),
        role: y.string().optional().required(),
        password: y.string().optional(),
        type: y.string(),
      }),
    format: {
      phoneNumber: (value) => String(value),
    },
  });

  const { serve, validate: serverValidate } = FRHooks.useServerValidation({
    url: apiRoute.employee.validation,
    param: {
      path: "field",
      type: "rule",
    },
    selector: (resp) => resp.response.data.error.messages.errors,
    option: {
      unique: (param) => `Data ini sudah digunakan`,
    },
    field: {
      phoneNumber: {
        selector: (resp, {}, option) => {
          return option(resp.data?.error?.messages?.errors || []);
        },
      },
      cardID: {
        selector: (resp, {}, option) => {
          return option(resp.data?.error?.messages?.errors || []);
        },
      },
    },
    callback: (er) => {
      mutation.setError(er);
    },
  });

  const onOpen = () => {
    setTrigger((state) => ({ ...state, form: !state.form }));
    mutation.clearData();
    mutation.clearError();
  };

  const onOpenFilter = () => {
    setTrigger((state) => ({ ...state, filter: !state.filter }));
  };

  const onUpdate = (id) => () => {
    mutation.get([apiRoute.employee.detail, { id }], {
      onBeforeSend: () => {
        setTrigger((state) => ({ ...state, form: !state.form }));
        mutation.clearData();
      },
      onSuccess: (resp) => {
        mutation.setData({
          ...resp.data,
          email: resp.data.user?.email || "",
          type: resp.data.type || "",
        });
      },
    });
  };

  const onDelete = (id) => () => {
    alert.set({
      open: true,
      title: "Mohon Perhatian",
      message:
        "Anda akan menghapus karyawan ini dari daftar, apakah anda yakin?",
      type: "warning",
      loading: false,
      close: {
        text: "Keluar",
      },
      confirm: {
        text: "Ya, Saya Mengerti",
        onClick: () => {
          mutation.destroy([apiRoute.employee.detail, { id }], {
            onBeforeSend: () => {
              alert.set({ loading: true });
            },
            onSuccess: () => {
              enqueueSnackbar("Karyawan berhasil dihapus dari daftar");
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

  const validate = (id, key) => async (e) => {
    const inv = await mutation.validate(key);
    if (!inv) {
      const data = { [key]: e.target.value.replace(/\s+/g, "") };
      if (id > 0) {
        Object.assign(data, { id });
      }
      await serverValidate(key, data);
    }
  };

  const onSubmit = () => {
    mutation.reformat((va) => ({
      ...va,
      ...(va.type === "00" ? { type: "" } : { type: va.type }),
    }));
    mutation.post(apiRoute.employee.index, {
      except: mutation.isNewRecord ? ["id"] : ["user", "works", "updatedAt"],
      method: mutation.isNewRecord ? "post" : "put",
      validation: true,
      serverValidation: {
        serve,
        method: "post",
      },
      onSuccess: ({ data }) => {
        enqueueSnackbar("Karyawan baru berhasil disimpan");
        if (mutation.isNewRecord) {
          table.add(data, "start");
        } else {
          table.update((c) => c.id === data.id, data);
        }
        mutation.clearData();
        mutation.clearError();
        onOpen();
      },
    });
  };

  return (
    <SettingTemplate
      title={"Karyawan"}
      subtitle={"Daftar semua karyawan karyawan"}
      headRight={{
        children: (
          <ButtonGroup>
            <Button
              variant="outlined"
              disableElevation
              disabled={table.loading}
              startIcon={trigger.filter ? <FilterAltOff /> : <FilterAlt />}
              onClick={onOpenFilter}
            >
              Filter
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
            <Button
              disabled={table.loading}
              variant="contained"
              disableElevation
              startIcon={<PersonAdd />}
              onClick={onOpen}
            >
              {isMobile ? "" : "Tambah"} Karyawan
            </Button>
          </ButtonGroup>
        ),
      }}
    >
      <Collapse in={trigger.filter} unmountOnExit>
        <Filter.TableFilter table={table} />
      </Collapse>
      <Paper elevation={0} variant="outlined">
        <DataTable
          headProps={{ sx: { backgroundColor: "#f4f4f4" } }}
          data={table.data}
          loading={table.loading}
          column={columns(table, utils, onUpdate, onDelete)}
          pagination={utils.pagination(table.pagination)}
          hover={true}
        />
      </Paper>

      <FORM.Create
        open={trigger.form}
        mutation={mutation}
        validate={validate}
        onSubmit={onSubmit}
        onOpen={onOpen}
      />
    </SettingTemplate>
  );
};
