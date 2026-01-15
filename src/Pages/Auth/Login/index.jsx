import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Loader2, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { loginAdmin, fetchUserProfile } from "@/store/features/auth/authActions";
import { Logo } from "../../../assets/svgs";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data) => {
    try {
      const result = await dispatch(loginAdmin(data));

      if (loginAdmin.fulfilled.match(result)) {
        toast.success("Login successful!");
        await dispatch(fetchUserProfile());
        navigate("/users");
      } else {
        throw result.payload || { message: "Login failed" };
      }
    } catch (err) {
      toast.error(err?.message || "Login failed. Please try again.");
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center p-4 bg-[#0f0d0d]">


      <Card className="w-full max-w-md bg-dark border-[#363A42]">
        <CardHeader className="text-center space-y-2">
          <img className="w-44 mx-auto" src={Logo} alt="Respond_Pilot_Pro" />
          <CardTitle className="text-2xl font-bold text-white">
            Admin Login
          </CardTitle>
          <CardDescription className="text-gray-400">
            Sign in to access the admin dashboard
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                className="bg-[#0f0d0d] border-[#2a2828] text-white placeholder:text-gray-500 focus:border-[#FEC36D]"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="bg-[#0f0d0d] border-[#2a2828] text-white placeholder:text-gray-500 focus:border-[#FEC36D] pr-10"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-gradient-to-r from-[#FEC36D] to-[#D78001] hover:from-[#D78001] hover:to-[#FEC36D] text-white font-semibold"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
