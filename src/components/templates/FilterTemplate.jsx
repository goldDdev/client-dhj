import { Box, Button, Divider, Stack, Typography } from "@mui/material";
import { Breadcrumb, IconButton } from "@components/";
import { Filter, FilterAlt } from "@mui/icons-material";
import FilterBoard from "../../pages/project/FilterBoard";

const FilterTemplate = ({
  title,
  subtitle,
  breadcrumb,
  children,
  headRight,
}) => {
  document.title = title;
  return (
    <>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack direction="row" spacing={1} alignItems="center">
          <div>
            <IconButton size="small" title="filter">
              <FilterAlt fontSize="small" />
            </IconButton>
          </div>

          <div>
            <Button variant="text" color="inherit" size="small">
              Semua 100
            </Button>
          </div>

          <div>
            <Button variant="text" color="inherit" size="small">
              Draft 100
            </Button>
          </div>

          <div>
            <Button variant="text" color="inherit" size="small">
              Prgoress 100
            </Button>
          </div>

          <div>
            <Button variant="text" color="inherit" size="small">
              Selesai 100
            </Button>
          </div>
        </Stack>

        {headRight ? <Box {...headRight} /> : null}
      </Stack>

      <Divider sx={{ mt: 0.7 }} />

      <Box sx={{ mt: "24px" }}>{children}</Box>
    </>
  );
};

export default FilterTemplate;

FilterTemplate.defaultProps = {
  title: "",
  subtitle: "",
  breadcrumb: false,
};
