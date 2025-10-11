// src/router/ProtectedRoute.jsx
import { Navigate, useLocation } from "react-router-dom";
import { UseUserContext } from "../context/UserContext";
import { LOGIN_ROUTE } from "./index";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { authenticated, user, authLoading } = UseUserContext(); 
  // ^ If you don't have authLoading in context yet, see note below.
  const location = useLocation();

  // 1) Wait for auth to finish booting
  if (authLoading) {
    return (
      <div className="grid min-h-[40vh] place-items-center text-sm text-gray-600">
        Checking your session…
      </div>
    );
  }

  // 2) Not logged in → go to login, preserve where they tried to go
  if (!authenticated) {
    return <Navigate to={LOGIN_ROUTE} replace state={{ from: location }} />;
  }

  // 3) Role guard (defensive against missing role)
  if (allowedRoles?.length && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/not-authorized" replace />;
  }

  return children;
}
