// src/layouts/GuestLayout.jsx
import { Outlet, Navigate } from "react-router-dom";
import { UseUserContext } from "../context/UserContext";
import { ADMIN_DASHBOARD_ROUTE, DASHBOARD_ROUTE } from "../router";

export default function GuestLayout() {
  const { authenticated, user, authLoading } = UseUserContext();

  // Wait for auth bootstrap to finish
  if (authLoading) {
    return (
      <div className="grid min-h-[40vh] place-items-center text-sm text-gray-600">
        Checking your session…
      </div>
    );
  }

  // If already logged in, push away from guest (login/register) pages
  if (authenticated) {
    const role = user?.role; // SAFE read (no destructuring)
    return (
      <Navigate
        to={role === "Admin" ? ADMIN_DASHBOARD_ROUTE : DASHBOARD_ROUTE}
        replace
      />
    );
  }

  // Not authenticated → render guest routes (Login/Register)
  return (
    <main className="main flex-grow transition-all duration-300 ease-in-out mx-4 md:mx-0">
      <Outlet />
    </main>
  );
}
