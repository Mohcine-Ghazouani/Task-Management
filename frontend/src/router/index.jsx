import { createBrowserRouter } from "react-router-dom";

import Login from "../components/auth/Login";
import Register from "../components/auth/Register";

import Layout from "../layouts/Layout";
import GuestLayout from "../layouts/GuestLayout";
import UserDashbordLayout from "../layouts/user/UserDashboardLayout";
import AdminDashbordLayout from "../layouts/Admin/AdminDashboardLayout";

import AdminDashboard from "../pages/Admin/AdminDashboard";
import Tasks from "../pages/Admin/Tasks";
import AddTask from "../pages/Admin/AddTask";
import AddUser from "../pages/Admin/AddUser";
import Teams from "../pages/Admin/Teams";
import AddTeam from "../pages/Admin/AddTeam";

import Dashboard from "../pages/Member/Dashboard";

import Profile from "../pages/Profile";
import NotFound from "../pages/NotFound";

//import ProtectedRoute from "./ProtectedRoute";

export const REGISTER_ROUTE = "/register";
export const LOGIN_ROUTE = "/";
export const DASHBOARD_ROUTE = "/dashboard";
export const ADMIN_DASHBOARD_ROUTE = "/admindashboard";
export const PROFILE_ROUTE = "/profile";
export const ADMIN_PROFILE_ROUTE = "/adminprofile";

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
  {
    element: <GuestLayout />,
    children: [
      {
        path: LOGIN_ROUTE,
        element: <Login />,
      },
      {
        path: REGISTER_ROUTE,
        element: <Register />,
      },
    ],
  },
  {
    element: (
      //<ProtectedRoute allowedRoles={["Member"]}>
      <UserDashbordLayout />
      //</ProtectedRoute>
    ),
    children: [
      {
        path: DASHBOARD_ROUTE,
        element: <Dashboard />,
      },
      {
        path: PROFILE_ROUTE,
        element: <Profile />,
      },
    ],
  },
  {
    element: (
      //<ProtectedRoute allowedRoles={["Admin"]}>
      <AdminDashbordLayout />
      //</ProtectedRoute>
    ),
    children: [
      {
        path: ADMIN_DASHBOARD_ROUTE,
        element: <AdminDashboard />,
      },
      {
        path: "/teams",
        element: <Teams />,
      },
      {
        path: "/add-team",
        element: <AddTeam />,
      },

      {
        path: "/Tasks",
        element: <Tasks />,
      },
      {
        path: "/add-user",
        element: <AddUser />,
      },
      {
        path: "/add-task",
        element: <AddTask />,
      },
      {
        path: ADMIN_PROFILE_ROUTE,
        element: <Profile />,
      },
    ],
  },
]);
