import React from "react";
import MainTemplate from "@components/templates/MainTemplate";
import { Grid, Paper } from "@mui/material";
import * as BASE from "@components/";

import FRHooks from "frhooks";
import moment from "moment";
import useDropdown from "@hooks/useDropdown";
import FilterBoard from "./FilterBoard";

const data0 = [...Array(5)].map(() => ({
  companyName: "PT DUTA HITA JAYA",
  title:
    "Pembuatan Jalan Pengembangan wilayah metropolitan Palembang, Banjarmasin, Makassar, dan Denpasar",
  status: "DRAFT",
  startAt: moment().format("DD/MM/Y"),
}));

const data1 = [...Array(3)].map(() => ({
  companyName: "PT DUTA HITA JAYA",
  title:
    "Pembuatan Jalan Pengembangan wilayah metropolitan Palembang, Banjarmasin, Makassar, dan Denpasar",
  status: "DRAFT",
  startAt: moment().format("DD/MM/Y"),
}));

const data2 = [...Array(3)].map(() => ({
  companyName: "PT DUTA HITA JAYA",
  title:
    "Pembuatan Jalan Pengembangan wilayah metropolitan Palembang, Banjarmasin, Makassar, dan Denpasar",
  status: "DRAFT",
  startAt: moment().format("DD/MM/Y"),
}));

export default () => {
  const { t } = FRHooks.useLang();
  const dropdown = useDropdown({
    menu: [
      {
        text: t("PROGRESS"),
        divider: true,
        onClick: () => {},
      },
      {
        text: t("edit"),
        divider: true,
        onClick: () => {},
      },
      {
        text: t("delete"),
        onClick: () => {},
      },
    ],
  });
  return (
    <MainTemplate title={t("projectBoard")} subtitle={t("projectTitlePage")}>
      <Grid container columnSpacing={3}>
        <Grid item xs={3}>
          <BASE.TitleBoard
            title={t("DRAFT")}
            divider={true}
            total={data0.length}
          />
          <BASE.ListBoard data={data0} keys="draft" dropdown={dropdown} />
        </Grid>
        <Grid item xs={3}>
          <BASE.TitleBoard
            title={t("PROGRESS")}
            divider={true}
            total={data1.length}
          />
          <BASE.ListBoard data={data1} keys="progress" dropdown={dropdown} />
        </Grid>
        <Grid item xs={3}>
          <BASE.TitleBoard
            title={t("DONE")}
            divider={true}
            total={data2.length}
          />
          <BASE.ListBoard data={data2} keys="done" dropdown={dropdown} />
        </Grid>
      </Grid>
    </MainTemplate>
  );
};
