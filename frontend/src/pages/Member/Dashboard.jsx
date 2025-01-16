import { useEffect } from "react";
import { UseUserContext } from "../../context/UserContext";

import UserApi from "../../services/Api/User/UserApi";

export default function Dashboard() {
  const { user, setTask, task } = UseUserContext();

  useEffect(() => {
    if (user.role === "Member") {
      UserApi.getTask(user.id).then(({ data }) => {
        setTask(data.task);
      });
    }
  }, [user.id, setTask, user.role]);
  console.log(user);
  console.log(task);
  return (
    <>
      <div>
        <h1 className="text-2xl font-bold text-center"> {user.name}</h1>
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
                  {task.status === "Completed" ? (
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
                  {task.user_id ? (
                    task.user.name
                  ) : (
                    <p className="text-red-500">No assigned user</p>
                  )}
                </td>
              </tr>

              <tr>
                <td colSpan="2" className="pt-4 text-center">
                  <button
                    //onClick={() => onEdit(task)}
                    className="px-4 py-2 mr-2 text-xs font-semibold text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none"
                  >
                    Edit
                  </button>
                  <button
                    //onClick={() => onEdit(task)}
                    className="px-4 py-2 mr-2 text-xs font-semibold text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none"
                  >
                    Add Comment
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
