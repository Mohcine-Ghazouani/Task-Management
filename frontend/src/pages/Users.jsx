import { useEffect, useState } from "react";
import { UseUserContext } from "../context/UserContext";
import { axiosClient } from "../api/axios";
import UserApi from "../services/Api/User/UserApi";


export default function Users() {
  const { users, setUsers } = UseUserContext();
  const [editingUserId, setEditingUserId] = useState(null);
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);

  useEffect(() => {
    axiosClient.get("/users").then(({ data }) => {
      setUsers(data.users);
    });

    axiosClient.get("/teams").then(({ data }) => {
      setTeams(data.teams); 
    });
  }, [ users]);

  const handleDelete = (id) => {

    if (confirm("Are you sure you want to delete this user?")) {
      UserApi.deleteUser(id)
        .then(() => {
          setUsers(users.filter((user) => user.id !== id));
        })
        .catch((error) => {
          console.error("Error deleting user:", error);
        });
    }
  };

  const handleEdit = (userId, currentTeamId) => {
    setEditingUserId(userId);
    setSelectedTeam(currentTeamId);
  };

  const handleUpdate = (userId) => {
    UserApi.updateUser(userId, { team_id: selectedTeam })
      .then(({ data }) => {
        setUsers((prevUsers) =>
          prevUsers.map((user) => (user.id === userId ? data.user : user))
        );
        setEditingUserId(null);

      })
      .catch((error) => {
        console.error("Error updating user:", error);
      });
  };
  const handleDiscard = () => {
    setEditingUserId(null);
    setSelectedTeam({});
  };

  return (
    <div className="container my-4 space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Users List</h2>
        <button className="px-4 py-2 text-sm font-semibold text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none">
          Add User
        </button>
      </div>
      {users.map((user) => (
        <div key={user.id} className="border p-4 rounded-lg bg-white shadow">
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
                  {editingUserId === user.id ? (
                    <select
                      className="border p-2 rounded"
                      value={selectedTeam || ""}
                      onChange={(e) => setSelectedTeam(e.target.value)}
                    >
                      <option value="" disabled>
                        Select a team
                      </option>
                      {teams.map((team) => (
                        <option key={team.id} value={team.id}>
                          {team.name}
                        </option>
                      ))}
                    </select>
                  ) : user.team ? (
                    user.team.name
                  ) : (
                    <p className="text-red-500">No Team</p>
                  )}
                </td>
              </tr>
              <tr>
                <td colSpan="2" className="pt-4 text-center">
                {editingUserId === user.id ? (
                      <>
                        <button
                          onClick={() => handleUpdate(user.id)}
                          className="px-4 py-2 mr-2 text-xs font-semibold text-white bg-green-500 rounded hover:bg-green-600 focus:outline-none"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleDiscard}
                          className="px-4 py-2 text-xs font-semibold text-white bg-gray-500 rounded hover:bg-gray-600 focus:outline-none"
                        >
                          Discard
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEdit(user.id, user.team?.id || null)}
                          className="px-4 py-2 mr-2 text-xs font-semibold text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="px-4 py-2 text-xs font-semibold text-white bg-red-500 rounded hover:bg-red-600 focus:outline-none"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  {/* {editingUserId === user.id ? (
                    <button
                      onClick={() => handleDone(user.id)}
                      className="px-4 py-2 mr-2 text-xs font-semibold text-white bg-green-500 rounded hover:bg-green-600 focus:outline-none"
                    >
                      Done
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEdit(user.id, user.team?.id || null)}
                      className="px-4 py-2 mr-2 text-xs font-semibold text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none"
                    >
                      Edit
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="px-4 py-2 text-xs font-semibold text-white bg-red-500 rounded hover:bg-red-600 focus:outline-none"
                  >
                    Delete
                  </button> */}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}














// import { useEffect } from "react";
// import { UseUserContext } from "../context/UserContext";
// import {axiosClient} from "../api/axios";
// import UserApi from "../services/Api/User/UserApi";


// export default function Users() {
//   const { users, setUsers,  updateUser } = UseUserContext();

//   useEffect(() => {
//     axiosClient.get("/users").then(({ data }) => {
//       setUsers(data.users);
//     });
//   }, []);
//   console.log(users);

//   const handleDelete = (id) => {
//     if (confirm("Are you sure you want to delete this user?")) {
//       UserApi.deleteUser(id).then(() => {
//         setUsers(users.filter((user) => user.id !== id));
//       }).catch((error) => {
//         console.error("Error deleting user:", error);
        
//       })
      
//     }
//   };

//   const handleUpdate = (id) => {
//     const newName = prompt("Enter new name:");
//     if (newName) {
//       updateUser(id);
//     }
//   };

//   return (
//     <div className="container my-4 space-y-4">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-xl font-bold text-gray-800">Users List</h2>
//         <button className="px-4 py-2 text-sm font-semibold text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none">
//           Add User
//         </button>
//       </div>
//       {users.map((user) => (
//         <div key={user.id} className="border p-4 rounded-lg bg-white shadow">
//           <table className="table-auto w-full">
//             <tbody>
//               <tr className="border-b">
//                 <th className="text-left p-3 font-medium text-gray-700 w-1/3">
//                   Name:
//                 </th>
//                 <td className=" text-gray-600">{user.name}</td>
//               </tr>
//               <tr className="border-b">
//                 <th className="text-left p-3 font-medium text-gray-700">
//                   Email:
//                 </th>
//                 <td className=" text-gray-600">{user.email}</td>
//               </tr>
//               <tr className="border-b">
//                 <th className="text-left p-3 font-medium text-gray-700">
//                   Role:
//                 </th>
//                 <td className=" text-gray-600">{user.role}</td>
//               </tr>
//               <tr>
//                 <th className="text-left p-3 font-medium text-gray-700">
//                   Team:
//                 </th>
//                 <td className=" text-gray-600">
//                   {user.team ? user.team.name : <p className="text-red-500">No Team</p>}
//                 </td>
//               </tr>
//               <tr>
//                 <td colSpan="2" className="pt-4 text-center">
//                   <button
//                     onClick={() => handleUpdate(user.id)}
//                     className="px-4 py-2 mr-2 text-xs font-semibold text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none"
//                   >
//                     Edit
//                   </button>
//                   <button
//                     onClick={() => handleDelete(user.id)}
//                     className="px-4 py-2 text-xs font-semibold text-white bg-red-500 rounded hover:bg-red-600 focus:outline-none"
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             </tbody>
//           </table>
//         </div>
//       ))}
//     </div>
//   );
// }

















// import { axiosClient } from "../api/axios";
// import { useEffect, useState } from "react";
// import { UseUserContext } from "../context/UserContext";

// export default function Users() {
//   const { users , setUsers} = UseUserContext();
  
//   useEffect(() => {
//     axiosClient.get("/users").then(({ data }) => {
//       setUsers(data.users);
//     });
    
//   }, []);

//   return (
//     <>
//       <div className="container my-4 space-y-4">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-bold text-gray-800">Users List</h2>
//           <button className="px-4 py-2 text-sm font-semibold  text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none">
//             Add User
//           </button>
//         </div>
//         {users.map((user, index) => (
//           <div key={index} className="border p-4 rounded-lg bg-white shadow">
//             <table className="table-auto w-full">
//               <tbody>
//                 <tr className="border-b">
//                   <th className="text-left p-3 font-medium text-gray-700 w-1/3">
//                     Name:
//                   </th>
//                   <td className=" text-gray-600">{user.name}</td>
//                 </tr>
//                 <tr className="border-b">
//                   <th className="text-left p-3 font-medium text-gray-700">
//                     Email:
//                   </th>
//                   <td className=" text-gray-600">{user.email}</td>
//                 </tr>
//                 <tr className="border-b">
//                   <th className="text-left p-3 font-medium text-gray-700">
//                     Role:
//                   </th>
//                   <td className=" text-gray-600">{user.role}</td>
//                 </tr>
//                 <tr>
//                   <th className="text-left p-3 font-medium text-gray-700">
//                     Team:
//                   </th>
//                   <td className=" text-gray-600">
//                     {user.team ? (
//                       user.team.name
//                     ) : (
//                       <p className="text-red-500">No Team</p>
//                     )}
//                   </td>
//                 </tr>
//                 <tr>
//                   <td colSpan="2" className="pt-4 text-center">
//                     <button className="px-4 py-2 mr-2 text-xs font-semibold text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none">
//                       Edit
//                     </button>
//                     <button className="px-4 py-2 text-xs font-semibold text-white bg-red-500 rounded hover:bg-red-600 focus:outline-none">
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               </tbody>
//             </table>
//           </div>
//         ))}
//       </div>
//     </>
//   );
// }
