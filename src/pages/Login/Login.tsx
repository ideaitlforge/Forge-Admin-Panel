import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (Cookies.get("isAuthenticated") === "true") {
      navigate("/dashboard");
    }
  }, [navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string; password: string }>();

  const onSubmit = async (data: { email: string; password: string }) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        "https://forge-backend-self.vercel.app/api/v1/auth/login",
        data,
        { withCredentials: true }
      );
      if (response.data.success) {
        Cookies.set("isAuthenticated", "true", { expires: 7 });
        navigate("/dashboard");
      } else {
        toast.error("Invalid credentials");
      }
    } catch (error) {
      console.error("Login failed", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <div className="mx-auto w-full max-w-md space-y-4 rounded-lg border bg-white p-7 shadow-lg sm:p-10">
        <h1 className="text-3xl font-semibold tracking-tight">Sign In</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2 text-sm">
            <label
              htmlFor="username"
              className="block text-zinc-700 dark:text-zinc-300 font-medium"
            >
              Email
            </label>
            <input
              id="username"
              type="text"
              placeholder="Enter username"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Enter a valid email",
                },
              })}
              className="flex h-10 w-full rounded-md border px-3 py-2 text-sm focus:ring-1 focus-visible:outline-none"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2 text-sm">
            <label
              htmlFor="password"
              className="block text-zinc-700 dark:text-zinc-300 font-medium"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              className="flex h-10 w-full rounded-md border px-3 py-2 text-sm focus:ring-1 focus-visible:outline-none"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            className={`rounded-md px-4 py-2 text-white transition-colors w-full ${
              isLoading
                ? "bg-sky-400 cursor-not-allowed"
                : "bg-sky-500 hover:bg-sky-600 dark:bg-sky-700"
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
