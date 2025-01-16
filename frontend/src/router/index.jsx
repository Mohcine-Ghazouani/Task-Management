import { createBrowserRouter } from "react-router-dom";

import Login from "../components/auth/Login";
import Register from "../components/auth/Register";
import Users from "../pages/Users";
import Dashboard from "../pages/Dashboard";
import AdminDashboard from "../pages/AdminDashboard";
import Profile from "../pages/Profile";
import Layout from "../layouts/Layout";
import GuestLayout from "../layouts/GuestLayout";
import NotFound from "../pages/NotFound";

import UserDashbordLayout from "../layouts/user/UserDashboardLayout";
import AdminDashbordLayout from "../layouts/Admin/AdminDashboardLayout";
import AddTask from "../pages/AddTask";
import AddUser from "../pages/AddUser";
import Teams from "../pages/Teams";
import AddTeam from "../pages/AddTeam";
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
        path: "/users",
        element: <Users />,
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
        element: (
          
          <Profile />
   
        ),
      },
    ],
  },
]);
