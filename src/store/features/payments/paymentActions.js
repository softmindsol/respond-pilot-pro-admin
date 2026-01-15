import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../utils/axiosInstance";

// Fetch Transactions
export const fetchTransactions = createAsyncThunk(
    "payments/fetchTransactions",
    async ({ page = 1, search = "", status = "" }, { rejectWithValue }) => {
        try {
            // Build query params
            const params = new URLSearchParams();
            params.append("page", page);
            if (search) params.append("search", search);
            if (status && status !== "all") params.append("status", status);

            const response = await axiosInstance.get(`/admin/transactions?${params.toString()}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || { message: "Failed to fetch transactions" }
            );
        }
    }
);

// Fetch Payouts
export const fetchPayouts = createAsyncThunk(
    "payments/fetchPayouts",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get("/admin/payouts");
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || { message: "Failed to fetch payouts" }
            );
        }
    }
);

// Confirm Payout
export const confirmPayout = createAsyncThunk(
    "payments/confirmPayout",
    async ({ userId, amount }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post("/admin/payout-confirm", {
                userId,
                amount,
            });
            return { ...response.data, userId }; // Return userId to help update state if needed
        } catch (error) {
            return rejectWithValue(
                error.response?.data || { message: "Payout confirmation failed" }
            );
        }
    }
);

// Fetch Payment Stats
export const fetchPaymentStats = createAsyncThunk(
    "payments/fetchPaymentStats",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get("/admin/payment-stats");
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || { message: "Failed to fetch payment stats" }
            );
        }
    }
);

