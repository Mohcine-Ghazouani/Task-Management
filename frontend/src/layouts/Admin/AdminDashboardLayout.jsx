import { Outlet, useNavigate } from "react-router-dom";
import AdminNavbar from "../../components/AdminNavbar";
import AdminSidebar from "../../components/AdminSidebar";
import AdminFooter from "../../components/AdminFooter";

import { LOGIN_ROUTE } from "../../router/index";
import { useEffect, useState } from "react";
import { axiosClient } from "../../api/axios";
import { UseUserContext } from "../../context/UserContext";
import UserApi from "../../services/Api/User/UserApi";

export default function AdminDashbordLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = window.innerWidth < 768;

  const { user, setUser, authenticated, setAuthenticated, logout } =
    UseUserContext();

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  //const { role } = user;
  useEffect(() => {
    if (authenticated === true) {
      // if (role === "Member") {
      //   navigate(DASHBOARD_ROUTE);
      // }
      setIsLoading(false);
      UserApi.getUser()
        .then(({ data }) => {
          setUser(data);
          setAuthenticated(true);
        })
        .catch((reason) => {
          console.log(reason);
          logout();
        });
    } else {
      navigate(LOGIN_ROUTE);
    }
  }, [authenticated, navigate,logout, setUser, setAuthenticated]);

  const teamId = user.team_id;
  useEffect(() => {
    if (teamId) {
      axiosClient.get(`/teams/${teamId}`).then(({ data }) => {
        setUser((team) => ({ ...team, team: data.team.name }));
      });
    }
  }, [teamId, setUser]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col h-screen">
      <header>
        <AdminNavbar />
      </header>
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <main
        className={`main flex-grow transition-all duration-300 ease-in-out mt-20
          ${sidebarOpen && !isMobile ? "mx-52" : ""}
        ${!sidebarOpen && !isMobile ? "mx-20" : ""}
        ${isMobile ? "mx-4" : ""}`}
      >
        <h1 className="text-2xl font-bold text-center">{user.role}</h1>
        <Outlet />
      </main>
      <footer
        className={`bg-gray-600 text-white p-4 mt-8
          ${sidebarOpen && !isMobile ? "ml-48" : ""}
        ${!sidebarOpen && !isMobile ? "ml-16" : ""}
        ${isMobile ? "" : ""}`}
      >
        <AdminFooter />
      </footer>
    </div>
  );
}
