import { useEffect, useState } from "react";
import UserApi from "../services/Api/User/UserApi";
import { UseUserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

export default function Teams() {
  const { users, setUsers, teams, setTeams } = UseUserContext();
  const [editingTeamId, setEditingTeamId] = useState(null);
  const [editedTeamName, setEditedTeamName] = useState("");
  const navigate = useNavigate();

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
  }, []);

  const getUsersInTeam = (teamId) => {
    return users.filter((user) => user.team_id === teamId);
  };

  const handleEdit = (teamId, currentName) => {
    setEditingTeamId(teamId);
    setEditedTeamName(currentName);
  };

  const handleSave = (teamId) => {
    UserApi.updateTeam(teamId, { name: editedTeamName })
      .then(({ data }) => {
        console.log(data);
        setTeams((prevTeams) =>
          prevTeams.map((team) =>
            team.id === teamId ? { ...team, name: data.name } : team
          )
        );
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
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Teams List</h2>
        <button
          onClick={() => navigate("/add-team")}
          className="px-4 py-2 text-sm font-semibold text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none"
        >
          Add Team
        </button>
      </div>

      {teams.map((team) => (
        <div key={team.id} className="border p-4 rounded-lg bg-white shadow">
          <div className="flex justify-between items-center">
            {editingTeamId === team.id ? (
              <input
                type="text"
                value={editedTeamName}
                onChange={(e) => setEditedTeamName(e.target.value)}
                className="border p-2 rounded w-1/2"
              />
            ) : (
              <h3 className="text-lg font-semibold text-gray-700">{team.name}</h3>
            )}
            <div>
              {editingTeamId === team.id ? (
                <>
                  <button
                    onClick={() => handleSave(team.id)}
                    className="px-4 py-2 mr-2 text-sm font-semibold text-white bg-green-500 rounded hover:bg-green-600"
                  >
                    Save
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
            <ul className="list-disc pl-6">
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
