import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { store } from "./store/store";
import setupLocatorUI from "@locator/runtime";
import { injectStore } from "./utils/axiosInstance";
import { logout } from "./store/features/auth/authSlice";

if (import.meta.env.DEV) {
  setupLocatorUI();
}

injectStore(store, logout);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
);
