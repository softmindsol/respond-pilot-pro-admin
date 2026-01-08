import { createSlice } from "@reduxjs/toolkit";
import { loginUser, googleAuthUser, fetchUserProfile } from "./authActions";

const initialState = {
    user: null,
    token: localStorage.getItem("token") || null,
    isLoading: false,
    error: null,
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.status = "idle";
            state.error = null;
            localStorage.removeItem("token");
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // --- Login User ---
        builder
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.status = "loading";
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.status = "succeeded";
                // Handle token storage
                const token =
                    action.payload.token ||
                    action.payload.accessToken ||
                    action.payload.data?.token;

                if (token) {
                    state.token = token;
                    localStorage.setItem("token", token);
                }

                // Sometimes login returns user data too
                if (action.payload.user) {
                    state.user = action.payload.user;
                }
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.status = "failed";
                state.error = action.payload;
            });

        // --- Google Auth ---
        builder
            .addCase(googleAuthUser.pending, (state) => {
                state.isLoading = true;
                state.status = "loading";
                state.error = null;
            })
            .addCase(googleAuthUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.status = "succeeded";
                const token =
                    action.payload.token ||
                    action.payload.accessToken ||
                    action.payload.data?.token;

                if (token) {
                    state.token = token;
                    localStorage.setItem("token", token);
                }
                if (action.payload.user) {
                    state.user = action.payload.user;
                }
            })
            .addCase(googleAuthUser.rejected, (state, action) => {
                state.isLoading = false;
                state.status = "failed";
                state.error = action.payload;
            });

        // --- Fetch User Profile ---
        builder
            .addCase(fetchUserProfile.pending, (state) => {
                // We might not want to show global loading for background profile fetches
                // But for consistency:
                state.isLoading = true;
                state.status = "loading";
            })
            .addCase(fetchUserProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.status = "succeeded";
                state.user = action.payload; // Assuming payload is the user object
            })
            .addCase(fetchUserProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.status = "failed";
                state.error = action.payload;
            });
    },
}); 

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
