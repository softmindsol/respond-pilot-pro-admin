import { createSlice } from "@reduxjs/toolkit";
import { fetchUsers, updateUserTier } from "./userActions";

const initialState = {
    users: [],
    totalPages: 1,
    loadingUsers: false,
    error: null,
    updatingUserId: null, // To track which user is currently being updated
};

const userSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
        clearUserError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        // --- Fetch Users ---
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.loadingUsers = true;
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loadingUsers = false;
                state.users = action.payload.users || [];
                state.totalPages = action.payload.pages || 1;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loadingUsers = false;
                state.error = action.payload?.message || "Failed to load users";
            });

        // --- Update User Tier ---
        builder
            .addCase(updateUserTier.pending, (state, action) => {
                state.updatingUserId = action.meta.arg.userId;
                state.error = null;
            })
            .addCase(updateUserTier.fulfilled, (state, action) => {
                state.updatingUserId = null;
                // Optimistically update the local state
                const { userId, tier } = action.payload;
                const user = state.users.find(u => u._id === userId);
                if (user) {
                    user.affiliateTier = tier;
                }
            })
            .addCase(updateUserTier.rejected, (state, action) => {
                state.updatingUserId = null;
                state.error = action.payload?.message || "Failed to update user";
            });
    },
});

export const { clearUserError } = userSlice.actions;
export default userSlice.reducer;
