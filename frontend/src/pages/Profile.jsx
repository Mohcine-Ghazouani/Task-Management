import { useState } from "react";
import { UseUserContext } from "../context/UserContext";
import UserApi from "../services/Api/User/UserApi";
import { Loader } from "lucide-react";

export default function Profile() {
  const { user, setUser } = UseUserContext(); 
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editedUser, setEditedUser] = useState({
    name: user.name,
    email: user.email,
  });

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setEditedUser({ name: user.name, email: user.email }); 
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
      <div className="container p-2 mt-4 bg-white border rounded-lg shadow">
        <table className="w-full table-auto">
          <tbody>
            <tr className="border-b">
              <th className="p-3 font-medium text-left text-gray-700">Role:</th>
              <td className="p-3 text-gray-600">{user.role}</td>
            </tr>
            <tr className="border-b">
              <th className="p-3 font-medium text-left text-gray-700">Name:</th>
              <td className="p-3 text-gray-600">
                {isEditing ? (
                  <input
                    type="text"
                    value={editedUser.name}
                    onChange={(e) =>
                      setEditedUser({ ...editedUser, name: e.target.value })
                    }
                    className="w-full p-2 border rounded"
                  />
                ) : (
                  user.name
                )}
              </td>
            </tr>
            <tr className="border-b">
              <th className="p-3 font-medium text-left text-gray-700">
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
                    className="w-full p-2 border rounded"
                  />
                ) : (
                  user.email
                )}
              </td>
            </tr>
            <tr>
              <th className="p-3 font-medium text-left text-gray-700">Team:</th>
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
                className="flex items-center px-4 py-2 mr-2 text-xs font-semibold text-center text-white bg-green-500 rounded hover:bg-green-600 focus:outline-none"
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
