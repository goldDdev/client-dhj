import Search from "@mui/icons-material/Search";
import { Paper, Stack, TextField } from "@mui/material";

export const TableFilter = ({ table }) => {
  return (
    <Stack mb={2} direction="column" spacing={1}>
      <Stack
        direction={{
          xs: "column",
          sm: "column",
          md: "column",
          lg: "row",
          xl: "row",
        }}
        alignItems={{
          xs: "flex-start",
          sm: "flex-start",
          md: "flex-start",
          lg: "center",
          xl: "center",
        }}
        spacing={1}
      >
        <Paper elevation={0}>
          <TextField
            fullWidth
            value={table.query("name", "")}
            placeholder="Cari"
            onChange={(e) => table.setQuery({ name: e.target.value })}
            InputProps={{
              startAdornment: <Search />,
            }}
          />
        </Paper>
      </Stack>
    </Stack>
  );
};
