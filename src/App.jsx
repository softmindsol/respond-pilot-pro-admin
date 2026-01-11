import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { Suspense } from "react";
import FallBack from "./components/Loaders/fallBack";

import { Toaster } from "react-hot-toast";

export default function App() {
  return (
    <>
      <Toaster position="top-right" toastOptions={{ duration: 5000 }} />
      <Suspense fallback={<FallBack />}>
        <RouterProvider router={router} />
      </Suspense>
    </>
  );
}
