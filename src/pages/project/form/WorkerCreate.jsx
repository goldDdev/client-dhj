import { DialogForm } from "@components/base";
import { Add, Search } from "@mui/icons-material";
import {
  IconButton,
  List,
  ListItem,
  ListItemText,
  Skeleton,
  Stack,
  TextField,
} from "@mui/material";
import * as utils from "@utils/";
import React from "react";

const WorkerCreate = ({ trigger, onOpen, onAddMember, searchWorkers }) => (
  <DialogForm
    open={trigger.openWorker}
    onClose={onOpen("")}
    title="Cari Pekerja"
    maxWidth="sm"
    content={{
      sx: { px: 0, height: "480px" },
      children: (
        <Stack spacing={1.5} direction="column">
          <TextField
            fullWidth
            InputProps={{ startAdornment: <Search /> }}
            placeholder="Cari disini"
            value={searchWorkers.getQuery("name", "")}
            onChange={(e) => searchWorkers.setQuery({ name: e.target.value })}
            sx={{ px: 2 }}
          />

          <List dense sx={{ maxHeight: "480px", overflow: "auto" }}>
            {searchWorkers.loading ? (
              <ListItem>
                <Skeleton width="100%" />{" "}
              </ListItem>
            ) : null}

            {!searchWorkers.loading && !searchWorkers.isEmpty
              ? searchWorkers.data.map((v, index) => (
                  <ListItem
                    key={index}
                    divider
                    secondaryAction={
                      <IconButton size="small" onClick={onAddMember(v)}>
                        <Add fontSize="inherit" />
                      </IconButton>
                    }
                  >
                    <ListItemText
                      primary={v.name}
                      secondary={utils.typesLabel(v.role)}
                    />
                  </ListItem>
                ))
              : null}

            {!searchWorkers.loading && searchWorkers.isEmpty ? (
              <ListItem alignItems="center" divider>
                <ListItemText
                  primary="Oops data yang anda cari mungkin belum tersedia."
                  primaryTypographyProps={{ align: "center" }}
                  secondary="Atau anda dapat mencoba ketikkan pencarian lain"
                  secondaryTypographyProps={{ align: "center" }}
                />
              </ListItem>
            ) : null}
          </List>
        </Stack>
      ),
    }}
  />
);

export default WorkerCreate;
