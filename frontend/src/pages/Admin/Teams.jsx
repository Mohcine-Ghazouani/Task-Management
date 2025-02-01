import { useEffect, useState } from "react";
import UserApi from "../../services/Api/User/UserApi";
import { UseUserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import { Loader } from "lucide-react";

export default function Teams() {
  const { users, setUsers, teams, setTeams } = UseUserContext();
  const [editingTeamId, setEditingTeamId] = useState(null);
  const [editedTeamName, setEditedTeamName] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    UserApi.getTeams()
      .then(({ data }) => {
        setTeams(data.teams);
      })
      .catch((error) => {
        console.error("Error fetching teams:", error);
      });

    UserApi.getUsers()
      .then(({ data }) => {
        setUsers(data.users);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, [ users]);

  const getUsersInTeam = (teamId) => {
    return users.filter((user) => user.team_id === teamId);
  };

  const handleEdit = (teamId, currentName) => {
    setEditingTeamId(teamId);
    setEditedTeamName(currentName);
  };

  const handleSave = (teamId) => {
    setLoading(true);
    UserApi.updateTeam(teamId, { name: editedTeamName })
      .then(({ data }) => {
        console.log(data);
        setTeams((prevTeams) =>
          prevTeams.map((team) =>
            team.id === teamId ? { ...team, name: data.name } : team
          )
        );
        setLoading(false);
        setEditingTeamId(null);
      })
      .catch((error) => {
        console.error("Error updating team:", error);
      });
  };

  const handleDiscard = () => {
    setEditingTeamId(null);
    setEditedTeamName("");
  };
console.log(teams);
console.log(editedTeamName);
console.log(editingTeamId);
  return (
    <div className="container my-4 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">Teams List</h2>
        <button
          onClick={() => navigate("/add-team")}
          className="px-4 py-2 text-sm font-semibold text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none"
        >
          Add Team
        </button>
      </div>

      {teams
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .map((team) => (
        <div key={team.id} className="p-4 bg-white border rounded-lg shadow">
          <div className="flex items-center justify-between">
            {editingTeamId === team.id ? (
              <input
                type="text"
                value={editedTeamName}
                onChange={(e) => setEditedTeamName(e.target.value)}
                className="w-1/2 p-2 border rounded"
              />
            ) : (
              <h3 className="text-lg font-semibold text-gray-700">{team.name}</h3>
            )}
            <div className="flex justify-end mt-4">
              {editingTeamId === team.id ? (
                <>
                  <button
                    onClick={() => handleSave(team.id)}
                    className="flex items-center px-4 py-2 mr-2 text-sm font-semibold text-white bg-green-500 rounded hover:bg-green-600"
                  >
                    Save {loading && <Loader className="ml-2 animate-spin" />}
                  </button>
                  <button
                    onClick={handleDiscard}
                    className="px-4 py-2 text-sm font-semibold text-white bg-gray-500 rounded hover:bg-gray-600"
                  >
                    Discard
                  </button>
                </>
              ) : (
                <button
                  onClick={() => handleEdit(team.id, team.name)}
                  className="px-4 py-2 text-sm font-semibold text-white bg-blue-500 rounded hover:bg-blue-600"
                >
                  Update
                </button>
              )}
            </div>
          </div>
          <div className="mt-4">
            <h4 className="font-medium text-gray-700">Members:</h4>
            <ul className="pl-6 list-disc">
              {getUsersInTeam(team.id).length > 0 ? (
                getUsersInTeam(team.id).map((user) => (
                  <li key={user.id} className="text-gray-600">
                    <span className="font-semibold">Name:</span> {user.name}{" "}
                    <span className="font-semibold">Email:</span> {user.email}
                  </li>
                ))
              ) : (
                <p className="text-red-500">No members in this team.</p>
              )}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}
