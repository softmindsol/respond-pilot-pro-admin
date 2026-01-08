import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_API_BASE_URL}/auth`,
        prepareHeaders: (headers) => {
            console.log("API Base URL:", import.meta.env.VITE_API_BASE_URL);
            const token = localStorage.getItem('token');
            console.log("AuthApi prepareHeaders. Token:", token ? "Exists" : "Missing");
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ["Profile"],
    endpoints: (builder) => ({
        register: builder.mutation({
            query: (userData) => ({
                url: 'register',
                method: 'POST',
                body: userData,
            }),
        }),
        login: builder.mutation({
            query: (credentials) => ({
                url: 'login',
                method: 'POST',
                body: credentials,
            }),
            invalidatesTags: ['Profile'],
        }),
        googleAuth: builder.mutation({
            query: (token) => ({
                url: 'google',
                method: 'POST',
                body: token,
            }),
        }),
        forgotPassword: builder.mutation({
            query: (email) => ({
                url: 'forgot-password',
                method: 'POST',
                body: { email },
            }),
        }),
        verifyOtp: builder.mutation({
            query: (data) => ({
                url: 'verify-email',
                method: 'POST',
                body: data,
            }),
        }),
        resetPassword: builder.mutation({
            query: (data) => ({
                url: 'reset-password',
                method: 'POST',
                body: data,
            }),
        }),
        resendOtp: builder.mutation({
            query: (email) => ({
                url: 'resend-verification',
                method: 'POST',
                body: { email },
            }),
        }),
        getProfile: builder.query({
            query: () => {
                console.log("AuthApi: Fetching Profile...");
                return {
                    url: 'profile',
                    method: 'GET',
                    headers: {
                        'Cache-Control': 'no-cache',
                        'Pragma': 'no-cache',
                        'Expires': '0',
                    },
                };
            },
            keepUnusedDataFor: 0,
            providesTags: ['Profile'],
        }),
        updateToneSettings: builder.mutation({
            query: (data) => ({
                url: 'update-tone-settings',
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Profile'],
        }),
        updateProfile: builder.mutation({
            query: (data) => ({
                url: 'update-profile',
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Profile'],
        }),
        updatePassword: builder.mutation({
            query: (data) => ({
                url: 'update-password',
                method: 'PUT',
                body: data,
            }),
        }),
    }),
});

export const {
    useRegisterMutation,
    useLoginMutation,
    useGoogleAuthMutation,
    useForgotPasswordMutation,
    useVerifyOtpMutation,
    useResetPasswordMutation,
    useResendOtpMutation,
    useGetProfileQuery,
    useLazyGetProfileQuery,
    useUpdateToneSettingsMutation,
    useUpdateProfileMutation,
    useUpdatePasswordMutation,
} = authApi;
