import { useEffect, useState } from "react";
import { UseUserContext } from "../../context/UserContext";
import UserApi from "../../services/Api/User/UserApi";
import { useNavigate } from "react-router-dom";
import { Loader } from "lucide-react";

export default function Users() {
  const { users, setUsers } = UseUserContext();
  const [editingUserId, setEditingUserId] = useState(null);
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isloading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
    UserApi.getUsers().then(({ data }) => {
      setUsers(data.users);
      
    });

    UserApi.getTeams().then(({ data }) => {
      setTeams(data.teams);
    });
  }, [users]);

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

  const handleEdit = (userId, currentTeamId, currentRole) => {
    setEditingUserId(userId);
    setSelectedTeam(currentTeamId);
    setSelectedRole(currentRole);
  };

  const handleUpdate = (userId) => {
    setLoading(true);
    UserApi.updateUser(userId, { team_id: selectedTeam, role: selectedRole })
      .then(({ data }) => {
        setUsers((prevUsers) =>
          prevUsers.map((user) => (user.id === userId ? data.user : user))
        );
        setEditingUserId(null);
        setSelectedTeam(null);
        setSelectedRole("");
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error updating user:", error);
      });
  };

  const handleDiscard = () => {
    setEditingUserId(null);
    setSelectedTeam(null);
    setSelectedRole("");
  };

  return (
    <div className="container my-4 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">Users List</h2>
        <button
          onClick={() => navigate("/add-user")}
          className="px-4 py-2 text-sm font-semibold text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none"
        >
          Add User
        </button>
      </div>
      {isloading && (
          <div className="flex items-center justify-center">
            <p className="text-lg font-semibold text-gray-700">Loading tasks...</p>
            <Loader className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        )}
      {users
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .map((user) => (
        <div key={user.id} className="p-4 bg-white border rounded-lg shadow">
          <table className="w-full table-auto">
            <tbody>
              <tr className="border-b">
                <th className="w-1/3 p-3 font-medium text-left text-gray-700">
                  Name:
                </th>
                <td className="text-gray-600">{user.name}</td>
              </tr>
              <tr className="border-b">
                <th className="p-3 font-medium text-left text-gray-700">
                  Email:
                </th>
                <td className="text-gray-600">{user.email}</td>
              </tr>
              <tr className="border-b">
                <th className="p-3 font-medium text-left text-gray-700">
                  Role:
                </th>
                <td className="text-gray-600">
                  {editingUserId === user.id ? (
                    <select
                      className="p-2 border rounded"
                      value={selectedRole || ""}
                      onChange={(e) => setSelectedRole(e.target.value)}
                    >
                      <option value="" disabled>
                        Select a role
                      </option>
                      <option value="Admin">Admin</option>
                      <option value="Member">Member</option>
                    </select>
                  ) : (
                    user.role
                  )}
                </td>
              </tr>
              <tr className="border-b">
                <th className="p-3 font-medium text-left text-gray-700">
                  Team:
                </th>
                <td className="text-gray-600">
                  {editingUserId === user.id ? (
                    <select
                      className="p-2 border rounded"
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
            </tbody>
          </table>
          <div className="flex justify-center mt-4">
            {editingUserId === user.id ? (
              <>
                <button
                  onClick={() => handleUpdate(user.id)}
                  className="flex items-center px-4 py-2 mr-2 text-xs font-semibold text-white bg-green-500 rounded hover:bg-green-600 focus:outline-none"
                >
                  Save {loading && <Loader className="ml-2 animate-spin" />}
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
                  onClick={() =>
                    handleEdit(user.id, user.team?.id || null, user.role)
                  }
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
          </div>
        </div>
      ))}
    </div>
  );
}
