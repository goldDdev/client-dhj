import { Navigate, useLocation } from "react-router-dom";

const RequireAuth = ({ page }) => {
  const location = useLocation();
  const toket = localStorage.getItem("token");

  if (!toket) {
    return (
      <Navigate to={'/login'} state={{ from: location }} replace />
    );
  }

  return page;
};

export default RequireAuth;
