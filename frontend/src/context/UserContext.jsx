import { useState, createContext, useContext } from "react";

const UserStateContext = createContext({
  users: {},
  setUsers: () => {},
  logout: () => {},
});
export default function UserContext({ children }) {
  const [users, setUsers] = useState({});

  const logout = () => {};
  return (
    <>
      <UserStateContext.Provider
        value={{
          users,
          setUsers,
          logout,
        }}
      >
        {children}
      </UserStateContext.Provider>
    </>
  );
}

export const useUserContext = () => useContext(UserStateContext);
