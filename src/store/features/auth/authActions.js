import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../utils/axiosInstance";

// Mock credentials for testing (remove in production)
const MOCK_ADMIN = {
    email: "admin@respondpilot.com",
    password: "Admin@123",
};

const MOCK_USER = {
    id: "admin-001",
    name: "Admin User",
    email: "admin@respondpilot.com",
    role: "admin",
    avatar: "",
};

// Login User
export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async (credentials, { rejectWithValue }) => {
        try {
            // Mock login for development (remove in production)
            if (credentials.email === MOCK_ADMIN.email && credentials.password === MOCK_ADMIN.password) {
                const mockToken = "mock-jwt-token-" + Date.now();
                localStorage.setItem("token", mockToken);
                return { token: mockToken, user: MOCK_USER };
            }

            // If not mock credentials, try real API
            if (import.meta.env.VITE_API_BASE_URL) {
                const response = await axiosInstance.post("/auth/login", credentials);
                return response.data;
            }

            return rejectWithValue({ message: "Invalid email or password" });
        } catch (error) {
            return rejectWithValue(
                error.response?.data || { message: "Login failed" }
            );
        }
    }
);

// Google Auth
export const googleAuthUser = createAsyncThunk(
    "auth/googleAuthUser",
    async (idToken, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post("/auth/google", { idToken });
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || { message: "Google Auth failed" }
            );
        }
    }
);

// Get User Profile
export const fetchUserProfile = createAsyncThunk(
    "auth/fetchUserProfile",
    async (_, { rejectWithValue }) => {
        try {
            // Mock profile for development - check if using mock token
            const token = localStorage.getItem("token");
            if (token?.startsWith("mock-jwt-token")) {
                return MOCK_USER;
            }

            const response = await axiosInstance.get("/auth/profile", {
                headers: {
                    "Cache-Control": "no-cache",
                    Pragma: "no-cache",
                    Expires: "0",
                },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || { message: "Failed to fetch profile" }
            );
        }
    }
);
