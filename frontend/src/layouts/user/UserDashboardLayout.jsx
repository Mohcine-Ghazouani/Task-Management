import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { LOGIN_ROUTE } from "../../router/index";
import { useEffect, useState } from "react";
import { axiosClient } from "../../api/axios";
import { UseUserContext } from "../../context/UserContext";
import UserApi from "../../services/Api/User/UserApi";
import { set } from "zod";

export default function UserDashbordLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = window.innerWidth < 768;

  const { user, setUser, authenticated, setAuthenticated, logout } = UseUserContext();

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (authenticated === true) {
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
    }else{
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
    <>
      <header className="h-16">
        <Navbar />
      </header>
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <main
        className={`main flex-grow transition-all duration-300 ease-in-out 
          ${sidebarOpen && !isMobile ? "mx-52" : ""}
        ${!sidebarOpen && !isMobile ? "mx-20" : ""}
        ${isMobile ? "mx-4" : ""}`}
      >
        <Outlet />
      </main>
      {/* <footer>footer</footer> */}
    </>
  );
}
