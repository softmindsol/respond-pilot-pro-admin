import { useState } from "react";
import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "../../../assets/svgs";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import {
  useRegisterMutation,
  useGoogleAuthMutation,
} from "../../../store/api/authApi";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../../config/firebase.config.js";
import toast, { Toaster } from "react-hot-toast";

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();
  const [registerUser, { isLoading, error: apiError }] = useRegisterMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match", {
        style: {
          background: "#0F0D0D",
          color: "#fff",
          border: "1px solid #FF5D02",
        },
      });
      return;
    }

    try {
      const { confirmPassword, ...registerData } = data;
      await registerUser(registerData).unwrap();

      toast.success(
        "Registration successful! sent verification code to your email",
        {
          style: {
            background: "#0F0D0D",
            color: "#fff",
            border: "1px solid #4ade80",
          },
          iconTheme: {
            primary: "#FF5D02",
            secondary: "#fff",
          },
        }
      );

      setTimeout(() => {
        navigate("/auth/enter-otp", { state: { email: data.email } });
      }, 1500);
    } catch (err) {
      console.error("Registration failed:", err);
      toast.error(
        err?.data?.message || "Registration failed. Please try again.",
        {
          style: {
            background: "#0F0D0D",
            color: "#fff",
            border: "1px solid #ef4444",
          },
        }
      );
    }
  };

  const [googleAuth, { isLoading: isGoogleLoading }] = useGoogleAuthMutation();
  const [isFirebaseLoading, setIsFirebaseLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    if (isFirebaseLoading) return;
    setIsFirebaseLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken();

      const response = await googleAuth({ idToken: token }).unwrap();

      // Store token (checking various common field names)
      const accessToken =
        response.token || response.accessToken || response.data?.token;
      if (accessToken) {
        localStorage.setItem("token", accessToken);
      }

      toast.success("Signed up successfully!", {
        style: {
          background: "#0F0D0D",
          color: "#fff",
          border: "1px solid #4ade80",
        },
      });
      navigate("/dashboard");
    } catch (err) {
      console.error("Google Signup failed:", err);
      toast.error(err?.data?.message || "Google Signup failed.", {
        style: {
          background: "#0F0D0D",
          color: "#fff",
          border: "1px solid #ef4444",
        },
      });
    } finally {
      setIsFirebaseLoading(false);
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
            disabled={isGoogleLoading || isLoading || isFirebaseLoading}
            className="w-full bg-[#0F0D0D] hover:bg-none hover:border hover:border-white text-white font-medium py-6 disabled:opacity-50 disabled:cursor-not-allowed">
            <FcGoogle className="p-1 bg-white size-7 rounded-full" />
            {isGoogleLoading || isFirebaseLoading
              ? "Connecting..."
              : "Sign up with Google"}
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

          {/* Name Field */}
          <div className="">
            <label className="text-white text-sm font-semibold font-lato">
              Name
            </label>
            <Input
              type="text"
              placeholder="Enter your name"
              {...register("name", {
                required: "Name is required",
                minLength: {
                  value: 2,
                  message: "Name must be at least 2 characters",
                },
                pattern: {
                  value: /^[A-Za-z\s]+$/,
                  message: "Name can only contain letters and spaces",
                },
              })}
            />
            {errors.name && (
              <p className="text-red-500 font-normal font-sans text-xs mt-1">
                {errors.name.message}
              </p>
            )}
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
          <div className="relative">
            <label className="">Password</label>

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

            <span
              className="absolute right-3 top-[38px] text-light hover:text-white transition-colors"
              onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>

            {errors.password && (
              <p className="text-red-500 text-xs font-sans mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="relative">
            <label className="">Confirm Password</label>

            <Input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Enter your Password"
              {...register("confirmPassword", {
                required: "Confirm your Password",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              className="pr-10"
            />

            <span
              className="absolute right-3 top-[38px] text-light hover:text-white transition-colors"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>

            {errors.confirmPassword && (
              <p className="text-red-500 text-xs font-sans mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Login Button */}
          <Button
            onClick={handleSubmit(onSubmit)}
            disabled={isLoading}
            className="w-full font-semibold py-6 rounded-lg transition-colors duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Creating Account..." : "Continue"}
          </Button>

          {/* Sign Up Link */}
          <p className="text-center text-light text-sm">
            If you already have Account?{" "}
            <a
              href="/auth/login"
              className="text-orange center-underline transition-colors ml-1"
            >
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
