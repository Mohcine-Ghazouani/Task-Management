import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Users from "../pages/Users";
import Dashboard from "../pages/Dashboard";
import Layout from "../layouts/Layout";
import GuestLayout from "../layouts/GuestLayout";
import NotFound from "../pages/NotFound";
import UserDashbordLayout from "../layouts/user/UserDashboardLayout";

export const REGISTER_ROUTE= '/register'            
export const LOGIN_ROUTE= '/login'
export const DASHBOARD_ROUTE= '/dashboard'

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },

      

      {
        path: "/users",
        element: <Users />,
      },
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
    ],
  },
]);
