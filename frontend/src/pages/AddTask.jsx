import { useState } from "react";
import { UseUserContext } from "../context/UserContext";
import UserApi from "../services/Api/User/UserApi";
import { useNavigate } from "react-router-dom";
import { ADMIN_DASHBOARD_ROUTE } from "../router";

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

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    UserApi.createTask(newTask)
      .then(({ data }) => {
        setTasks((prevTasks) => [...prevTasks, data.task]);
        navigate(ADMIN_DASHBOARD_ROUTE); 
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
    <div className="container mx-auto my-8 max-w-lg">
      <h2 className="text-2xl font-bold text-center mb-6">Add New Task</h2>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 shadow rounded-lg">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            name="title"
            value={newTask.title}
            onChange={handleChange}
            required
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={newTask.description}
            onChange={handleChange}
            required
            className="w-full border rounded p-2"
          ></textarea>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            name="status"
            value={newTask.status}
            onChange={handleChange}
            className="w-full border rounded p-2"
          >
            <option value="Not started">Not started</option>
            <option value="In progress">In progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Priority
          </label>
          <select
            name="priority"
            value={newTask.priority}
            onChange={handleChange}
            className="w-full border rounded p-2"
          >
            <option value="Low">Low</option>
            <option value="Normal">Normal</option>
            <option value="High">High</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Due Date
          </label>
          <input
            type="date"
            name="due_date"
            value={newTask.due_date}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Assigned To
          </label>
          <select
            name="user_id"
            value={newTask.user_id}
            onChange={handleChange}
            className="w-full border rounded p-2"
          >
            <option value="">Unassigned</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>
        <div className="text-center">
          <button
            type="submit"
            className="px-6 py-2 text-sm font-semibold text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            Create Task
          </button>
        </div>
      </form>
    </div>
  );
}
