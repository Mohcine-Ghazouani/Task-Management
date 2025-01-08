//import UserLogin from "../components/auth/UserLogin";
import MemberLogin from "../components/auth/MemberLogin";
export default function Login() {
  return (
    <>
      <div className="container m-20 mx-auto w-1/2">
        {/* <h1 className="text-2xl font-bold text-center">Login</h1> */}
        {/* <UserLogin /> */}
        <MemberLogin />
      </div>
    </>
  );
}
