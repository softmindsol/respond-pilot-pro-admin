import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const adminApi = createApi({
    reducerPath: 'adminApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_API_BASE_URL}/admin`,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('token');
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['Users', 'Payments', 'Dashboard'],
    endpoints: (builder) => ({
        // Dashboard Stats
        getDashboardStats: builder.query({
            query: () => 'dashboard/stats',
            providesTags: ['Dashboard'],
        }),

        // Users Management
        getUsers: builder.query({
            query: (params) => ({
                url: 'users',
                params,
            }),
            providesTags: ['Users'],
        }),
        getUserById: builder.query({
            query: (id) => `users/${id}`,
            providesTags: (result, error, id) => [{ type: 'Users', id }],
        }),
        updateUser: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `users/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Users'],
        }),
        deleteUser: builder.mutation({
            query: (id) => ({
                url: `users/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Users'],
        }),
        toggleUserStatus: builder.mutation({
            query: ({ id, status }) => ({
                url: `users/${id}/status`,
                method: 'PATCH',
                body: { status },
            }),
            invalidatesTags: ['Users'],
        }),

        // Payments Management
        getPayments: builder.query({
            query: (params) => ({
                url: 'payments',
                params,
            }),
            providesTags: ['Payments'],
        }),
        getPaymentById: builder.query({
            query: (id) => `payments/${id}`,
            providesTags: (result, error, id) => [{ type: 'Payments', id }],
        }),
        refundPayment: builder.mutation({
            query: (id) => ({
                url: `payments/${id}/refund`,
                method: 'POST',
            }),
            invalidatesTags: ['Payments', 'Dashboard'],
        }),

        // Revenue Analytics
        getRevenueAnalytics: builder.query({
            query: (params) => ({
                url: 'analytics/revenue',
                params,
            }),
        }),
        getUserAnalytics: builder.query({
            query: (params) => ({
                url: 'analytics/users',
                params,
            }),
        }),
    }),
});

export const {
    useGetDashboardStatsQuery,
    useGetUsersQuery,
    useGetUserByIdQuery,
    useUpdateUserMutation,
    useDeleteUserMutation,
    useToggleUserStatusMutation,
    useGetPaymentsQuery,
    useGetPaymentByIdQuery,
    useRefundPaymentMutation,
    useGetRevenueAnalyticsQuery,
    useGetUserAnalyticsQuery,
} = adminApi;
