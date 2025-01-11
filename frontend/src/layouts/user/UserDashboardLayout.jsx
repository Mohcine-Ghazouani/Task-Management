import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { LOGIN_ROUTE } from "../../router/index";
import { useEffect, useState } from "react";
import { axiosClient } from "../../api/axios";
import { UseUserContext } from "../../context/UserContext";

export default function UserDashbordLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = window.innerWidth < 768;

  const context = UseUserContext();
  const navigate = useNavigate();
  //const [users, setUsers] = useState([]);
  const [user, setUser] = useState([]);

  useEffect(() => {
    if (!context.authenticated) {
      navigate(LOGIN_ROUTE);
    }
    // axiosClient.get("/users").then(({ data }) => {
    //   setUsers(data.users);
    // });
    axiosClient.get("/user").then(({ data }) => {
      setUser(data);
    });
    
  }, []);
  const teamId = user.team_id;
useEffect(() => {
  
  if (teamId) {
    axiosClient.get(`/teams/${teamId}`).then(({ data }) => {
      setUser(team => ({...team, team: data.team.name}));
    });
  }
  
    
}, [teamId]);
// console.log(users);
console.log(user);

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
        <div className="container border p-2  mt-4 rounded-lg bg-white shadow">
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
        </div>

        {/* <Outlet/> */}
        {/* <div className="p-6 container mt-20  ">
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                    Name
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                    Email
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                    Role
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                    Team
                  </th>
                  <th className="px-4 py-2 text-center text-sm font-semibold text-gray-600">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr
                    key={index}
                    className={`${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-gray-100`}
                  >
                    <td className="px-4 py-2 text-sm text-gray-800">
                      {user.name}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-800">
                      {user.email}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-800">
                      {user.role}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-800">
                      {user.team ? user.team.name : <p className="text-red-500">No Team</p>}
                    </td>
                    <td className="px-4 py-2 text-center">
                      <button className="px-2 py-1 text-xs font-semibold text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none">
                        Edit
                      </button>
                      <button className="px-2 py-1 ml-2 text-xs font-semibold text-white bg-red-500 rounded hover:bg-red-600 focus:outline-none">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>  */}
      </main>
      {/* <footer>footer</footer> */}
    </>
  );
}
