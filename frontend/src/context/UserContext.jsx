import { useState, createContext } from "react";
import { useContext } from "react";
import UserApi from "../services/Api/User/UserApi";


const UserStateContext = createContext({
  user: {},
  authenticated: false,
  setAuthenticated: () => {},
  setUser: () => {},
  login: (email, password) => {},
  logout: () => {},
});
export default function UserContext({ children }) {
  const [user, setUser] = useState({});
  const [authenticated, setAuthenticated] = useState(false);
  

  const login = async (email, password) => {
    await UserApi.getCsrfToken();
    return UserApi.login(email, password)
  };
  const logout = () => {};

  return (
    <>
      <UserStateContext.Provider
        value={{
          user,
          login,
          logout,
          authenticated,
          setAuthenticated,
        }}
      >
        {children}
      </UserStateContext.Provider>
    </>
  );
}
export const UseUserContext = () => useContext(UserStateContext);

