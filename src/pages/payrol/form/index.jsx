import {
  List,
  ListItemText,
  ListItem as MuiListItem,
  styled,
} from "@mui/material";
import * as utils from "@utils/";
import React from "react";

const ListItem = styled(MuiListItem)(({ theme }) => ({
  paddingTop: 0,
  paddingBottom: 0,
}));

export const Employee = ({ employee }) => {
  return (
    <List dense>
      <ListItem>
        <ListItemText primary={"Nama"} secondary={employee.name || "-"} />
      </ListItem>

      <ListItem>
        <ListItemText
          primary={"Role"}
          secondary={utils.typesLabel(employee.role)}
        />
      </ListItem>

      <ListItem>
        <ListItemText
          primary={"Karyawan ID"}
          secondary={employee.cardID || "-"}
        />
      </ListItem>
    </List>
  );
};
