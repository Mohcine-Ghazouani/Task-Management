import { axiosClient } from "../api/axios";
import { useEffect, useState } from "react";
import { UseUserContext } from "../context/UserContext";

export default function Users() {
  const { users , setUsers} = UseUserContext();
  
  useEffect(() => {
    axiosClient.get("/users").then(({ data }) => {
      setUsers(data.users);
    });
    
  }, []);

  return (
    <>
      <div className="container my-4 space-y-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Users List</h2>
          <button className="px-4 py-2 text-sm font-semibold  text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none">
            Add User
          </button>
        </div>
        {users.map((user, index) => (
          <div key={index} className="border p-4 rounded-lg bg-white shadow">
            <table className="table-auto w-full">
              <tbody>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium text-gray-700 w-1/3">
                    Name:
                  </th>
                  <td className=" text-gray-600">{user.name}</td>
                </tr>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium text-gray-700">
                    Email:
                  </th>
                  <td className=" text-gray-600">{user.email}</td>
                </tr>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium text-gray-700">
                    Role:
                  </th>
                  <td className=" text-gray-600">{user.role}</td>
                </tr>
                <tr>
                  <th className="text-left p-3 font-medium text-gray-700">
                    Team:
                  </th>
                  <td className=" text-gray-600">
                    {user.team ? (
                      user.team.name
                    ) : (
                      <p className="text-red-500">No Team</p>
                    )}
                  </td>
                </tr>
                <tr>
                  <td colSpan="2" className="pt-4 text-center">
                    <button className="px-4 py-2 mr-2 text-xs font-semibold text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none">
                      Edit
                    </button>
                    <button className="px-4 py-2 text-xs font-semibold text-white bg-red-500 rounded hover:bg-red-600 focus:outline-none">
                      Delete
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </>
  );
}
