import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import {LOGIN_ROUTE} from "../../router/index";
import { useEffect } from "react";
// import { axiosClient } from "../../api/axios";

export default function UserDashbordLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!window.localStorage.getItem("ACCESS_TOKEN")) {
      navigate(LOGIN_ROUTE);
    }
    // axiosClient.get('/user').then((respence)=>{
    //  console.log(respence)
    // });
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
