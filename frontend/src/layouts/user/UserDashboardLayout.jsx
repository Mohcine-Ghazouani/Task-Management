import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import {LOGIN_ROUTE} from "../../router/index";
import { useEffect } from "react";

export default function UserDashbordLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!window.localStorage.getItem("ACCESS_TOKEN")) {
      navigate(LOGIN_ROUTE);
    }
  }, []);
  return (
    <>
      <header>
        <Navbar />
      </header>
      <main className="main">
        <Outlet />
      </main>
      {/* <footer>footer</footer> */}
    </>
  );
}
