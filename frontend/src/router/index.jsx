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
    element: <UserDashbordLayout />,
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
    element: <AdminDashbordLayout />,
    children: [
      {
        path: ADMIN_DASHBOARD_ROUTE,
        element: <AdminDashboard />,
      },

      {
        path: "/users",
        element: <Users />,
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
