import { createBrowserRouter, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";

import ErrorPage from "../components/ErrorPage";
import Dashboard from "../Pages/Dashboard";
import FallBack from "../components/Loaders/fallBack";
import PrivateRoute from "../routes/PrivateRoute";
import PublicRoute from "../routes/PublicRoute";
import InputOtp from "../Pages/Auth/InputOtp";
import VerifyOtp from "../Pages/Auth/Signup/VerifyOtp";
import AdminLayout from "../components/AdminLayout";
import ForgotPassword from "../Pages/Auth/ForgotPassword";
import PasswordReset from "../Pages/Auth/PasswordReset";

const Login = lazy(() => import("../Pages/Auth/Login"));

export const router = createBrowserRouter([
  // -----------------------------------------------
  // ROOT REDIRECT TO LOGIN
  // -----------------------------------------------
  {
    path: "/",
    element: <Navigate to="/auth/login" replace />,
  },

  // -----------------------------------------------
  // 1. AUTH ROUTES (/auth/...)
  // -----------------------------------------------
  {
    path: "/auth",
    element: (
      <Suspense fallback={<FallBack />}>
        <PublicRoute />
      </Suspense>
    ),
    errorElement: <ErrorPage />,
    children: [
      { path: "login", element: <Login /> },
      { path: "forgot-password", element: <ForgotPassword /> },
      { path: "verify-otp", element: <InputOtp /> },
      { path: "password-reset", element: <PasswordReset /> },
      { path: "enter-otp", element: <VerifyOtp /> },
    ],
  },

  // -----------------------------------------------
  // 2. PROTECTED ROUTES (Private Routes)
  // -----------------------------------------------

  {
    element: <PrivateRoute />,
    errorElement: <ErrorPage />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          {
            path: "/dashboard",
            element: <Dashboard />,
          },
        ],
      },
    ],
  },
]);
