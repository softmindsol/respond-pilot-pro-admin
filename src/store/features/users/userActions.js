import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../utils/axiosInstance";

// Fetch Users
export const fetchUsers = createAsyncThunk(
    "users/fetchUsers",
    async ({ page = 1, limit = 10, search = "", plan = "all", affiliateTier = "all" }, { rejectWithValue }) => {
        try {
            const params = new URLSearchParams();
            params.append("page", page);
            params.append("limit", limit);
            if (search) params.append("search", search);
            if (plan && plan !== "all") params.append("plan", plan);
            if (affiliateTier && affiliateTier !== "all") params.append("affiliateTier", affiliateTier);

            const response = await axiosInstance.get(`/admin/users?${params.toString()}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || { message: "Failed to fetch users" }
            );
        }
    }
);

// Update User Tier
export const updateUserTier = createAsyncThunk(
    "users/updateUserTier",
    async ({ userId, tier }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put("/admin/update-tier", {
                userId,
                tier
            });
            return { ...response.data, userId, tier };
        } catch (error) {
            return rejectWithValue(
                error.response?.data || { message: "Failed to update tier" }
            );
        }
    }
);
