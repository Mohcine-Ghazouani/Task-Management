import { Navigate } from "react-router-dom";
import { UseUserContext } from "../context/UserContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, authenticated } = UseUserContext();

  if (!authenticated) {
    // Redirect to login if the user is not authenticated
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Redirect to a "not authorized" page if the role is not allowed
    return <Navigate to="/not-authorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
