import { UseUserContext } from "../context/UserContext";

export default function Profile() {
    const { user }= UseUserContext();
    
  console.log(user);
  return (
    <>
      <div className="container border p-2  mt-4 rounded-lg bg-white shadow">
          <table className="table-auto w-full">
            <tbody>
              <tr className="border-b">
                <th className="text-left p-3 font-medium text-gray-700">
                  Role:
                </th>
                <td className="p-3 text-gray-600">{user.role}</td>
              </tr>
              <tr className="border-b">
                <th className="text-left p-3 font-medium text-gray-700">
                  Name:
                </th>
                <td className="p-3 text-gray-600">{user.name}</td>
              </tr>
              <tr className="border-b">
                <th className="text-left p-3 font-medium text-gray-700">
                  Email:
                </th>
                <td className="p-3 text-gray-600">{user.email}</td>
              </tr>
              <tr>
                <th className="text-left p-3 font-medium text-gray-700">
                  Team:
                </th>
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
        </div>
    </>
  );
}
