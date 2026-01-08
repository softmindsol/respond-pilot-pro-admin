import { useState } from "react";
import { useForm } from "react-hook-form";
import { Logo } from "../../../assets/svgs";
import { FcGoogle } from "react-icons/fc";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  loginUser,
  googleAuthUser,
  fetchUserProfile,
} from "../../../store/features/auth/authActions";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../../config/firebase.config.js";
import toast, { Toaster } from "react-hot-toast";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, error: authError } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const resultAction = await dispatch(loginUser(data));
      // const response = await resultAction.payload; // For toast or check

      if (loginUser.fulfilled.match(resultAction)) {
        toast.success("Login successful!", {
          style: {
            background: "#0F0D0D",
            color: "#fff",
            border: "1px solid #4ade80",
          },
          iconTheme: {
            primary: "#FF5D02",
            secondary: "#fff",
          },
        });

        const user = resultAction?.payload;
        if (user && user.isConnectedToYoutube) {
          navigate("/dashboard");
          await dispatch(fetchUserProfile());
        } else {
          navigate("/onboarding");
        }

        // Trigger profile fetch immediately as requested
      } else {
        throw resultAction.payload || { message: "Login failed" };
      }
    } catch (err) {
      console.error("Login failed:", err);
      toast.error(err?.message || "Login failed. Please try again.", {
        style: {
          background: "#0F0D0D",
          color: "#fff",
          border: "1px solid #ef4444",
        },
      });
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken();

      const resultAction = await dispatch(googleAuthUser({ idToken: token }));

      if (googleAuthUser.fulfilled.match(resultAction)) {
        toast.success("Google Login successful!", {
          style: {
            background: "#0F0D0D",
            color: "#fff",
            border: "1px solid #4ade80",
          },
        });
        const user = resultAction?.payload;

        if (user && user.isConnectedToYoutube) {
          navigate("/dashboard");
          await dispatch(fetchUserProfile());
        } else {
          navigate("/onboarding");
        }
      } else {
        throw resultAction.payload || { message: "Google Login failed" };
      }
    } catch (err) {
      console.error("Google Login Failed", err);
      toast.error(err?.message || "Google Login failed.", {
        style: {
          background: "#0F0D0D",
          color: "#fff",
          border: "1px solid #ef4444",
        },
      });
    }
  };

  return (
    <div className="min-h-[580px] max-w-[420px] w-full bg-black rounded-xl flex items-center justify-center px-[30px] py-[46px]">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="w-full relative">
        {/* Header */}
        <div className="text-center mb-8">
          <img
            className="mb-4 mx-auto w-36"
            src={Logo}
            alt="respond_pilot_pro"
          />
          <p className="text-white text-base font-bold font-lato mb-1">
            Welcome to Respond Pilot Pro
          </p>
          <p className="text-light text-sm font-semibold font-lato">
            Sign in or Sign Up
          </p>
        </div>

        <div className="space-y-4">
          {/* Google Sign In */}
          <Button
            type="button"
            onClick={() => handleGoogleSignIn()}
            disabled={isLoading}
            className="w-full bg-[#0F0D0D] hover:bg-none hover:border hover:border-white text-white font-medium py-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FcGoogle className="p-1 bg-white size-7 rounded-full" />
            {isLoading ? "Connecting..." : "Sign up with Google"}
          </Button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-dark text-gray">OR</span>
            </div>
          </div>

          {/* Email Field */}
          <div className="">
            <label className="text-white text-sm font-semibold font-lato">
              Email
            </label>
            <Input
              type="email"
              placeholder="Enter your Email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              className=""
            />
            {errors.email && (
              <p className="text-red-500 font-normal font-sans text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="">
            <label className="">Password</label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your Password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs font-sans mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="remember"
                {...register("remember")}
                className="w-4 h-4 bg-transparent accent-orange border-gray-600 rounded cursor-pointer"
              />
              <label
                htmlFor="remember"
                className="text-white text-sm cursor-pointer"
              >
                Remember Me
              </label>
            </div>
            <a
              href="/auth/forgot-password"
              className="text-orange text-sm center-underline transition-colors"
            >
              Forget Password
            </a>
          </div>

          {/* Login Button */}
          <Button
            onClick={handleSubmit(onSubmit)}
            disabled={isLoading}
            className="w-full font-semibold py-6 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>

          {/* Sign Up Link */}
          <p className="text-center text-light text-sm">
            If you don't have Account?{" "}
            <a
              href="/auth/sign-up"
              className="text-orange center-underline transition-colors ml-1"
            >
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
