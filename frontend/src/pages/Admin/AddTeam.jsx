import { useState } from "react";
import { axiosClient } from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { Loader } from "lucide-react";

export default function AddTeam() {
  const [teamName, setTeamName] = useState("");
  const [teamDescription, setTeamDescription] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    setLoading(true);
    e.preventDefault();
    if (!teamName.trim()) {
      setError("Team name is required.");
      return;
    }
    setError(null);
    axiosClient
      .post("/teams", { name: teamName, description: teamDescription })
      .then(() => {
        setLoading(false);
        navigate("/teams"); 
      })
      .catch((error) => {
        console.error("Error creating team:", error);
        setError("An error occurred while creating the team.");
      });
  };

  return (
    <div className="container mx-auto my-8 max-w-lg border p-4 rounded-lg bg-white shadow">
      
      <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
            Add New Team
          </h2>
          <button
            onClick={() => navigate("/teams")}
            className="px-4 py-2 text-sm font-semibold text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none"
          >
            Back
          </button>
        </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div >
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
            className="mt-1 p-2 block w-full rounded border shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
            className="mt-1 p-2 block w-full rounded border shadow-sm focus:border-blue-500 focus:ring-blue-500"
            rows="3"
            placeholder="Enter team description (optional)"
          ></textarea>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center px-4 py-2 text-sm font-semibold text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none"
          >
            Add Team {loading && <Loader className="ml-2 animate-spin" />}
          </button>
        </div>
      </form>
    </div>
  );
}
