import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, EyeIcon, EyeOffIcon } from "lucide-react";
import { UseUserContext } from "../../context/UserContext";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ADMIN_DASHBOARD_ROUTE, DASHBOARD_ROUTE } from "../../router/index";

const formSchema = z.object({
  email: z.string().email("Enter a valid email").nonempty("Email is required"),
  password: z.string().nonempty("Password is required"),
});

export default function MemberLogin() {
  const navigate = useNavigate();
  const { login, setAuthenticated, authenticated, user } = UseUserContext();
  const [showPassword, setShowPassword] = useState(false);
  const [globalError, setGlobalError] = useState("");

  useEffect(() => {
    if (authenticated) {
      const role = user?.role;
      if (role === "Member") navigate(DASHBOARD_ROUTE);
      if (role === "Admin") navigate(ADMIN_DASHBOARD_ROUTE);
    }
  }, [authenticated, user, navigate]);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
    mode: "onTouched",
  });

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = form;

  const onSubmit = async (values) => {
    setGlobalError("");
    try {
      const { status, data } = await login(values.email, values.password);
      if (status === 200) {
        setAuthenticated(true);
        const role = data.user?.role;
        if (role === "Member") navigate(DASHBOARD_ROUTE);
        if (role === "Admin") navigate(ADMIN_DASHBOARD_ROUTE);
      }
    } catch (e) {
      const resp = e?.response?.data;
      const emailMsg =
        resp?.errors?.email?.join?.() ||
        resp?.message ||
        "Invalid credentials. Please try again.";
      // field-level + global feedback
      setError("email", { message: emailMsg });
      setError("password", { message: " " }); // nudge red outline on password too
      setGlobalError(emailMsg);
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
          <h2 className="text-xl font-bold text-gray-900 text-center">
            Sign in to your account
          </h2>

          {!!globalError && (
            <div
              className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
              role="alert"
              aria-live="assertive"
            >
              {globalError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-900">
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                {...register("email")}
                className={`mt-2 block w-full rounded-lg border bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 ${
                  errors.email ? "border-red-300 ring-1 ring-red-200" : "border-gray-300"
                }`}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
              {errors.email && (
                <p id="email-error" className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-gray-900">
                  Password
                </label>
                {/* Add your forgot password route later if needed */}
              </div>
              <div className="relative mt-2">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  {...register("password")}
                  className={`block w-full rounded-lg border bg-white px-3 py-2 pr-10 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 ${
                    errors.password ? "border-red-300 ring-1 ring-red-200" : "border-gray-300"
                  }`}
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? "password-error" : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute inset-y-0 right-2 flex items-center rounded-md px-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                </button>
              </div>
              {errors.password && (
                <p id="password-error" className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
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
                  Signing in…
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          {/* Bottom text */}
          <p className="mt-6 text-center text-sm text-gray-500">
            Not a member?{" "}
            <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-500">
              Register
            </Link>
          </p>
        </div>

        {/* Tiny helper text */}
        <p className="mt-4 text-center text-xs text-gray-400">
          Protected by best practices. Do not share your password.
        </p>
      </div>
    </div>
  );
}
