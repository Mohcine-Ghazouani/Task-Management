import { useEffect, useState } from "react";
import { UseUserContext } from "../context/UserContext";
import UserApi from "../services/Api/User/UserApi";
import { axiosClient } from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const { user, tasks, setTasks, users, setUsers } = UseUserContext();
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTask, setEditedTask] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (user.role === "Admin") {
      UserApi.getTasks().then(({ data }) => {
        setTasks(data.tasks);
      });
      axiosClient.get("/users").then(({ data }) => {
        setUsers(data.users);
      });
    }
  }, [setTasks, user.role]);

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

  const handleEdit = (task) => {
    setEditingTaskId(task.id);
    setEditedTask({ ...task });
  };

  const handleUpdate = () => {
    UserApi.updateTask(editingTaskId, editedTask)
      .then(({ data }) => {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === editingTaskId ? data.task : task
          )
        );
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
      <h1 className="text-2xl font-bold text-center">
        {user.role} {user.name}
      </h1>
      <div className="container my-4 space-y-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Tasks List</h2>
          <button
            onClick={() => navigate("/add-task")}
            className="px-4 py-2 text-sm font-semibold text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none"
          >
            Add Task
          </button>
         
        </div>
        {tasks.map((task) => (
          <div key={task.id} className="border p-4 rounded-lg bg-white shadow">
            <table className="table-auto w-full">
              <tbody>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium text-gray-700 w-1/3">
                    Task Title:
                  </th>
                  <td className="text-gray-600">
                    {editingTaskId === task.id ? (
                      <input
                        type="text"
                        className="border p-2 w-full rounded"
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
                  <th className="text-left p-3 font-medium text-gray-700">
                    Description:
                  </th>
                  <td className="text-gray-600">
                    {editingTaskId === task.id ? (
                      <textarea
                        className="border p-2 w-full rounded"
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
                  <th className="text-left p-3 font-medium text-gray-700">
                    Status:
                  </th>
                  <td className="text-gray-600">
                    {editingTaskId === task.id ? (
                      <select
                        className="border p-2 w-full rounded"
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
                    ) : // task.status
                    task.status === "Completed" ? (
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
                  <th className="text-left p-3 font-medium text-gray-700">
                    Priority:
                  </th>
                  <td className="text-gray-600">
                    {editingTaskId === task.id ? (
                      <select
                        className="border p-2 w-full rounded"
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
                      <p className="px-2 py-1 text-xs font-semibold  text-green-700 bg-green-200 rounded ">
                        Low
                      </p>
                    )}
                  </td>
                </tr>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium text-gray-700">
                    Due Date:
                  </th>
                  <td className="text-gray-600">
                    {editingTaskId === task.id ? (
                      <input
                        type="date"
                        className="border p-2 w-full rounded"
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
                  <th className="text-left p-3 font-medium text-gray-700">
                    Assigned To:
                  </th>
                  <td className="text-gray-600">
                    {editingTaskId === task.id ? (
                      <select
                        className="border p-2 w-full rounded"
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
                      "Unassigned"
                    )}
                  </td>
                </tr>
                <tr>
                  <td colSpan="2" className="pt-4 text-center">
                    {editingTaskId === task.id ? (
                      <>
                        <button
                          onClick={handleUpdate}
                          className="px-4 py-2 mr-2 text-xs font-semibold text-white bg-green-500 rounded hover:bg-green-600 focus:outline-none"
                        >
                          Save
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
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
}

// import { useEffect } from "react";
// import { UseUserContext } from "../context/UserContext";
// import UserApi from "../services/Api/User/UserApi";

// export default function AdminDashboard() {
//   const { user, tasks, setTasks } = UseUserContext();
//   useEffect(() => {
//     if (user.role === "Admin") {
//       UserApi.getTasks().then(({ data }) => {
//       setTasks(data.tasks);
//     });
//     }
//   }, [ setTasks, user.role ]);
//   console.log(tasks);
//   return (
//     <>
//       <div>
//         <h1 className="text-2xl font-bold text-center">
//           {user.role} {user.name}
//         </h1>
//         <div className="container my-4 space-y-4">
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-xl font-bold text-gray-800">Tasks List</h2>
//             <button
//               //onClick={onAdd}
//               className="px-4 py-2 text-sm font-semibold text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none"
//             >
//               Add Task
//             </button>
//           </div>
//           {tasks.map(
//             (task, index) => (

//               (
//                 <div
//                   key={index}
//                   className="border p-4 rounded-lg bg-white shadow"
//                 >
//                   <table className="table-auto w-full">
//                     <tbody>
//                       <tr className="border-b">
//                         <th className="text-left p-3 font-medium text-gray-700 w-1/3">
//                           Task Title:
//                         </th>
//                         <td className="text-gray-600">{task.title}</td>
//                       </tr>
//                       <tr className="border-b">
//                         <th className="text-left p-3 font-medium text-gray-700">
//                           Description:
//                         </th>
//                         <td className="text-gray-600">{task.description}</td>
//                       </tr>

//                       <tr className="border-b">
//                         <th className="text-left p-3 font-medium text-gray-700">
//                           Status:
//                         </th>
//                         <td className="text-gray-600">
//                           {task.status === "Completed" ? (
//                             <p className="px-2 py-1 text-xs font-semibold text-green-700 bg-green-200 rounded">
//                               Completed
//                             </p>
//                           ) : task.status === "In progress" ? (
//                             <p className="px-2 py-1 text-xs font-semibold text-yellow-700 bg-yellow-200 rounded">
//                               In progress
//                             </p>
//                           ) : (
//                             <p className="px-2 py-1 text-xs font-semibold text-red-700 bg-red-200 rounded">
//                               Not started
//                             </p>
//                           )}
//                         </td>
//                       </tr>
//                       <tr className="border-b">
//                         <th className="text-left p-3 font-medium text-gray-700">
//                           Priority:
//                         </th>
//                         <td className="text-gray-600">
//                           {task.priority === "High" ? (
//                             <p className="px-2 py-1 text-xs font-semibold text-red-700 bg-red-200 rounded">
//                               High
//                             </p>
//                           ) : task.priority === "Normal" ? (
//                             <p className="px-2 py-1 text-xs font-semibold text-yellow-700 bg-yellow-200 rounded">
//                               Normal
//                             </p>
//                           ) : (
//                             <p className="px-2 py-1 text-xs font-semibold  text-green-700 bg-green-200 rounded ">
//                               Low
//                             </p>
//                           )}
//                         </td>
//                       </tr>
//                       <tr className="border-b">
//                         <th className="text-left p-3 font-medium text-gray-700">
//                           Due Date:
//                         </th>
//                         <td className="text-gray-600">{task.due_date}</td>
//                       </tr>
//                       <tr className="border-b">
//                         <th className="text-left p-3 font-medium text-gray-700">
//                           Assigned To:
//                         </th>
//                         <td className="text-gray-600">
//                           {task.user_id ? (
//                             task.user.name
//                           ) : (
//                             <p className="text-red-500">No assigned user</p>
//                           )}
//                         </td>
//                       </tr>

//                       <tr>
//                         <td colSpan="2" className="pt-4 text-center">
//                           <button
//                             //onClick={() => onEdit(task)}
//                             className="px-4 py-2 mr-2 text-xs font-semibold text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none"
//                           >
//                             Edit
//                           </button>
//                           <button
//                             // onClick={() => onDelete(task.id)}
//                             className="px-4 py-2 text-xs font-semibold text-white bg-red-500 rounded hover:bg-red-600 focus:outline-none"
//                           >
//                             Delete
//                           </button>
//                         </td>
//                       </tr>
//                     </tbody>
//                   </table>
//                 </div>
//               )
//             )
//           )}
//         </div>
//       </div>
//     </>
//   );
// }
