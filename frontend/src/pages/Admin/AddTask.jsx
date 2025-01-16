import { useState } from "react";
import { UseUserContext } from "../../context/UserContext";
import UserApi from "../../services/Api/User/UserApi";
import { useNavigate } from "react-router-dom";


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
    <div className="container my-4 space-y-4">
      {/* <h2 className="text-2xl font-bold text-center mb-6">Add New Task</h2> */}
      <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Add New Task</h2>
          <button
            onClick={() => navigate("/tasks")}
            className="px-4 py-2 text-sm font-semibold text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none"
          >
            Back 
          </button>
         
        </div>
        <div className="border p-4 rounded-lg bg-white shadow">
  <table className="table-auto w-full">
    <tbody>
      <tr className="border-b">
        <th className="text-left p-3 font-medium text-gray-700 w-1/3">
          Title:
        </th>
        <td className="text-gray-600">
          <input
            type="text"
            className="border p-2 w-full rounded"
            name="title"
            value={newTask.title}
            onChange={handleChange}
            required
          />
        </td>
      </tr>
      <tr className="border-b">
        <th className="text-left p-3 font-medium text-gray-700">
          Description:
        </th>
        <td className="text-gray-600">
          <textarea
            className="border p-2 w-full rounded"
            name="description"
            value={newTask.description}
            onChange={handleChange}
            required
          ></textarea>
        </td>
      </tr>
      <tr className="border-b">
        <th className="text-left p-3 font-medium text-gray-700">
          Status:
        </th>
        <td className="text-gray-600">
          <select
            className="border p-2 w-full rounded"
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
        <th className="text-left p-3 font-medium text-gray-700">
          Priority:
        </th>
        <td className="text-gray-600">
          <select
            className="border p-2 w-full rounded"
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
        <th className="text-left p-3 font-medium text-gray-700">
          Due Date:
        </th>
        <td className="text-gray-600">
          <input
            type="date"
            className="border p-2 w-full rounded"
            name="due_date"
            value={newTask.due_date}
            onChange={handleChange}
          />
        </td>
      </tr>
      <tr className="border-b">
        <th className="text-left p-3 font-medium text-gray-700">
          Assigned To:
        </th>
        <td className="text-gray-600">
          <select
            className="border p-2 w-full rounded"
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
      <tr>
        <td colSpan="2" className="pt-4 text-center">
          <button
            onClick={handleSubmit}
            className="px-6 py-2 text-sm font-semibold text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none"
          >
            Create Task
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</div>

      {/* <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 shadow rounded-lg">
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
      </form> */}
    </div>
  );
}
