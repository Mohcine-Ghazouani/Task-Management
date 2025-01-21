import { useState } from "react";
import { UseUserContext } from "../context/UserContext";
import UserApi from "../services/Api/User/UserApi";
import { Loader } from "lucide-react";

export default function Profile() {
  const { user, setUser } = UseUserContext(); // Assuming `setUser` is available in the context
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editedUser, setEditedUser] = useState({
    name: user.name,
    email: user.email,
  });

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setEditedUser({ name: user.name, email: user.email }); // Reset to original values
  };

  const handleSave = () => {
    setLoading(true);
    UserApi.updateUser(user.id, editedUser).then(({ data }) => {
      setUser(data.user);
      setIsEditing(false);
      setLoading(false);
    });
 
  };

  return (
    <>
      <div className="container border p-2 mt-4 rounded-lg bg-white shadow">
        <table className="table-auto w-full">
          <tbody>
            <tr className="border-b">
              <th className="text-left p-3 font-medium text-gray-700">Role:</th>
              <td className="p-3 text-gray-600">{user.role}</td>
            </tr>
            <tr className="border-b">
              <th className="text-left p-3 font-medium text-gray-700">Name:</th>
              <td className="p-3 text-gray-600">
                {isEditing ? (
                  <input
                    type="text"
                    value={editedUser.name}
                    onChange={(e) =>
                      setEditedUser({ ...editedUser, name: e.target.value })
                    }
                    className="border p-2 w-full rounded"
                  />
                ) : (
                  user.name
                )}
              </td>
            </tr>
            <tr className="border-b">
              <th className="text-left p-3 font-medium text-gray-700">
                Email:
              </th>
              <td className="p-3 text-gray-600">
                {isEditing ? (
                  <input
                    type="email"
                    value={editedUser.email}
                    onChange={(e) =>
                      setEditedUser({ ...editedUser, email: e.target.value })
                    }
                    className="border p-2 w-full rounded"
                  />
                ) : (
                  user.email
                )}
              </td>
            </tr>
            <tr>
              <th className="text-left p-3 font-medium text-gray-700">Team:</th>
              <td className="p-3 text-gray-600">
                {user.team ? (
                  user.team
                ) : (
                  <p className="text-red-500">No Team</p>
                )}
              </td>
            </tr>
          </tbody>
        </table>
        <div className="flex justify-end mt-4">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="flex items-center px-4 py-2 mr-2 text-center text-xs font-semibold text-white bg-green-500 rounded hover:bg-green-600 focus:outline-none"
              >
                Save {loading && <Loader className="ml-2 animate-spin" />}
              </button>
              <button
                onClick={handleEditToggle}
                className="px-4 py-2 text-xs font-semibold text-white bg-gray-500 rounded hover:bg-gray-600 focus:outline-none"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={handleEditToggle}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none"
            >
              Edit
            </button>
          )}
        </div>
      </div>
    </>
  );
}







