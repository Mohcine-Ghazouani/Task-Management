import { useState } from "react";
import { UseUserContext } from "../../context/UserContext";
import UserApi from "../../services/Api/User/UserApi";
import { useNavigate } from "react-router-dom";
import { Loader } from "lucide-react";

export default function AddTask() {
  const { users, setTasks } = UseUserContext();
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: "Not started",
    priority: "Normal",
    due_date: "",
    user_id: "",
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    setLoading(true);

    e.preventDefault();

    UserApi.createTask(newTask)
      .then(({ data }) => {
        setTasks((prevTasks) => [...prevTasks, data.task]);
        setLoading(false);
        navigate("/tasks");
      })
      .catch((error) => {
        console.error("Error creating task:", error);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prevTask) => ({ ...prevTask, [name]: value }));
  };

  return (
    <div className="container my-4 space-y-4 ">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">Add New Task</h2>
        <button
          onClick={() => navigate("/tasks")}
          className="px-4 py-2 text-sm font-semibold text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none"
        >
          Back
        </button>
      </div>
      <div className="p-4 bg-white border rounded-lg shadow">
        <table className="w-full table-auto">
          <tbody>
            <tr className="border-b">
              <th className="w-1/3 p-3 font-medium text-left text-gray-700">
                Title:
              </th>
              <td className="text-gray-600">
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  name="title"
                  value={newTask.title}
                  onChange={handleChange}
                  required
                />
              </td>
            </tr>
            <tr className="border-b">
              <th className="p-3 font-medium text-left text-gray-700">
                Description:
              </th>
              <td className="text-gray-600">
                <textarea
                  className="w-full p-2 border rounded"
                  name="description"
                  value={newTask.description}
                  onChange={handleChange}
                  required
                ></textarea>
              </td>
            </tr>
            <tr className="border-b">
              <th className="p-3 font-medium text-left text-gray-700">
                Status:
              </th>
              <td className="text-gray-600">
                <select
                  className="w-full p-2 border rounded"
                  name="status"
                  value={newTask.status}
                  onChange={handleChange}
                >
                  <option value="Not started">Not started</option>
                  <option value="In progress">In progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </td>
            </tr>
            <tr className="border-b">
              <th className="p-3 font-medium text-left text-gray-700">
                Priority:
              </th>
              <td className="text-gray-600">
                <select
                  className="w-full p-2 border rounded"
                  name="priority"
                  value={newTask.priority}
                  onChange={handleChange}
                >
                  <option value="Low">Low</option>
                  <option value="Normal">Normal</option>
                  <option value="High">High</option>
                </select>
              </td>
            </tr>
            <tr className="border-b">
              <th className="p-3 font-medium text-left text-gray-700">
                Due Date:
              </th>
              <td className="text-gray-600">
                <input
                  type="date"
                  className="w-full p-2 border rounded"
                  name="due_date"
                  value={newTask.due_date}
                  onChange={handleChange}
                />
              </td>
            </tr>
            <tr className="border-b">
              <th className="p-3 font-medium text-left text-gray-700">
                Assigned To:
              </th>
              <td className="text-gray-600">
                <select
                  className="w-full p-2 border rounded"
                  name="user_id"
                  value={newTask.user_id}
                  onChange={handleChange}
                >
                  <option value="">Unassigned</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          </tbody>
        </table>
        <div className="flex justify-end mt-4">
          <button
            onClick={handleSubmit}
            className="flex items-center px-6 py-2 text-sm font-semibold text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none"
          >
            Create Task {loading && <Loader className="ml-2 animate-spin" />}
          </button>
        </div>
      </div>
    </div>
  );
}
