import { Navigate } from "react-router-dom";
import { UseUserContext } from "../context/UserContext";

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { user } = UseUserContext();

  if (!user) {
  
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
