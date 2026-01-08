import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { logout } from "../store/features/auth/authSlice";
import {
    LuLayoutDashboard,
    LuSlidersHorizontal,
    LuCreditCard,
    LuSettings,
} from "react-icons/lu";
import { useCreateCheckoutSessionMutation } from "../store/api/subscriptionApi";
import { SUBSCRIPTION_PLANS } from "../config/subscription";
import toast from "react-hot-toast";
import { fetchUserProfile } from "../store/features/auth/authActions";

export const useAdminNavbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLogoAnimating, setIsLogoAnimating] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const { user: authUser, token } = useSelector((state) => state.auth);

    const [createCheckoutSession, { isLoading: isTopUpLoading }] =
        useCreateCheckoutSessionMutation();

    // Navigation Data
    const navLinks = [
        {
            name: "Dashboard",
            icon: <LuLayoutDashboard size={18} />,
            path: "/dashboard",
        },
        {
            name: "Profile Tone ",
            icon: <LuSlidersHorizontal size={18} />,
            path: "/profile-tone",
        },
        {
            name: "Plan & Billing",
            icon: <LuCreditCard size={18} />,
            path: "/plan-billing",
        },
        { name: "Settings", icon: <LuSettings size={18} />, path: "/settings" },
    ];

    // Derived User Data
    const user = authUser || {};
    const fullName = user.name || "User";
    const userInitials = fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase();

    // Effects
    useEffect(() => {
        if (token && !authUser) {
            dispatch(fetchUserProfile());
        }
    }, [token, authUser, dispatch]);

    useEffect(() => {
        if (isMobileMenuOpen) {
            setIsLogoAnimating(true);
        } else {
            const timer = setTimeout(() => setIsLogoAnimating(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isMobileMenuOpen]);

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === "Escape" && isMobileMenuOpen) {
                setIsMobileMenuOpen(false);
            }
        };
        window.addEventListener("keydown", handleEscape);
        return () => window.removeEventListener("keydown", handleEscape);
    }, [isMobileMenuOpen]);

    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isMobileMenuOpen]);

    // Handlers
    const handleNavigation = (path) => {
        navigate(path);
        setIsMobileMenuOpen(false);
    };

    const handleTopUp = async () => {
        try {
            const { data } = await createCheckoutSession({
                priceId: SUBSCRIPTION_PLANS.TOP_UP.priceId,
                planType: SUBSCRIPTION_PLANS.TOP_UP.planType,
            }).unwrap();

            const redirectUrl = data?.url || data?.data?.url;
            if (redirectUrl) {
                window.location.href = redirectUrl;
            } else {
                toast.error("Failed to start top-up session");
            }
        } catch (error) {
            console.error("Top-up failed:", error);
            toast.error(error?.data?.message || "Failed to initiate top-up");
        }
    };

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            dispatch(logout());
            navigate("/");
        } catch (error) {
            console.error("Logout failed:", error);
            setIsLoggingOut(false);
        }
    };

    const isActive = (path) => location.pathname === path;

    return {
        dispatch,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
        isLogoAnimating,
        isLoggingOut,
        setIsLoggingOut,
        handleNavigation,
        handleTopUp,
        handleLogout,
        isActive,
        user,
        fullName,
        userInitials,
        navLinks,
        isTopUpLoading,
    };
};
