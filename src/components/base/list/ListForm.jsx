import {
  ListItemText,
  ListItem as MuiListItem,
  Paper,
  Stack,
  styled,
} from "@mui/material";

const ListItem = styled(MuiListItem)(({ theme }) => ({
  paddingTop: 0,
  paddingBottom: 0,
}));

export default ({ title, subtitle, children, propsPrimary, ...props }) => {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      mt={1}
      px={2}
      component={Paper}
      variant="outlined"
      overflow="hidden"
      {...props}
    >
      <ListItemText
        primary={title}
        secondary={subtitle}
        sx={{ width: "50%" }}
        {...propsPrimary}
      />

      {children}
    </Stack>
  );
};
