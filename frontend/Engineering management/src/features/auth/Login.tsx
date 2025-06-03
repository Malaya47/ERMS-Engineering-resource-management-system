import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import api from "@/lib/axios";
import { useAuthStore } from "./useAuthStore";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type LoginForm = z.infer<typeof schema>;

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(schema),
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const setAuth = useAuthStore((state) => state.setAuth);
  const logout = useAuthStore((state) => state.logout);
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if already logged in
    if (user?.data?.role === "manager" && token) {
      navigate("/dashboard/manager/team");
    } else if (user?.data?.role === "engineer" && token) {
      navigate("/dashboard/engineer/assignments");
    }
    // If token exists but user is not set, fetch user data
  }, [token]);

  const onSubmit = async (data: LoginForm) => {
    try {
      setLoading(true);
      const res = await api.post("/auth/login", data);
      setAuth(res.data?.token, res.data?.user);
      if (res.data?.user?.role === "manager") {
        navigate("/dashboard/manager/team");
      } else if (res.data?.user?.role === "engineer") {
        navigate("/dashboard/engineer/assignments");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-black text-white px-4 py-12">
      <div className="mb-8 md:mb-0 md:mr-10 text-center md:text-left max-w-xs md:max-w-sm">
        <h1 className="text-2xl font-bold mb-2">
          ERMS - Engineering Resource Management System
        </h1>
        {token && (
          <Button
            className="mt-2 bg-red-500 text-white hover:bg-red-600"
            onClick={handleLogout}
          >
            Logout
          </Button>
        )}
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-sm bg-white text-black p-6 rounded-lg shadow space-y-5"
      >
        <h2 className="text-xl font-semibold text-center">Login</h2>

        <div>
          <Input {...register("email")} placeholder="Email" />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>

        <div>
          <Input
            type="password"
            {...register("password")}
            placeholder="Password"
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <Button
          className="w-full bg-black text-white hover:bg-gray-900"
          type="submit"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </Button>
      </form>
    </div>
  );
}
