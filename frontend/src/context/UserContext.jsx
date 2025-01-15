import { useState, createContext } from "react";
import { useContext } from "react";
import UserApi from "../services/Api/User/UserApi";

const UserStateContext = createContext({
  task : {},
  tasks : [],
  setTask : () => {},
  setTasks : () => {},
  user: {},
  setUser: () => {},
  Notification: {},
  setNotification: () => {},
 
  users: [],
  authenticated: false,
  setAuthenticated: () => {},
  login: (email, password) => {},
  logout: () => {},
  
  updateUser: (id, userData) => {},
});
export default function UserContext({ children }) {
  
  const [task, setTask] = useState({});
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({});
  const [authenticated, _setAuthenticated] = useState(
    "true" === window.localStorage.getItem("AUTHENTICATED")
  );

  const login = async (email, password) => {
    await UserApi.getCsrfToken();
    return UserApi.login(email, password);
  };
  const logout = () => {
    
    setUser({});
    setAuthenticated(false);
  };

  const setAuthenticated = (isAuthenticated) => {
    _setAuthenticated(isAuthenticated);
    window.localStorage.setItem("AUTHENTICATED", isAuthenticated);
  };

 


  const updateUser = async (id, userData) => {
    try {
      const { data } = await UserApi.updateUser(id, userData); // Assuming `updateUser` is defined in UserApi
      setUsers((prevUsers) =>
        prevUsers.map((user) => (user.id === id ? data.user : user))
      );
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <>
      <UserStateContext.Provider
        value={{
          task,
          setTask,
          tasks,
          setTasks,
          user,
          setUser,
          users,
          setUsers,
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
