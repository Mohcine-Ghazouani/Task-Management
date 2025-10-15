import { Link, useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <main className="min-h-[calc(100vh-8rem)] bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        <div className="rounded-2xl bg-white p-8 shadow-md ring-1 ring-black/5 text-center">
          <img
            className="mx-auto mb-4 w-32"
            src="https://user-images.githubusercontent.com/74038190/235223585-049a7ac0-b529-416d-b504-ed24aea7d99b.gif"
            
          ></img>

          <p className="text-sm font-semibold text-indigo-600">404</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Page not found
          </h1>
          <p className="mt-3 text-gray-600">
            Sorry, we couldn’t find the page you’re looking for.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600"
            >
              ← Back
            </button>
            <Link
              to="#"
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
