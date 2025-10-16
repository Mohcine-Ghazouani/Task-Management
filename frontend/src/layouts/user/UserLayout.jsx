import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { LOGIN_ROUTE } from "../../router/index";
import { useEffect } from "react";
import { axiosClient } from "../../api/axios";
import { UseUserContext } from "../../context/UserContext";

export default function UserLayout() {
  const { user, setUser, authenticated, authLoading } = UseUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading) return; // wait for context bootstrap
    if (!authenticated) {
      navigate(LOGIN_ROUTE, { replace: true });
    }
  }, [authLoading, authenticated, navigate]);

  useEffect(() => {
    if (!authenticated || !user?.team_id || user?.team) return;

    let mounted = true;

    axiosClient
      .get(`/teams/${user.team_id}`)
      .then(({ data }) => {
        if (!mounted) return;
        setUser((u) => ({ ...u, team: data.team.name }));
      })
      .catch((err) => {
        console.error("Failed to load team name:", err);
      });

    return () => {
      mounted = false;
    };
  }, [authenticated, user?.team_id, user?.team, setUser]);

  // Wait for auth bootstrap to finish
  if (authLoading) {
    return (
      <div className="grid min-h-[40vh] place-items-center text-sm text-gray-600">
        Checking your session…
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Fixed Navbar */}
      <header className="fixed inset-x-0 top-0 z-30">
        <Navbar />
      </header>

      {/* Main content (offset for the navbar height ≈ h-16) */}
      <main className="mt-24 flex-1 px-4 md:px-10 lg:px-20">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-600 text-white p-4 mt-8">
        <Footer />
      </footer>
    </div>
  );
}
