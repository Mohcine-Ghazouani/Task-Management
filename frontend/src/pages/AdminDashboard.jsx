import { UseUserContext } from "../context/UserContext";

export default function AdminDashboard() {
  const { user  }= UseUserContext();
  return (
    <>
      <div>
        <h1 className="text-2xl font-bold text-center">{user.role} {user.name}</h1>
      </div>
    </>
  );
}
