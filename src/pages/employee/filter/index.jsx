import * as MUI from "@mui/material";
import * as icon from "@mui/icons-material";
import * as utils from "@utils/";
import _ from "lodash";

export const TableFilter = ({ t, table }) => {
  return (
    <MUI.Stack mb={2} direction="column" spacing={1}>
      <MUI.Stack direction="row" spacing={1} alignItems="center">
        <MUI.Paper elevation={0}>
          <MUI.TextField
            value={table.query("name", "")}
            placeholder={t("search")}
            onChange={(e) => table.setQuery({ name: e.target.value })}
            InputProps={{
              startAdornment: (
                <MUI.InputAdornment position="start">
                  <icon.Search />
                </MUI.InputAdornment>
              ),
            }}
          />
        </MUI.Paper>
        <MUI.Paper elevation={0} sx={{ width: { xs: "100%", sm: "10%" } }}>
          <MUI.TextField
            value={table.query("status", "")}
            onChange={(e) => table.setQuery({ status: e.target.value })}
            select
          >
            <MUI.MenuItem value="" selected>
              {t("choose")}
            </MUI.MenuItem>
            <MUI.MenuItem value="ACTIVE">{t("ACTIVE")}</MUI.MenuItem>
            <MUI.MenuItem value="INACTIVE">{t("INACTIVE")}</MUI.MenuItem>
          </MUI.TextField>
        </MUI.Paper>
        <MUI.Paper elevation={0} sx={{ width: { xs: "100%", sm: "12%" } }}>
          <MUI.TextField
            value={table.query("role", "")}
            onChange={(e) => table.setQuery({ role: e.target.value })}
            select
          >
            <MUI.MenuItem value="" selected>
              {t("choose")}
            </MUI.MenuItem>
            {utils.types.map((v) => (
              <MUI.MenuItem key={v} value={v}>
                {t(v)}
              </MUI.MenuItem>
            ))}
          </MUI.TextField>
        </MUI.Paper>
      </MUI.Stack>

      {Object.keys(table.queryParams).length === 0 ? null : (
        <MUI.Stack direction="row" mt={1} spacing={1} alignItems="center">
          <MUI.Typography>{t("searchResult")} :</MUI.Typography>
          <MUI.Box flexGrow={1}>
            {Object.entries(table.queryParams).map(([k, v]) => (
              <MUI.Chip
                key={k}
                label={t(v)}
                size="small"
                variant="outlined"
                color="primary"
                sx={{ ml: 0.5 }}
                clickable
                onDelete={() => table.clearOnly([k])}
              />
            ))}
          </MUI.Box>
        </MUI.Stack>
      )}
    </MUI.Stack>
  );
};
