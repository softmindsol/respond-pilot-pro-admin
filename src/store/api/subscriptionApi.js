import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const subscriptionApi = createApi({
    reducerPath: 'subscriptionApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_API_BASE_URL}/subscription`,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('token');
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({
        createCheckoutSession: builder.mutation({
            query: (data) => ({
                url: 'create-checkout-session',
                method: 'POST',
                body: data,
            }),
        }),
        createPortalSession: builder.mutation({
            query: () => ({
                url: 'create-portal-session',
                method: 'POST',
            }),
        }),
    }),
});

export const {
    useCreateCheckoutSessionMutation,
    useCreatePortalSessionMutation,
} = subscriptionApi;
