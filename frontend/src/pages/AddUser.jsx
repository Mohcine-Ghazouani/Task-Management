import { useEffect, useState } from "react";
import { UseUserContext } from "../context/UserContext";
import UserApi from "../services/Api/User/UserApi";
import { useNavigate } from "react-router-dom";
import {axiosClient} from "../api/axios";

export default function AddUser() {
  const { setUsers, teams ,setTeams } = UseUserContext();
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "Member", 
    team_id: "", 
    password: "12341234",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
      axiosClient.get("/teams").then(({ data }) => {
            setTeams(data.teams);
      });
  }, []);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    UserApi.createUser(newUser)
      .then(({ data }) => {
        setUsers((prevUsers) => [...prevUsers, data.user]);
        navigate("/users"); 
      })
      .catch((error) => {
        console.error("Error adding user:", error);
        setError("Failed to add user. Please try again.");
      });
  };
console.log(teams);
  return (
    <div className="container mx-auto my-8">
      <h1 className="text-2xl font-bold text-center mb-6">Add New User</h1>
      {error && (
        <p className="text-red-500 text-center mb-4">{error}</p>
      )}
      <form
        onSubmit={handleSubmit}
        className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6 space-y-4"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={newUser.name}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={newUser.email}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Role
          </label>
          <select
            name="role"
            value={newUser.role}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="Admin">Admin</option>
            <option value="Member">Member</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Team
          </label>
          <select
            name="team_id"
            value={newUser.team_id}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">No team</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>
        <div className="text-center">
          <button
            type="submit"
            className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
          >
            Add User
          </button>
        </div>
      </form>
    </div>
  );
}
