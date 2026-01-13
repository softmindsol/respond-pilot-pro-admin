import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../utils/axiosInstance";

// Login User
export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async (credentials, { rejectWithValue }) => {
        try {
            console.log(credentials);
            const response = await axiosInstance.post("/auth/admin/login", credentials);
            return response.data;
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

// Answer User Profile
export const fetchUserProfile = createAsyncThunk(
    "auth/fetchUserProfile",
    async (_, { rejectWithValue }) => {
        try {
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

// Login Admin
export const loginAdmin = createAsyncThunk(
    "auth/loginAdmin",
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post("/auth/admin/login", credentials);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || { message: "Admin Login failed" }
            );
        }
    }
);
