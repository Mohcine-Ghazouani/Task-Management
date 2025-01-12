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
  const [authenticated, _setAuthenticated] = useState(localStorage.getItem("AUTHENTICATED") || false);
  // const login = async (email, password) => {
  //   try {
  //     await UserApi.getCsrfToken();
  //     return await UserApi.login(email, password);

  //   } catch (error) {
  //     console.error("Login Error:", error);
  //     throw error;
  //   }
  // };

  const login = async (email, password) => {
    await UserApi.getCsrfToken();
    return UserApi.login(email, password);
  };
  const logout = () => {
    setUser({});
    _setAuthenticated(false); 
  };

  const setAuthenticated = (isAuthenticated) => {
    _setAuthenticated(isAuthenticated);
    window.localStorage.setItem("AUTHENTICATED", isAuthenticated);
  };

  return (
    <>
      <UserStateContext.Provider
        value={{
          user,
          setUser,
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
