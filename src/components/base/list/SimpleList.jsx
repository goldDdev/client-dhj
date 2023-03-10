import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Skeleton,
} from "@mui/material";

export default ({ loading, data, ...props }) => {
  return (
    <List dense {...props}>
      {loading ? (
        <ListItem>
          <Skeleton width="100%" />
        </ListItem>
      ) : null}

      {!loading && data.length > 0
        ? data.map(({ itemAvatar, itemProps, ...other }, i) => (
            <ListItem key={i} {...itemProps}>
              {itemAvatar ? <ListItemAvatar {...itemAvatar} /> : null}
              <ListItemText {...other} />
            </ListItem>
          ))
        : null}

      {!loading && data.length === 0 ? (
        <ListItem>
          <ListItemText primary="Data Tidak Tersedia" />
        </ListItem>
      ) : null}
    </List>
  );
};
