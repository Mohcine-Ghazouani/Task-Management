import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { LOGIN_ROUTE } from "../../router/index";
import { useEffect, useState } from "react";
import { axiosClient } from "../../api/axios";
import { UseUserContext } from "../../context/UserContext";
import UserApi from "../../services/Api/User/UserApi";

export default function UserDashbordLayout() {
  const { user, setUser, authenticated, setAuthenticated, logout } =
    UseUserContext();

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (authenticated === true) {
      setIsLoading(false);
      UserApi.getUser()
        .then(({ data }) => {
          setUser(data);
          setAuthenticated(true);
        })
        .catch((reason) => {
          console.log(reason);
          logout();
          navigate(LOGIN_ROUTE);
        });
    } else {
      navigate(LOGIN_ROUTE);
    }
  }, [authenticated]);

  const teamId = user.team_id;
  useEffect(() => {
    if (teamId) {
      axiosClient.get(`/teams/${teamId}`).then(({ data }) => {
        setUser((team) => ({ ...team, team: data.team.name }));
      });
    }
  }, [teamId]);

  if (isLoading) return <div>Loading...</div>;

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
