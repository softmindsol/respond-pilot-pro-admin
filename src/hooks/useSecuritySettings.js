import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useUpdatePasswordMutation } from "../store/api/authApi";
import toast from "react-hot-toast";

const passwordSchema = z
    .object({
        currentPassword: z.string().min(8, "Enter current password"),
        newPassword: z
            .string()
            .min(8, "New password must be at least 8 characters")
            .regex(/[A-Z]/, "New password must contain at least 1 uppercase letter")
            .regex(/[a-z]/, "New password must contain at least 1 lowercase letter")
            .regex(
                /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/,
                "New password must contain at least 1 special character"
            )
            .regex(/[0-9]/, "New password must contain at least 1 digit"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    });

export const useSecuritySettings = () => {
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showMethodModal, setShowMethodModal] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
    } = useForm({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    });

    const newPassword = watch("newPassword");
    const confirmPassword = watch("confirmPassword");
    const passwordsMatch = newPassword && confirmPassword && newPassword === confirmPassword;

    const [updatePassword, { isLoading }] = useUpdatePasswordMutation();

    const handleUpdatePassword = async (data) => {
        try {
            await updatePassword({
                currentPassword: data.currentPassword,
                newPassword: data.newPassword,
            }).unwrap();
            toast.success("Password Updated Successfully!");
            reset();
        } catch (err) {
            console.error("Failed to update password:", err);
            toast.error(err?.data?.message || "Failed to update password");
        }
    };

    const onSubmit = (e) => {
        e.preventDefault();
        handleSubmit(handleUpdatePassword)(e);
    };

    const handleToggle2FA = (checked) => {
        if (checked) {
            setShowPasswordModal(true);
        } else {
            setTwoFactorEnabled(false);
            toast.success("2FA has been disabled");
        }
    };

    const handlePasswordVerified = () => {
        setShowPasswordModal(false);
        setShowMethodModal(true);
    };

    const handle2FAComplete = (method) => {
        setShowMethodModal(false);
        setTwoFactorEnabled(true);
        toast.success(
            `2FA enabled successfully via ${method === "email" ? "Email" : "Phone"}!`
        );
    };

    const handleModalCancel = () => {
        setShowPasswordModal(false);
        setShowMethodModal(false);
        setTwoFactorEnabled(false);
    };

    return {
        register,
        errors,
        isLoading,
        onSubmit,
        twoFactorEnabled,
        showPasswordModal,
        showMethodModal,
        handleToggle2FA,
        handlePasswordVerified,
        handle2FAComplete,
        handleModalCancel,
        reset,
        showCurrentPassword, setShowCurrentPassword, showNewPassword, setShowNewPassword, showConfirmPassword, setShowConfirmPassword,
        passwordsMatch,
    };
};
