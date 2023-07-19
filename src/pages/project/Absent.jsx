import React from "react";
import {
  Button,
  Grid,
  ListItemText,
  List,
  Stack,
  Card,
  CardHeader,
  Divider,
  Avatar,
  TextField,
  Skeleton,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
  TableContainer,
  ListItem,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { KeyboardArrowRight } from "@mui/icons-material";
import { Select } from "@components/base";
import ProjectTemplate from "@components/templates/ProjectTemplate";
import FRHooks from "frhooks";
import * as utils from "@utils";
import _ from "lodash";
import moment from "moment";

export default () => {
  const { id } = useParams();
  const [data, setData] = React.useState({});
  const [absentAt, setAbsentAt] = React.useState("");
  const [trigger, setTrigger] = React.useState({
    openDrawer: false,
    openTable: -1,
  });

  const absents = FRHooks.useFetch(
    FRHooks.apiRoute().project("listAbsents", { id }).link(),
    {
      defaultValue: [],
      selector: (resp) => resp.data,
      getData: () => {
        setAbsentAt("");
      },
    }
  );

  const onOpenDrawer = () => {
    setTrigger((state) => ({ ...state, openDrawer: !state.openDrawer }));
  };

  const handleClick = (value) => (event) => {
    setAbsentAt(moment(value).format("yyyy-MM-DD"));
    onOpenDrawer();
  };

  return (
    <ProjectTemplate
      title="Absensi"
      subtitle="Menampilkan daftar absen berdasarkan tanggal"
      drawer={{
        open: trigger.openDrawer,
        title: "Absensi Proyek",
        onClose: () => {
          setData({});
          setTrigger((state) => ({
            ...state,
            openDrawer: !state.openDrawer,
            openTable: -1,
          }));
        },

        drawerProps: {
          PaperProps: {
            sx: {
              width: {
                xs: "100%",
                sm: "100%",
                md: "100%",
                lg: Object.keys(data).length === 0 ? "30%" : "80%",
                xl: Object.keys(data).length === 0 ? "30%" : "80%",
              },
            },
          },
        },
        content: (
          <Stack
            direction="row"
            justifyContent="flex-end"
            height="100%"
            overflow="auto"
          >
            <Box
              sx={(theme) => ({
                width: "0%",
                overflow: "hidden",
                ...(trigger.openTable > 0 && {
                  width: "65%",
                  transition: theme.transitions.create("width", {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.leavingScreen,
                  }),
                }),
              })}
            >
              <TableContainer>
                <Table size="small" sx={{ width: "100%" }}>
                  <TableHead>
                    <TableRow>
                      <TableCell padding="checkbox">No</TableCell>
                      <TableCell>Nama</TableCell>
                      <TableCell align="center">Role</TableCell>
                      <TableCell align="center">Tanggal</TableCell>
                      <TableCell align="center">Datang</TableCell>
                      <TableCell align="center">Pulang</TableCell>
                      <TableCell align="center">Keterangan</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {Object.keys(data).length > 0 && data.members ? (
                      data.members.map((val, idx) => (
                        <TableRow
                          key={idx}
                          selected={trigger.openTable === val.workerId}
                        >
                          <TableCell align="center">{idx + 1}</TableCell>
                          <TableCell>{val.name}</TableCell>
                          <TableCell align="center">
                            {utils.typesLabel(val.role)}
                          </TableCell>
                          <TableCell align="center">
                            {moment(val.absentAt).format("DD-MM-yyyy")}
                          </TableCell>
                          <TableCell align="center">
                            {val.comeAt || "-"}
                          </TableCell>
                          <TableCell align="center">
                            {val.closeAt || "-"}
                          </TableCell>
                          <TableCell align="center">
                            {val.absent === "P" ? "Bekerja" : "Tidak Bekerja"}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} align="center">
                          Tidak Ada Absent
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
            <Divider flexItem orientation="vertical" />
            <div style={{ width: trigger.openTable > 0 ? "35%" : "100%" }}>
              <List dense>
                {absents.data
                  .filter((v) => v.absentAt === absentAt)
                  .map((v, i) => (
                    <ListItem
                      key={i}
                      dense
                      divider
                      selected={trigger.openTable === v.parentId}
                      secondaryAction={
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={async () => {
                            const absent = await FRHooks.apiRoute()
                              .project("detilAbsent", {
                                id,
                                parent: v.parentId,
                              })
                              .params({ date: v.absentAt })
                              .get((resp) => resp.data);
                            setData(absent);
                            setTrigger((state) => ({
                              ...state,
                              openTable: v.parentId,
                            }));
                          }}
                          color="primary"
                        >
                          Lihat Detil
                        </Button>
                      }
                    >
                      <ListItemText
                        sx={{ my: 0 }}
                        primary={v.name || ""}
                        secondary={utils.typesLabel(v.role) || ""}
                      />
                    </ListItem>
                  ))}
              </List>
            </div>
          </Stack>
        ),
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Stack direction="row" spacing={1}>
              <Select
                name="month"
                value={absents.getQuery("month", moment().month() + 1)}
                menu={utils.monthID.map((v, i) => ({ text: v, value: i + 1 }))}
                onChange={(e) => absents.setQuery({ month: +e.target.value })}
              />
              <TextField
                value={absents.getQuery("year", moment().year())}
                onChange={(e) => absents.setQuery({ year: +e.target.value })}
              />
            </Stack>

            <Typography>{`${utils.getMonth(
              absents.getQuery("month")
                ? absents.getQuery("month") - 1
                : moment().month()
            )} - ${absents.getQuery("year", moment().year())}`}</Typography>
          </Stack>
        </Grid>
        <Grid container item xs={14} columns={14} spacing={1}>
          {utils
            .getDaysInMonthUTC(
              absents.getQuery("month", moment().month() + 1),
              absents.getQuery("year", moment().year())
            )
            .map((v, i) => (
              <Grid item key={i} xs={7} sm={7} md={7} lg={2} xl={2}>
                <Card>
                  <CardHeader
                    avatar={
                      <Avatar
                        variant="square"
                        sx={{
                          backgroundColor: !absents.data.some(
                            (_v) =>
                              _v.absentAt === moment(v).format("yyyy-MM-DD")
                          )
                            ? "inherit.main"
                            : "warning.main",
                        }}
                      >
                        {moment(v).format("DD")}
                      </Avatar>
                    }
                    title={utils.getDayName(moment(v).format("d"))}
                    subheader={moment(v).format("MM/YYYY")}
                    titleTypographyProps={{ variant: "subtitle2" }}
                    subheaderTypographyProps={{ sx: { whiteSpace: "nowrap" } }}
                    sx={{ p: 0.5 }}
                  />
                  <Divider />
                  <Button
                    id={`btn${i}`}
                    disabled={
                      !absents.data.some(
                        (_v) => _v.absentAt === moment(v).format("yyyy-MM-DD")
                      )
                    }
                    aria-describedby={`btn${i}`}
                    variant={"text"}
                    size="small"
                    color={"inherit"}
                    endIcon={<KeyboardArrowRight />}
                    fullWidth
                    onClick={handleClick(v)}
                  >
                    {absents.loading ? (
                      <Skeleton width="100%" />
                    ) : !absents.data.some(
                        (_v) => _v.absentAt === moment(v).format("yyyy-MM-DD")
                      ) ? (
                      "Belum Tersedia"
                    ) : (
                      "Lihat Detail"
                    )}
                  </Button>
                </Card>
              </Grid>
            ))}
        </Grid>
      </Grid>
    </ProjectTemplate>
  );
};
