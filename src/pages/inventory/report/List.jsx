import React, { useEffect } from "react";
import FRHooks from "frhooks";
import { Paper, Button } from "@mui/material";
import { Refresh } from "@mui/icons-material";
import moment from "moment";
import MainTemplate from "@components/templates/MainTemplate";
import * as utils from "@utils/";
import DataTable from "../../../components/base/table/DataTable";
import apiRoute from "@services/apiRoute";

const columns = () => [
  {
    label: "Tangal",
    value: (value) => `${moment(value.startDate).format("DD-MM-yyyy")}`,
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
];

export default () => {
  const table = FRHooks.useTable(apiRoute.inventoryUsing.report, {
    selector: (resp) => resp.data,
    total: (resp) => resp.meta.total,
  });

  useEffect(() => {
    table.setQuery({ type: "MATERIAL" });
  }, []);

  return (
    <MainTemplate
      title="Laporan Inventori"
      subtitle={`Laporan penggunaan inventori`}
      headRight={{
        children: (
          <Button
            disabled={table.loading}
            variant="outlined"
            startIcon={<Refresh />}
            onClick={table.reload}
          >
            Muat Ulang
          </Button>
        ),
      }}
    >
      <Paper elevation={0} variant="outlined">
        <DataTable
          tableProps={{
            sx: {
              "& th": {
                backgroundColor: "#f4f4f4",
              },
            },
          }}
          data={table.data}
          loading={table.loading}
          column={columns()}
          pagination={utils.pagination(table.pagination)}
        />
      </Paper>
    </MainTemplate>
  );
};
