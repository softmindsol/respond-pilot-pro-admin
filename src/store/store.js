import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { authApi } from './api/authApi';
import { subscriptionApi } from './api/subscriptionApi';
import { adminApi } from './api/adminApi';
import authReducer from './features/auth/authSlice';
import youtubeReducer from './features/youtube/youtubeSlice';
import paymentsReducer from './features/payments/paymentSlice';
import usersReducer from './features/users/userSlice';

export const store = configureStore({
    reducer: {
        [authApi.reducerPath]: authApi.reducer,
        [subscriptionApi.reducerPath]: subscriptionApi.reducer,
        [adminApi.reducerPath]: adminApi.reducer,
        auth: authReducer,
        youtube: youtubeReducer,
        payments: paymentsReducer,
        users: usersReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            authApi.middleware,
            subscriptionApi.middleware,
            adminApi.middleware
        ),
});

setupListeners(store.dispatch);
