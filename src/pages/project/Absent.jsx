import React from "react";
import {
  Button,
  Grid,
  ListItem,
  ListItemText,
  Paper,
  List,
  Stack,
  Card,
  CardHeader,
  Divider,
  Avatar,
  Popper,
  ListItemButton,
  TextField,
  Skeleton,
  Typography,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { ExpandMore, KeyboardArrowRight } from "@mui/icons-material";
import { Select } from "@components/base";
import ProjectTemplate from "@components/templates/ProjectTemplate";
import FRHooks from "frhooks";
import * as utils from "@utils";
import _ from "lodash";
import moment from "moment";

export default () => {
  const { id } = useParams();
  const [open, setOpen] = React.useState(false);
  const [data, setData] = React.useState({});
  const [absentAt, setAbsentAt] = React.useState("");
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [trigger, setTrigger] = React.useState({
    openDrawer: false,
  });

  const absents = FRHooks.useFetch(
    FRHooks.apiRoute().project("listAbsents", { id }).link(),
    {
      defaultValue: [],
      selector: (resp) => resp.data,
      getData: () => {
        setAnchorEl(null);
        setOpen(false);
        setAbsentAt("");
      },
    }
  );

  const onOpenDrawer = () => {
    setTrigger((state) => ({ ...state, openDrawer: !state.openDrawer }));
  };

  const handleClick = (value) => (event) => {
    const current = anchorEl;
    const ids = event.currentTarget.id;
    setAnchorEl((state) =>
      state && state.id === ids ? null : event.currentTarget
    );
    setOpen(!current ? true : current.id === ids ? false : true);
    setAbsentAt(moment(value).format("yyyy-MM-DD"));
  };

  return (
    <ProjectTemplate
      title="Absensi"
      subtitle="Menampilkan daftar absen berdasarkan tanggal"
      drawer={{
        open: trigger.openDrawer,
        title: "Detil Absensi Proyek",
        onClose: () => {
          setTrigger((state) => ({ ...state, openDrawer: !state.openDrawer }));
        },

        content: (
          <Stack direction="column">
            <ListItemText
              primary={data.name || ""}
              secondary={utils.typesLabel(data.role || "")}
              primaryTypographyProps={{
                variant: "subtitle1",
              }}
              secondaryTypographyProps={{
                variant: "subtitle1",
              }}
              sx={{ my: 0, pl: 2 }}
            />
            <Divider />
            <ListItemText
              primary="Tanggal"
              secondary={moment(data.absentAt).format("DD-MM-Y")}
              primaryTypographyProps={{
                variant: "subtitle1",
              }}
              secondaryTypographyProps={{
                variant: "subtitle1",
              }}
              sx={{ my: 0, pl: 2 }}
            />
            <Divider />
            <Stack direction="row" spacing={1}>
              <ListItemText
                primary="Total"
                secondary={data.summary?.total || 0}
                primaryTypographyProps={{
                  variant: "subtitle1",
                  sx: { textAlign: "center" },
                }}
                secondaryTypographyProps={{
                  variant: "subtitle1",
                  sx: { textAlign: "center" },
                }}
                sx={{ my: 0 }}
              />
              <Divider orientation="vertical" />
              <ListItemText
                primary="Hadir"
                secondary={data.summary?.present || 0}
                primaryTypographyProps={{
                  variant: "subtitle1",
                  sx: { textAlign: "center" },
                }}
                secondaryTypographyProps={{
                  variant: "subtitle1",
                  sx: { textAlign: "center" },
                }}
                sx={{ my: 0 }}
              />
              <Divider orientation="vertical" />
              <ListItemText
                primary="Absen"
                secondary={data.summary?.absent || 0}
                primaryTypographyProps={{
                  variant: "subtitle1",
                  sx: { textAlign: "center" },
                }}
                secondaryTypographyProps={{
                  variant: "subtitle1",
                  sx: { textAlign: "center" },
                }}
                sx={{ my: 0 }}
              />
              <Divider orientation="vertical" />
              <ListItemText
                primary="Belum"
                secondary={data.summary?.noAbsent || 0}
                primaryTypographyProps={{
                  variant: "subtitle1",
                  sx: { textAlign: "center" },
                }}
                secondaryTypographyProps={{
                  variant: "subtitle1",
                  sx: { textAlign: "center" },
                }}
                sx={{ my: 0 }}
              />
            </Stack>
            <Divider />
            <List dense>
              <ListItem dense divider>
                <ListItemText
                  primary="Anggota"
                  primaryTypographyProps={{ sx: { fontWeight: 600 } }}
                />
              </ListItem>
              {Object.keys(data).length > 0 && data.members
                ? data.members.map((val, idx) => (
                    <ListItem
                      key={idx}
                      divider={idx !== data.members.length - 1}
                    >
                      <ListItemText
                        primary={val.name}
                        primaryTypographyProps={{ sx: { fontWeight: 600 } }}
                        secondary={`${utils.typesLabel(val.role)} | ${
                          val.absent
                        }`}
                        sx={{ my: 0 }}
                      />
                    </ListItem>
                  ))
                : null}
            </List>
          </Stack>
        ),
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" spacing={1}>
              <Select
                name="month"
                value={absents.getQuery("month", moment().format("M") - 1)}
                menu={utils.monthID.map((v, i) => ({ text: v, value: i + 1 }))}
                setValue={absents.setQuery}
              />
              <TextField
                value={absents.getQuery("year", moment().format("Y"))}
                onChange={(e) => absents.setQuery({ year: +e.target.value })}
              />
            </Stack>

            <Typography>{`${utils.getMonth(absents.getQuery("month", moment().format("M"))-1)} - ${absents.getQuery("year", moment().format("Y"))}`}</Typography>
          </Stack>
        </Grid>
        <Grid container item xs={14} columns={14} spacing={1}>
          {utils
            .getDaysInMonthUTC(
              absents.getQuery("month", moment().format("M")),
              absents.getQuery("year", moment().format("Y"))
            )
            .map((v, i) => (
              <Grid item key={i} xs={2}>
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
                    color={
                      anchorEl && anchorEl.id === `btn${i}`
                        ? "warning"
                        : "inherit"
                    }
                    endIcon={
                      absents.data.some(
                        (_v) => _v.absentAt === moment(v).format("yyyy-MM-DD")
                      ) ? (
                        anchorEl && anchorEl.id === `btn${i}` ? (
                          <ExpandMore />
                        ) : (
                          <KeyboardArrowRight />
                        )
                      ) : undefined
                    }
                    fullWidth
                    onClick={handleClick(v)}
                  >
                    {absents.loading ? (
                      <Skeleton width="100%" />
                    ) : !absents.data.some(
                        (_v) => _v.absentAt === moment(v).format("yyyy-MM-DD")
                      ) ? (
                      "Absen Belum Tersedia"
                    ) : (
                      "Lihat Detail"
                    )}
                  </Button>
                </Card>
              </Grid>
            ))}
        </Grid>
      </Grid>

      <Popper id={anchorEl?.id} open={open} anchorEl={anchorEl}>
        <Paper
          sx={(theme) => ({
            minWidth: 200,
            boxShadow: theme.shadows[15],
          })}
        >
          <List dense>
            {absents.data
              .filter((v) => v.absentAt === absentAt)
              .map((v, i) => (
                <ListItemButton
                  key={i}
                  dense
                  onClick={async () => {
                    onOpenDrawer();
                    const absent = await FRHooks.apiRoute()
                      .project("detilAbsent", { id, parent: v.parentId })
                      .params({ date: v.absentAt })
                      .get((resp) => resp.data);
                    setData({ name: v.name, role: v.role, ...absent });
                  }}
                >
                  <ListItemText
                    sx={{ my: 0 }}
                    primary={v.name || ""}
                    secondary={utils.typesLabel(v.role) || ""}
                  />
                </ListItemButton>
              ))}
          </List>
        </Paper>
      </Popper>
    </ProjectTemplate>
  );
};
