import { UseUserContext } from "../context/UserContext";

export default function Layout() {
  const { user }= UseUserContext();
  return (
    <>
      <div>
        <h1 className="text-2xl font-bold text-center">hello {user.name}</h1>
      </div>
    </>
  );
}
