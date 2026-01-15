import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = () => {
  const { token } = useSelector((state) => state.auth);
  if (token) {
    return <Navigate to="/users" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
