import { Link, useNavigate } from "react-router-dom";
import { ShieldAlert, LogIn } from "lucide-react";

export default function NotAuthorized() {
  const navigate = useNavigate();

  return (
    <main className="min-h-[calc(100vh-8rem)] bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl">
        <div className="rounded-2xl bg-white p-8 shadow-md ring-1 ring-black/5 text-center">
          
          <img
            className="mx-auto mb-4 w-40"
            src="https://media1.tenor.com/m/0Uj2xdcUOw4AAAAC/forbidden-error.gif"
        
          ></img>
          <p className="text-sm font-semibold text-amber-600">403</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Not authorized
          </h1>
          <p className="mt-3 text-gray-600">
            You don’t have permission to access this page.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 rounded-lg  bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600"
            >
              ← Back
            </button>

            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-gray-800 shadow-sm ring-1 ring-gray-200 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              Contact support →
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
