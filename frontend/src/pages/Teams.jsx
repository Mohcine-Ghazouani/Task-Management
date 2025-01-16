import { useEffect } from "react";
import UserApi from "../services/Api/User/UserApi";
import { UseUserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

export default function Teams() {
  const { users, setUsers, teams, setTeams } = UseUserContext();
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
  console.log(teams);
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
          <h3 className="text-lg font-semibold text-gray-700">{team.name}</h3>
          <div className="mt-4">
            <h4 className="font-medium text-gray-700">Members:</h4>
            <ul className="list-disc pl-6">
              {getUsersInTeam(team.id).length > 0 ? (
                getUsersInTeam(team.id).map((user) => (
                  <li key={user.id} className="text-gray-600">
                    <span className="font-semibold">Name :</span> {user.name}{" "}
                    <span className="font-semibold">Email :</span>
                    {user.email}
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
