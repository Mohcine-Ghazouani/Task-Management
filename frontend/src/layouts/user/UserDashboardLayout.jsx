import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { LOGIN_ROUTE } from "../../router/index";
import { useEffect, useState } from "react";
import { axiosClient } from "../../api/axios";

export default function UserDashbordLayout() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);


  useEffect(() => {
    if (!window.localStorage.getItem("ACCESS_TOKEN")) {
      navigate(LOGIN_ROUTE);
    }
    axiosClient.get("/users").then(({ data }) => {
      setUsers(data.users);
    });
  }, []);
  console.log(users);
  return (
    <>
      <header>
        <Navbar />
        <Sidebar />
      </header>
      <main className="main">
        {/* <Outlet /> */}
        <div className="p-6 container mt-20  ">
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
                      
                      {user.team_id ? user.team.name : <p className="text-red-500">No Team</p>}
                      
                      
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
        </div>
      </main>
      {/* <footer>footer</footer> */}
    </>
  );
}
