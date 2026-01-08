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

// Response Interceptor: Handle Errors (Optional: auto-logout on 401)
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        // If 401 Unauthorized, maybe clear token? 
        // Leaving it for the thunks to handle for now.
        return Promise.reject(error);
    }
);

export default axiosInstance;
