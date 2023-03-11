import {
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
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
        ? data.map(({ itemAvatar, itemProps, iconProps, group, ...other }, i) => (
            <Box component="li" key={i}>
              <ListItem component="div" {...itemProps}>
                {itemAvatar ? <ListItemAvatar {...itemAvatar} /> : null}
                {iconProps ? <ListItemIcon {...iconProps} /> : null}
                <ListItemText {...other} />
              </ListItem>
              {group || null}
            </Box>
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
