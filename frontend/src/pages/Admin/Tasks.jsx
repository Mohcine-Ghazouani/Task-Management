import { useEffect, useState } from "react";
import { UseUserContext } from "../../context/UserContext";
import UserApi from "../../services/Api/User/UserApi";
import { Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const { user, tasks, setTasks, users, setUsers, comments, setComments } =
    UseUserContext();
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTask, setEditedTask] = useState({});
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user.role === "Admin") {
      UserApi.getTasks().then(({ data }) => {
        setTasks(data.tasks);
      });
      UserApi.getUsers().then(({ data }) => {
        setUsers(data.users);
      });
      UserApi.getComments().then(({ data }) => {
        setComments(data.comments);
      });
    }
  }, [user, tasks, setTasks, users, setUsers, comments, setComments]);
  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this task?")) {
      UserApi.deleteTask(id)
        .then(() => {
          setTasks(tasks.filter((task) => task.id !== id));
        })
        .catch((error) => {
          console.error("Error deleting task:", error);
        });
    }
  };
  console.log(tasks);
  const handleEdit = (task) => {
    setEditingTaskId(task.id);
    setEditedTask({ ...task });
  };

  const handleUpdate = () => {
    setLoading(true);
    UserApi.updateTask(editingTaskId, editedTask)
      .then(({ data }) => {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === editingTaskId ? data.task : task
          )
        );
        setLoading(false);
        setEditingTaskId(null);
      })
      .catch((error) => {
        console.error("Error updating task:", error);
      });
  };

  const handleDiscard = () => {
    setEditingTaskId(null);
    setEditedTask({});
  };

  return (
    <div>
      <div className="container my-4 space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Tasks List</h2>
          <button
            onClick={() => navigate("/add-task")}
            className="px-4 py-2 text-sm font-semibold text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none"
          >
            Add Task
          </button>
        </div>
        {tasks.map((task) => (
          <div key={task.id} className="p-4 bg-white border rounded-lg shadow">
            <table className="w-full table-auto">
              <tbody>
                <tr className="border-b">
                  <th className="w-1/3 p-3 font-medium text-left text-gray-700">
                    Task Title:
                  </th>
                  <td className="text-gray-600">
                    {editingTaskId === task.id ? (
                      <input
                        type="text"
                        className="w-full p-2 border rounded"
                        value={editedTask.title || ""}
                        onChange={(e) =>
                          setEditedTask({
                            ...editedTask,
                            title: e.target.value,
                          })
                        }
                      />
                    ) : (
                      task.title
                    )}
                  </td>
                </tr>
                <tr className="border-b">
                  <th className="p-3 font-medium text-left text-gray-700">
                    Description:
                  </th>
                  <td className="text-gray-600">
                    {editingTaskId === task.id ? (
                      <textarea
                        className="w-full p-2 border rounded"
                        value={editedTask.description || ""}
                        onChange={(e) =>
                          setEditedTask({
                            ...editedTask,
                            description: e.target.value,
                          })
                        }
                      />
                    ) : (
                      task.description
                    )}
                  </td>
                </tr>
                <tr className="border-b">
                  <th className="p-3 font-medium text-left text-gray-700">
                    Status:
                  </th>
                  <td className="text-gray-600">
                    {editingTaskId === task.id ? (
                      <select
                        className="w-full p-2 border rounded"
                        value={editedTask.status || ""}
                        onChange={(e) =>
                          setEditedTask({
                            ...editedTask,
                            status: e.target.value,
                          })
                        }
                      >
                        <option value="Not started">Not started</option>
                        <option value="In progress">In progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    ) : task.status === "Completed" ? (
                      <p className="px-2 py-1 text-xs font-semibold text-green-700 bg-green-200 rounded">
                        Completed
                      </p>
                    ) : task.status === "In progress" ? (
                      <p className="px-2 py-1 text-xs font-semibold text-yellow-700 bg-yellow-200 rounded">
                        In progress
                      </p>
                    ) : (
                      <p className="px-2 py-1 text-xs font-semibold text-red-700 bg-red-200 rounded">
                        Not started
                      </p>
                    )}
                  </td>
                </tr>
                <tr className="border-b">
                  <th className="p-3 font-medium text-left text-gray-700">
                    Priority:
                  </th>
                  <td className="text-gray-600">
                    {editingTaskId === task.id ? (
                      <select
                        className="w-full p-2 border rounded"
                        value={editedTask.priority || ""}
                        onChange={(e) =>
                          setEditedTask({
                            ...editedTask,
                            priority: e.target.value,
                          })
                        }
                      >
                        <option value="Low">Low</option>
                        <option value="Normal">Normal</option>
                        <option value="High">High</option>
                      </select>
                    ) : task.priority === "High" ? (
                      <p className="px-2 py-1 text-xs font-semibold text-red-700 bg-red-200 rounded">
                        High
                      </p>
                    ) : task.priority === "Normal" ? (
                      <p className="px-2 py-1 text-xs font-semibold text-yellow-700 bg-yellow-200 rounded">
                        Normal
                      </p>
                    ) : (
                      <p className="px-2 py-1 text-xs font-semibold text-green-700 bg-green-200 rounded ">
                        Low
                      </p>
                    )}
                  </td>
                </tr>
                <tr className="border-b">
                  <th className="p-3 font-medium text-left text-gray-700">
                    Due Date:
                  </th>
                  <td className="text-gray-600">
                    {editingTaskId === task.id ? (
                      <input
                        type="date"
                        className="w-full p-2 border rounded"
                        value={editedTask.due_date || ""}
                        onChange={(e) =>
                          setEditedTask({
                            ...editedTask,
                            due_date: e.target.value,
                          })
                        }
                      />
                    ) : (
                      task.due_date
                    )}
                  </td>
                </tr>
                <tr className="border-b">
                  <th className="p-3 font-medium text-left text-gray-700">
                    Assigned To:
                  </th>
                  <td className="text-gray-600">
                    {editingTaskId === task.id ? (
                      <select
                        className="w-full p-2 border rounded"
                        value={editedTask.user_id || ""}
                        onChange={(e) =>
                          setEditedTask({
                            ...editedTask,
                            user_id: e.target.value,
                          })
                        }
                      >
                        <option value="">Unassigned</option>
                        {users.map((user) => (
                          <option key={user.id} value={user.id}>
                            {user.name}
                          </option>
                        ))}
                      </select>
                    ) : task.user ? (
                      task.user.name
                    ) : (
                      <p className="text-red-500">Unassigned</p>
                    )}
                  </td>
                </tr>
                <tr className="border-b">
                  <th className="p-3 font-medium text-left text-gray-700">
                    Comments:
                  </th>
                  <td className="text-gray-600">
                    {comments.some((comment) => comment.task_id === task.id) ? (
                      comments
                        .filter((comment) => comment.task_id === task.id)
                        .map((comment, index) => (
                          <p key={index} className="text-sm text-gray-700">
                            {comment.content}
                          </p>
                        ))
                    ) : (
                      <p className="text-red-500">No comments</p>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
            {/* <td colSpan="2" className="pt-4 text-center"> */}
            <div className="flex justify-center mt-4">
              {editingTaskId === task.id ? (
                <>
                  <button
                    onClick={handleUpdate}
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
                    onClick={() => handleEdit(task)}
                    className="px-4 py-2 mr-2 text-xs font-semibold text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(task.id)}
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
    </div>
  );
}
