import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Request Interceptor: Attach Token
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

let store = null;
let logoutAction = null;

export const injectStore = (_store, _logoutAction) => {
    store = _store;
    logoutAction = _logoutAction;
};

// Response Interceptor: Handle Errors (Optional: auto-logout on 401)
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            if (store && logoutAction) {
                store.dispatch(logoutAction());
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
