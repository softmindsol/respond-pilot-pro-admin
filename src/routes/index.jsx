import { createBrowserRouter, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";

import ErrorPage from "../components/ErrorPage";
import FallBack from "../components/Loaders/fallBack";
import PrivateRoute from "../routes/PrivateRoute";
import PublicRoute from "../routes/PublicRoute";
import AdminLayout from "../components/AdminLayout";

// Lazy load pages
const Login = lazy(() => import("../Pages/Auth/Login"));
const Dashboard = lazy(() => import("../Pages/Dashboard"));
const Users = lazy(() => import("../Pages/Users"));
const Payments = lazy(() => import("../Pages/Payments"));

export const router = createBrowserRouter([
  // Root redirect to login
  {
    path: "/",
    element: <Navigate to="/auth/login" replace />,
  },

  // Auth Routes (Public)
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
    ],
  },

  // Protected Admin Routes
  {
    element: <PrivateRoute />,
    errorElement: <ErrorPage />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          {
            path: "/dashboard",
            element: (
              <Suspense fallback={<FallBack />}>
                <Dashboard />
              </Suspense>
            ),
          },
          {
            path: "/users",
            element: (
              <Suspense fallback={<FallBack />}>
                <Users />
              </Suspense>
            ),
          },
          {
            path: "/payments",
            element: (
              <Suspense fallback={<FallBack />}>
                <Payments />
              </Suspense>
            ),
          },
        ],
      },
    ],
  },
]);
