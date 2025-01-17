// import { useState, useEffect } from "react";
// import { UseUserContext } from "../../context/UserContext";
// import UserApi from "../../services/Api/User/UserApi";

// export default function Dashboard() {
//   const { user, userTask, setUserTask, comments, setComments } =
//     UseUserContext();
//   const [editingTaskId, setEditingTaskId] = useState(null);
//   const [editedTask, setEditedTask] = useState({});
//   const [addingCommentId, setAddingCommentId] = useState(null);
//   const [newComment, setNewComment] = useState("");

//   useEffect(() => {
//     if (user.role === "Member") {
//       UserApi.getUserTasks(user.id).then(({ data }) => {
//         setUserTask(data.tasks);
//       });
//       UserApi.getUserComments(user.id).then(({ data }) => {
//         setComments(data.comments);
//       });
//     }
//   }, [user, setUserTask, setComments]);

//   const handleEdit = (task) => {
//     setEditingTaskId(task.id);
//     setEditedTask({ ...task });
//   };

//   const handleUpdate = () => {
//     UserApi.updateTask(editingTaskId, editedTask)
//       .then(({ data }) => {
//         setUserTask((prevTasks) =>
//           prevTasks.map((task) =>
//             task.id === editingTaskId ? data.task : task
//           )
//         );
//         setEditingTaskId(null);
//       })
//       .catch((error) => {
//         console.error("Error updating task:", error);
//       });
//   };

//   const handleDiscard = () => {
//     setEditingTaskId(null);
//     setEditedTask({});
//   };

//   const handleAddComment = (taskId) => {
//     setAddingCommentId(taskId);
//     setNewComment("");
//   };

//   const handleSaveComment = () => {
//     UserApi.addComment(addingCommentId, { content: newComment })
//       .then(({ data }) => {
//         setComments((prevComments) => [...prevComments, data.comment]);
//         setAddingCommentId(null);
//         setNewComment("");
//       })
//       .catch((error) => {
//         console.error("Error adding comment:", error);
//       });
//   };

//   const handleDiscardComment = () => {
//     setAddingCommentId(null);
//     setNewComment("");
//   };

//   return (
//     <div>
//       <h1 className="text-2xl font-bold text-center"> {user.name}</h1>
//       {userTask.map((task) => (
//         <div key={task.id} className="border p-4 rounded-lg bg-white shadow">
//           <table className="table-auto w-full">
//             <tbody>
//               <tr className="border-b">
//                 <th className="text-left p-3 font-medium text-gray-700 w-1/3">
//                   Task Title:
//                 </th>
//                 <td className="text-gray-600">{task.title}</td>
//               </tr>
//               <tr className="border-b">
//                 <th className="text-left p-3 font-medium text-gray-700">
//                   Description:
//                 </th>
//                 <td className="text-gray-600">{task.description}</td>
//               </tr>
//               {/* Status */}
//               {/* Other task fields */}
//               <tr className="border-b">
//                 <th className="text-left p-3 font-medium text-gray-700">
//                   Comments:
//                 </th>
//                 <td className="text-gray-600">
//                   {addingCommentId === task.id ? (
//                     <>
//                       <input
//                         type="text"
//                         value={newComment}
//                         onChange={(e) => setNewComment(e.target.value)}
//                         className="border p-2 w-full rounded"
//                         placeholder="Add a comment..."
//                       />
//                     </>
//                   ) : comments.some((comment) => comment.task_id === task.id) ? (
//                     comments
//                       .filter((comment) => comment.task_id === task.id)
//                       .map((comment, index) => (
//                         <p key={index} className="text-sm text-gray-700">
//                           {comment.content}
//                         </p>
//                       ))
//                   ) : (
//                     <p className="text-red-500">No comments</p>
//                   )}
//                 </td>
//               </tr>

//               <tr>
//                 <td colSpan="2" className="pt-4 text-center">
//                   {editingTaskId === task.id ? (
//                     <>
//                       <button
//                         onClick={handleUpdate}
//                         className="px-4 py-2 mr-2 text-xs font-semibold text-white bg-green-500 rounded hover:bg-green-600 focus:outline-none"
//                       >
//                         Save
//                       </button>
//                       <button
//                         onClick={handleDiscard}
//                         className="px-4 py-2 text-xs font-semibold text-white bg-gray-500 rounded hover:bg-gray-600 focus:outline-none"
//                       >
//                         Discard
//                       </button>
//                     </>
//                   ) : addingCommentId === task.id ? (
//                     <>
//                       <button
//                         onClick={handleSaveComment}
//                         className="px-4 py-2 mr-2 text-xs font-semibold text-white bg-green-500 rounded hover:bg-green-600 focus:outline-none"
//                       >
//                         Save Comment
//                       </button>
//                       <button
//                         onClick={handleDiscardComment}
//                         className="px-4 py-2 text-xs font-semibold text-white bg-gray-500 rounded hover:bg-gray-600 focus:outline-none"
//                       >
//                         Discard
//                       </button>
//                     </>
//                   ) : (
//                     <>
//                       <button
//                         onClick={() => handleEdit(task)}
//                         className="px-4 py-2 mr-2 text-xs font-semibold text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none"
//                       >
//                         Edit
//                       </button>
//                       <button
//                         onClick={() => handleAddComment(task.id)}
//                         className="px-4 py-2 mr-2 text-xs font-semibold text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none"
//                       >
//                         Add Comment
//                       </button>
//                     </>
//                   )}
//                 </td>
//               </tr>
//             </tbody>
//           </table>
//         </div>
//       ))}
//     </div>
//   );
// }


















import { useState, useEffect } from "react";
import { UseUserContext } from "../../context/UserContext";

import UserApi from "../../services/Api/User/UserApi";

export default function Dashboard() {
  const { user, userTask, setUserTask, comments, setComments } =
    UseUserContext();
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTask, setEditedTask] = useState({});

  useEffect(() => {
    if (user.role === "Member") {
      UserApi.getUserTasks(user.id).then(({ data }) => {
        setUserTask(data.tasks);
      });
      UserApi.getUserComments(user.id).then(({ data }) => {
        setComments(data.comments);
      });
    }
  }, [user, setUserTask, userTask]);

  const handleEdit = (task) => {
    setEditingTaskId(task.id);
    setEditedTask({ ...task });
  };

  const handleUpdate = () => {
    UserApi.updateTask(editingTaskId, editedTask)
      .then(({ data }) => {
        console.log("Task updated:", data);
        console.log("prev task :", userTask);
        setUserTask((prevTasks) =>
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
  console.log("comments", comments);

  return (
    <>
      <div>
        <h1 className="text-2xl font-bold text-center"> {user.name}</h1>
        {userTask.map((task) => (
          <div key={task.id} className="border p-4 rounded-lg bg-white shadow">
            <table className="table-auto w-full">
              <tbody>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium text-gray-700 w-1/3">
                    Task Title:
                  </th>
                  <td className="text-gray-600">{task.title}</td>
                </tr>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium text-gray-700">
                    Description:
                  </th>
                  <td className="text-gray-600">{task.description}</td>
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
                  <th className="text-left p-3 font-medium text-gray-700">
                    Priority:
                  </th>
                  <td className="text-gray-600">
                    {task.priority === "High" ? (
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
                  <td className="text-gray-600">{task.due_date}</td>
                </tr>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium text-gray-700">
                    Assigned To:
                  </th>
                  <td className="text-gray-600">
                    {task.user ? (
                      task.user.name
                    ) : (
                      <p className="text-red-500">No assigned user</p>
                    )}
                  </td>
                </tr>

                <tr className="border-b">
                  <th className="text-left p-3 font-medium text-gray-700">
                    Comments:
                  </th>
                  <td className="text-gray-600">
                    
                    {comments ? (
                      comments.map((comment, index) => (
                        <div key={index}>
                          {comment.task_id === task.id && (
                            <p className="text-sm text-gray-700">
                              {comment.content}
                            </p>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-red-500">No comments</p>
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
                          //onClick={}
                          className="px-4 py-2 mr-2 text-xs font-semibold text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none"
                        >
                          Add Comment
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
    </>
  );
}
