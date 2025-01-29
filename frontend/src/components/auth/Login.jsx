import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader, EyeIcon, EyeOffIcon } from "lucide-react";
import { UseUserContext } from "../../context/UserContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ADMIN_DASHBOARD_ROUTE, DASHBOARD_ROUTE } from "../../router/index";

const formSchema = z.object({
  email: z.string().email().nonempty("Email is required"),
  password: z.string().nonempty("Password is required"),
});

export default function MemberLogin() {
  const navigate = useNavigate();
  const { login, setAuthenticated, authenticated, user } = UseUserContext();
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (authenticated) {
      const { role } = user;
      switch (role) {
        case "Member":
          navigate(DASHBOARD_ROUTE);
          break;
        case "Admin":
          navigate(ADMIN_DASHBOARD_ROUTE);
          break;
      }
    }
  }, [authenticated, user, navigate]);

  const form = useForm({
    resolver: zodResolver(formSchema),
  });

  const {
    setError,
    formState: { errors, isSubmitting },
  } = form;

  const onSubmit = async (values) => {
    await login(values.email, values.password)
      .then(({ status, data }) => {
        if (status === 200) {
          setAuthenticated(true);
          const { role } = data.user;
          switch (role) {
            case "Member":
              navigate(DASHBOARD_ROUTE);
              break;
            case "Admin":
              navigate(ADMIN_DASHBOARD_ROUTE);
              break;
          }
          console.log(role);
          console.log(data);
        }
      })
      .catch(({ response }) => {
        setError("email", {
          message: response.data.errors.email.join(),
        });
      });
  };

  return (
    <div className="flex flex-col justify-center flex-1 min-h-full py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 font-bold tracking-tight text-center text-gray-900 text-2xl/9">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block font-medium text-gray-900 text-sm/6"
            >
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                {...form.register("email")}
                autoComplete="email"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block font-medium text-gray-900 text-sm/6"
              >
                Password
              </label>
              <div className="text-sm">
                <a
                  href="#"
                  className="font-semibold text-indigo-600 hover:text-indigo-500"
                >
                  Forgot password?
                </a>
              </div>
            </div>
            <div className="relative mt-2">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                {...form.register("password")}
                autoComplete="current-password"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 flex items-center px-2 text-gray-500 right-2"
              >
                {showPassword ? (
                  <EyeOffIcon size={20} />
                ) : (
                  <EyeIcon size={20} />
                )}
              </button>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>
            {/* <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                {...form.register("password")}
                autoComplete="current-password"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div> */}
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Login {isSubmitting && <Loader className="ml-2 animate-spin" />}
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-gray-500 text-sm/6">
          Not a member?{" "}
          <a
            href="/register"
            className="font-semibold text-indigo-600 hover:text-indigo-500"
          >
            Register
          </a>
        </p>
      </div>
    </div>
  );
}
