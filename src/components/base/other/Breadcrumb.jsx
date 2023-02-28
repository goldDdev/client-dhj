import { Breadcrumbs, Link, Stack } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { ucword } from "@utils/";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

const Breadcrumb = () => {
  const router = window.location.pathname;
  const navigate = useNavigate();
  const location = useLocation();

  let pathArray = [];

  if (router) {
    const linkPath = router.split("/");
    linkPath.shift();

    pathArray = linkPath.map((path, i) => {
      return {
        breadcrumb: path,
        href: "/" + linkPath.slice(0, i + 1).join("/"),
      };
    });
  }

  const handleClick = (path) => (event) => {
    event.preventDefault();
    navigate(path, { state: { from: location }, replace: true });
  };

  const breadcrumbs = [
    <Link underline="hover" key="1" color="inherit" href="/">
      Beranda
    </Link>,
  ];

  if (pathArray.length > 0) {
    pathArray.map((value) =>
      breadcrumbs.push(
        <Link
          underline="hover"
          key="2"
          color="inherit"
          href={value.href}
          onClick={handleClick(value.href)}
        >
          {ucword(value.breadcrumb)}
        </Link>
      )
    );
  }

  return (
    <Stack
      spacing={2}
      sx={(theme) => ({
        [theme.breakpoints.between("xs", "md")]: {
          pl: "16px",
          pr: "16px",
        },
      })}
    >
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
      >
        {breadcrumbs}
      </Breadcrumbs>
    </Stack>
  );
};

export default Breadcrumb;
