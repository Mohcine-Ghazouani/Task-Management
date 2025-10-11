// src/context/UserContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import UserApi from "../services/Api/User/UserApi";

const UserStateContext = createContext({
  // data
  user: null,
  users: [],
  teams: [],
  tasks: [],
  task: {},
  comments: [],
  userTask: [],

  // auth
  authenticated: false,
  authLoading: true,

  // setters
  setUser: () => {},
  setUsers: () => {},
  setTeams: () => {},
  setTasks: () => {},
  setTask: () => {},
  setComments: () => {},
  setUserTask: () => {},
  setAuthenticated: () => {},

  // actions
  login: async (_email, _password) => {},
  logout: async () => {},
});

export default function UserContext({ children }) {
  // ------- app state used across pages -------
  const [comments, setComments] = useState([]);
  const [userTask, setUserTask] = useState([]);
  const [task, setTask] = useState({});
  const [tasks, setTasks] = useState([]);
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);

  // ------- auth state -------
  const [user, setUser] = useState(null);
  const [authenticated, _setAuthenticated] = useState(
    window.localStorage.getItem("AUTHENTICATED") === "true"
  );
  const [authLoading, setAuthLoading] = useState(true);

  // normalize writing to localStorage as strings
  const setAuthenticated = (isAuthenticated) => {
    _setAuthenticated(isAuthenticated);
    window.localStorage.setItem("AUTHENTICATED", isAuthenticated ? "true" : "false");
  };

  // ------- auth bootstrap on app load -------
  useEffect(() => {
    let mounted = true;

    async function bootstrap() {
      try {
        // If you need CSRF for session-based auth, do it here:
        // await UserApi.getCsrfToken();

        const { data } = await UserApi.getUser(); // should return current user or 401
        if (!mounted) return;
        setUser(data);
        setAuthenticated(true);
      } catch (err) {
        if (!mounted) return;
        // not logged in (401) or failed → clear session state
        setUser(null);
        setAuthenticated(false);
      } finally {
        if (mounted) setAuthLoading(false);
      }
    }

    bootstrap();
    return () => {
      mounted = false;
    };
  }, []);

  // ------- actions -------
  const login = async (email, password) => {
    // For session-based auth (e.g., Laravel Sanctum) you often need CSRF first
    await UserApi.getCsrfToken();
    await UserApi.login(email, password);
    // after login, fetch the user and mark authenticated
    const { data } = await UserApi.getUser();
    setUser(data);
    setAuthenticated(true);
    return data;
  };

  const logout = async () => {
    try {
      await UserApi.logout();
    } catch (_) {
      // ignore network errors on logout
    } finally {
      setUser(null);
      setAuthenticated(false);
    }
  };

  return (
    <UserStateContext.Provider
      value={{
        // data
        comments,
        setComments,
        userTask,
        setUserTask,
        teams,
        setTeams,
        task,
        setTask,
        tasks,
        setTasks,
        users,
        setUsers,

        // auth
        user,
        setUser,
        authenticated,
        authLoading,
        setAuthenticated,

        // actions
        login,
        logout,
      }}
    >
      {children}
    </UserStateContext.Provider>
  );
}

export const UseUserContext = () => useContext(UserStateContext);
