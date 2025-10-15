import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, EyeIcon, EyeOffIcon } from "lucide-react";
import { axiosClient } from "../../api/axios";
import { useNavigate, Link } from "react-router-dom";

// --- Validation ---
const schema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    password_confirmation: z.string().min(8, "Confirm password must be at least 8 characters"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    path: ["password_confirmation"],
    message: "Passwords do not match",
  });

export default function Register() {
  const navigate = useNavigate();
  const [globalError, setGlobalError] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
    },
    mode: "onTouched",
  });

  const onSubmit = async (values) => {
    setGlobalError("");
    try {
      // CSRF
      await axiosClient.get("/sanctum/csrf-cookie", {
        baseURL: import.meta.env.VITE_BACKEND_URL,
      });

      // Register
      await axiosClient.post("/register", values);

      // Success → go to member dashboard (adjust if you want role-based routing)
      navigate("/dashboard");
    } catch (error) {
      const server = error?.response?.data;
      if (server?.errors) {
        // Field errors from backend
        Object.entries(server.errors).forEach(([field, msgs]) => {
          setError(field, { message: Array.isArray(msgs) ? msgs[0] : String(msgs) });
        });
      } else {
        setGlobalError(server?.message || "Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="mb-6 flex items-center justify-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-gray-100 text-gray-700">
            TM
          </div>
          <div className="text-lg font-semibold text-gray-900">Task Manager</div>
        </div>

        {/* Card */}
        <div className="rounded-2xl bg-white p-6 shadow-md ring-1 ring-black/5">
          <h2 className="text-xl font-bold text-gray-900 text-center">Create an account</h2>

          {!!globalError && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700" role="alert">
              {globalError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-900">
                Name
              </label>
              <input
                id="name"
                {...register("name")}
                className={`mt-2 block w-full rounded-lg border bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 ${
                  errors.name ? "border-red-300 ring-1 ring-red-200" : "border-gray-300"
                }`}
                aria-invalid={!!errors.name}
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-900">
                Email address
              </label>
              <input
                id="email"
                type="email"
                {...register("email")}
                className={`mt-2 block w-full rounded-lg border bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 ${
                  errors.email ? "border-red-300 ring-1 ring-red-200" : "border-gray-300"
                }`}
                aria-invalid={!!errors.email}
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-900">
                Password
              </label>
              <div className="relative mt-2">
                <input
                  id="password"
                  type={showPw ? "text" : "password"}
                  {...register("password")}
                  className={`block w-full rounded-lg border bg-white px-3 py-2 pr-10 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 ${
                    errors.password ? "border-red-300 ring-1 ring-red-200" : "border-gray-300"
                  }`}
                  aria-invalid={!!errors.password}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute inset-y-0 right-2 flex items-center rounded-md px-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  aria-label={showPw ? "Hide password" : "Show password"}
                >
                  {showPw ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-900">
                Confirm Password
              </label>
              <div className="relative mt-2">
                <input
                  id="password_confirmation"
                  type={showPw2 ? "text" : "password"}
                  {...register("password_confirmation")}
                  className={`block w-full rounded-lg border bg-white px-3 py-2 pr-10 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 ${
                    errors.password_confirmation ? "border-red-300 ring-1 ring-red-200" : "border-gray-300"
                  }`}
                  aria-invalid={!!errors.password_confirmation}
                />
                <button
                  type="button"
                  onClick={() => setShowPw2((v) => !v)}
                  className="absolute inset-y-0 right-2 flex items-center rounded-md px-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  aria-label={showPw2 ? "Hide confirm password" : "Show confirm password"}
                >
                  {showPw2 ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                </button>
              </div>
              {errors.password_confirmation && (
                <p className="mt-1 text-sm text-red-600">{errors.password_confirmation.message}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex w-full items-center justify-center rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account…
                </>
              ) : (
                "Create account"
              )}
            </button>
          </form>

          {/* Bottom text */}
          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link to="/" className="font-semibold text-indigo-600 hover:text-indigo-500">
              Login
            </Link>
          </p>
        </div>

        {/* Tiny helper text */}
        <p className="mt-4 text-center text-xs text-gray-400">
          By registering, you agree to our Terms and acknowledge our Privacy Policy.
        </p>
      </div>
    </div>
  );
}
