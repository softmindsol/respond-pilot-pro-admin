import { createSlice } from "@reduxjs/toolkit";
import { fetchTransactions, fetchPayouts, confirmPayout, fetchPaymentStats } from "./paymentActions";

const initialState = {
    transactions: [],
    totalPages: 1,
    loadingTransactions: false,

    payouts: [],
    loadingPayouts: false,

    stats: {
        totalRevenue: 0,
        monthlyRevenue: 0,
        pendingPayouts: 0,
        successRate: 0
    },
    loadingStats: false,

    processingPayoutId: null,
    error: null,
};

const paymentSlice = createSlice({
    name: "payments",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // --- Transactions ---
        builder
            .addCase(fetchTransactions.pending, (state) => {
                state.loadingTransactions = true;
                state.error = null;
            })
            .addCase(fetchTransactions.fulfilled, (state, action) => {
                state.loadingTransactions = false;
                state.transactions = action.payload.transactions || [];
                state.totalPages = action.payload.pages || 1;
            })
            .addCase(fetchTransactions.rejected, (state, action) => {
                state.loadingTransactions = false;
                state.error = action.payload?.message || "Failed to fetch transactions";
            });

        // --- Payouts ---
        builder
            .addCase(fetchPayouts.pending, (state) => {
                state.loadingPayouts = true;
                state.error = null;
            })
            .addCase(fetchPayouts.fulfilled, (state, action) => {
                state.loadingPayouts = false;
                state.payouts = action.payload || [];
            })
            .addCase(fetchPayouts.rejected, (state, action) => {
                state.loadingPayouts = false;
                state.error = action.payload?.message || "Failed to fetch payouts";
            });

        // --- Confirm Payout ---
        builder
            .addCase(confirmPayout.pending, (state, action) => {
                state.processingPayoutId = action.meta.arg.userId;
                state.error = null;
            })
            .addCase(confirmPayout.fulfilled, (state, action) => {
                state.processingPayoutId = null;
                // Remove the paid user from the list
                state.payouts = state.payouts.filter(p => p._id !== action.payload.userId);
                
                // Update pending payouts stats immediately
                if (state.stats) {
                    state.stats.pendingPayouts = Math.max(0, state.stats.pendingPayouts - (action.meta.arg.amount || 0));
                }
            })
            .addCase(confirmPayout.rejected, (state, action) => {
                state.processingPayoutId = null;
                state.error = action.payload?.message || "Payout failed";
            });

        // --- Stats ---
        builder
            .addCase(fetchPaymentStats.pending, (state) => {
                state.loadingStats = true;
                state.error = null;
            })
            .addCase(fetchPaymentStats.fulfilled, (state, action) => {
                state.loadingStats = false;
                // Assuming payload matches structure or map it
                state.stats = {
                    totalRevenue: action.payload.totalRevenue || 0,
                    monthlyRevenue: action.payload.monthlyRevenue || 0,
                    pendingPayouts: action.payload.pendingPayouts || 0,
                    successRate: action.payload.successRate || 0
                };
            })
            .addCase(fetchPaymentStats.rejected, (state, action) => {
                state.loadingStats = false;
                state.error = action.payload?.message || "Failed to fetch stats";
            });
    },
});

export const { clearError } = paymentSlice.actions;
export default paymentSlice.reducer;
