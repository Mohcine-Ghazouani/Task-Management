import UserDashbord from "../components/auth/UserDashboard"


export default function Dashboard() {
    return (
        <>
            <div className="container m-20 mx-auto w-1/2">
                <h1 className="text-2xl font-bold text-center">Dashboard</h1>
                <UserDashbord />
            </div>
            
        </>
    );
}
