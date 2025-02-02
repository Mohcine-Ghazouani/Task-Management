import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import Footer from "../../components/Footer";
import { LOGIN_ROUTE } from "../../router/index";
import { useEffect, useState } from "react";
import { axiosClient } from "../../api/axios";
import { UseUserContext } from "../../context/UserContext";
import UserApi from "../../services/Api/User/UserApi";

export default function UserDashbordLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = window.innerWidth < 768;

  const { user, setUser, authenticated, setAuthenticated, logout } =
    UseUserContext();

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    //const { role } = user;

    if (authenticated === true) {
      // if (role === "Admin") {
      //   navigate(ADMIN_DASHBOARD_ROUTE);
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
          navigate(LOGIN_ROUTE);
        });
    } else {
      navigate(LOGIN_ROUTE);
    }
  }, [authenticated]);

  const teamId = user.team_id;
  useEffect(() => {
    if (teamId) {
      axiosClient.get(`/teams/${teamId}`).then(({ data }) => {
        setUser((team) => ({ ...team, team: data.team.name }));
      });
    }
  }, [teamId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col h-screen">
      <header>
        <Navbar />
      </header>
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <main
        className={`main flex-grow transition-all duration-300 ease-in-out mt-20
          ${sidebarOpen && !isMobile ? "ml-52 mr-20" : ""}
        ${!sidebarOpen && !isMobile ? "mx-20" : ""}
        ${isMobile ? "mx-4" : ""}`}
      >
        <h1 className="text-2xl font-bold text-center"> {user.name}</h1>
        <Outlet />
      </main>
      <footer
        className={`bg-gray-600 text-white p-4 mt-8 
                ${sidebarOpen && !isMobile ? "ml-48" : ""}
              ${!sidebarOpen && !isMobile ? "ml-16" : ""}
              ${isMobile ? "" : ""}`}
      >
        <Footer />
      </footer>
    </div>
  );
}
