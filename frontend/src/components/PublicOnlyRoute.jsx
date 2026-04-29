import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PublicOnlyRoute = ({ children }) => {
  const { token } = useSelector((state) => state.auth);

  if (token) {
    return <Navigate to="/admin-dashboard" replace />;
  }

  return children;
};

export default PublicOnlyRoute;