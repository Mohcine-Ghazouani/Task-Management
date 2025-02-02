import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { UseUserContext } from "../context/UserContext";
import UserApi from "../services/Api/User/UserApi";
import { ADMIN_DASHBOARD_ROUTE, DASHBOARD_ROUTE } from "../router";

export default function GuestLayout() {
  const isMobile = window.innerWidth < 768;
  const context = UseUserContext();
  const navigate = useNavigate();
  useEffect(() => {
    UserApi.getUser().then(({ data }) => {
      context.setUser(data);
    });
  }, [context]);

    useEffect(() => {
    if (context.authenticated) {
      const { role } = context.user;
      switch (role) {
        case "Member":
          navigate(DASHBOARD_ROUTE);
          break;
        case "Admin":
          navigate(ADMIN_DASHBOARD_ROUTE);
          break;
      }
    }
  }, [context]);
  return (
    <>
      <main
        className={`main flex-grow transition-all duration-300 ease-in-out 
              ${isMobile ? "mx-4" : ""}`}
      >
        <Outlet />
      </main>
    </>
  );
}
