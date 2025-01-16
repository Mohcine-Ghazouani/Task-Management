import { useState } from "react";
import { axiosClient } from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function AddTeam() {
  const [teamName, setTeamName] = useState("");
  const [teamDescription, setTeamDescription] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!teamName.trim()) {
      setError("Team name is required.");
      return;
    }

    // Reset error
    setError(null);

    // API call to create the team
    axiosClient
      .post("/teams", { name: teamName, description: teamDescription })
      .then(() => {
        navigate("/teams"); // Redirect to teams list page after successful addition
      })
      .catch((error) => {
        console.error("Error creating team:", error);
        setError("An error occurred while creating the team.");
      });
  };

  return (
    <div className="container mx-auto my-8 max-w-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Team</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="teamName"
            className="block text-sm font-medium text-gray-700"
          >
            Team Name
          </label>
          <input
            id="teamName"
            type="text"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter team name"
          />
        </div>
        <div>
          <label
            htmlFor="teamDescription"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="teamDescription"
            value={teamDescription}
            onChange={(e) => setTeamDescription(e.target.value)}
            className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            rows="3"
            placeholder="Enter team description (optional)"
          ></textarea>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 text-sm font-semibold text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none"
          >
            Add Team
          </button>
        </div>
      </form>
    </div>
  );
}
