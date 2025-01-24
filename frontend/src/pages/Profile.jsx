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

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setEditedUser({ name: user.name, email: user.email }); // Reset to original values
  };

  const handleSave = () => {
    setLoading(true);
    UserApi.updateUser(user.id, editedUser)
      .then(({ data }) => {
        setUser(data.user);
        setIsEditing(false);
      })
      .catch((error) => {
        console.error("Error updating user:", error);
        alert("Failed to update user.");
      })
      .finally(() => setLoading(false));
  };

  const handleChangePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New password and confirmation do not match.");
      return;
    }

    setLoading(true);
    UserApi.changePassword({
      userId: user.id,
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
    })
      .then(() => {
        alert("Password updated successfully.");
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      })
      .catch((error) => {
        console.error("Error changing password:", error);
        alert("Failed to change password.");
      })
      .finally(() => setLoading(false));
  };

  const handleCancelPasswordChange = () => {
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setLoading(false);
  };

  return (
    <>
      <div className="container p-2 mt-4 bg-white border rounded-lg shadow">
        <h1 className="text-2xl font-bold text-center text-gray-700">Profile</h1>
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
              <th className="p-3 font-medium text-left text-gray-700">Email:</th>
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
                {user.team ? user.team : <p className="text-red-500">No Team</p>}
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

      <div className="container p-2 mt-4 bg-white border rounded-lg shadow">
        <h1 className="text-2xl font-bold text-center text-gray-700">
        Update Password
        </h1>
        <table className="w-full table-auto">
          <tbody>
            <tr className="border-b">
              <th className="p-3 font-medium text-left text-gray-700">
                Current Password:
              </th>
              <td className="p-3 text-gray-600">
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, currentPassword: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                />
              </td>
            </tr>
            <tr className="border-b">
              <th className="p-3 font-medium text-left text-gray-700">
                New Password:
              </th>
              <td className="p-3 text-gray-600">
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, newPassword: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                />
              </td>
            </tr>
            <tr>
              <th className="p-3 font-medium text-left text-gray-700">
                Confirm Password:
              </th>
              <td className="p-3 text-gray-600">
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                />
              </td>
            </tr>
          </tbody>
        </table>
        <div className="flex justify-end mt-4">
          <button
            onClick={handleChangePassword}
            className="flex items-center px-4 py-2 mr-2 text-xs font-semibold text-center text-white bg-green-500 rounded hover:bg-green-600 focus:outline-none"
          >
            Update {loading && <Loader className="ml-2 animate-spin" />}
          </button>
          <button
            onClick={handleCancelPasswordChange}
            className="px-4 py-2 text-xs font-semibold text-white bg-gray-500 rounded hover:bg-gray-600 focus:outline-none"
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
}


