import { useEffect } from "react";
import { UseUserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { ADMIN_DASHBOARD_ROUTE } from "../router/index";

export default function Dashboard() {
  const { user }= UseUserContext();
  const navigate = useNavigate();
  useEffect(() => {
    if (user.role === "Admin") {
      navigate(ADMIN_DASHBOARD_ROUTE);
    }
  }, []);
  
  
  return (
    <>
      <div>
        <h1 className="text-2xl font-bold text-center"> {user.name}</h1>
      </div>
    </>
  );
}
