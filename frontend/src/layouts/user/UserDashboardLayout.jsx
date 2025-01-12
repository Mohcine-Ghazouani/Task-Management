import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { LOGIN_ROUTE } from "../../router/index";
import { useEffect, useState } from "react";
import { axiosClient } from "../../api/axios";
import { UseUserContext } from "../../context/UserContext";
import UserApi from "../../services/Api/User/UserApi";

export default function UserDashbordLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = window.innerWidth < 768;

  const { user, setUser, setAuthenticated, logout } = UseUserContext();

  const navigate = useNavigate();

  useEffect(() => {
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
  }, []);

  const teamId = user.team_id;
  useEffect(() => {
    if (teamId) {
      axiosClient.get(`/teams/${teamId}`).then(({ data }) => {
        setUser((team) => ({ ...team, team: data.team.name }));
      });
    }
  }, [teamId]);

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
        {/* <div className="container border p-2  mt-4 rounded-lg bg-white shadow">
          <table className="table-auto w-full">
            <tbody>
              <tr className="border-b">
                <th className="text-left p-3 font-medium text-gray-700">
                  Role:
                </th>
                <td className="p-3 text-gray-600">{user.role}</td>
              </tr>
              <tr className="border-b">
                <th className="text-left p-3 font-medium text-gray-700">
                  Name:
                </th>
                <td className="p-3 text-gray-600">{user.name}</td>
              </tr>
              <tr className="border-b">
                <th className="text-left p-3 font-medium text-gray-700">
                  Email:
                </th>
                <td className="p-3 text-gray-600">{user.email}</td>
              </tr>
              <tr>
                <th className="text-left p-3 font-medium text-gray-700">
                  Team:
                </th>
                <td className="p-3 text-gray-600">
                  {user.team ? (
                    user.team
                  ) : (
                    <p className="text-red-500">No Team</p>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div> */}

        <Outlet/>
      </main>
      {/* <footer>footer</footer> */}
    </>
  );
}
