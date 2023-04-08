import React from "react";
import FRHooks from "frhooks";
import { Box, Button, Paper } from "@mui/material";
import { useSnackbar } from "notistack";
import MainTemplate from "@components/templates/MainTemplate";
import * as utils from "@utils/";
import * as Dummy from "../../constants/dummy";
import * as BASE from "@components/base";
import { Add, MoreVert } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import apiRoute from "@services/apiRoute";
import DataTable from "../../components/base/table/DataTable";
import moment from "moment";

const columns = (table) => [
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
    value: (value) => value.name,
  },
  {
    label: "Role",
    value: (value) => utils.typesLabel(value.role),
    align: "center",
    head: {
      align: "center",
    },
  },

  {
    label: "Periode",
    value: (value) => `${utils.getMonth(value.month - 1)}/${value.year}`,
    align: "center",
    head: {
      align: "center",
    },
  },

  {
    label: "Total Gaji",
    value: (value) => utils.formatCurrency(value.total),
    head: {
      align: "center",
      padding: "checkbox",
    },
  },
  {
    label: "",
    value: (value) => (
      <BASE.BasicDropdown
        type="icon"
        size="small"
        label={<MoreVert fontSize="inherit" />}
        menu={[
          { text: "Hapus" },
          {
            text: "Unduh",
            onClick: () => {
              var printWindow = window.open(
                `/payrol/${value.id}`,
                "print",
                `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,
               width=0,height=0,left=-1000,top=-1000`
              );
            },
          },
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

export default () => {
  const navigate = useNavigate();

  const table = FRHooks.useTable(apiRoute.payrol.index, {
    selector: (resp) => resp.data,
    total: (resp) => resp.meta.total,
  });

  return (
    <MainTemplate
      title="Penggajian"
      subtitle={`Daftar semua data penggajian karyawan`}
      headRight={{
        children: (
          <Button
            disableElevation
            startIcon={<Add />}
            onClick={() => navigate("/payrol/add")}
          >
            Tambah Penggajian
          </Button>
        ),
      }}
    >
      {/* <Filter.TableFilter t={t} table={table} /> */}
      <Box display="flex" gap={2} sx={{ mb: 2 }}>
        <BASE.Select
          label="Bulan"
          value={table.query("month", +moment().format("M"))}
          menu={[
            { text: "Januari", value: 1 },
            { text: "Februari", value: 2 },
            { text: "Maret", value: 3 },
            { text: "April", value: 4 },
            { text: "Mei", value: 5 },
            { text: "Juni", value: 6 },
            { text: "Juli", value: 7 },
            { text: "Agustus", value: 8 },
            { text: "September", value: 9 },
            { text: "Oktober", value: 10 },
            { text: "November", value: 11 },
            { text: "Desember", value: 12 },
          ]}
          onChange={(e) => {
            table.setQuery({ month: +e.target.value });
          }}
        />
        <BASE.Select
          label="Tahun"
          value={table.query("year", +moment().format("Y"))}
          menu={[
            { text: "2022", value: 2022 },
            { text: "2023", value: 2023 },
          ]}
          onChange={(e) => {
            table.setQuery({ year: +e.target.value });
          }}
        />
      </Box>

      <Paper elevation={0} variant="outlined">
        <DataTable
          data={table.data}
          loading={table.loading}
          column={columns(table)}
          pagination={utils.pagination(table.pagination)}
        />
      </Paper>
    </MainTemplate>
  );
};
