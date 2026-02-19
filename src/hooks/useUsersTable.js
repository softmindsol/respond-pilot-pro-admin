import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { fetchUsers, updateUserTier } from "@/store/features/users/userActions";

export const useUsersTable = () => {
    const dispatch = useDispatch();

    // --- LOCAL STATE ---
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [page, setPage] = useState(1);
    const [planFilter, setPlanFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const pageSize = 10;

    // --- REDUX STATE ---
    const {
        users,
        totalPages,
        loadingUsers,
        updatingUserId
    } = useSelector((state) => state.users);

    // --- EFFECTS ---
    // Debounce Search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1); // Reset to page 1 on new search
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    // Fetch Data
    useEffect(() => {
        dispatch(fetchUsers({
            page,
            limit: pageSize,
            search: debouncedSearch,
            plan: planFilter,
            affiliateTier: statusFilter
        }));
    }, [dispatch, page, debouncedSearch, planFilter, statusFilter]);


    // --- HANDLERS ---
    const handleUpdateTier = async (userId, newTier) => {
        // optimistic check or simple confirmation could go here
        try {
            await dispatch(updateUserTier({ userId, tier: newTier })).unwrap();

            if (newTier === "tier1")
                toast.success("User is now a Founding Partner! 🏆");
            else if (newTier === "tier2") toast.success("User is now an Affiliate.");
            else toast.success("Status removed.");
        } catch (error) {
            toast.error(error?.message || "Update failed");
        }
    };

    const updatePlanFilter = (value) => {
        setPlanFilter(value);
        setPage(1);
    };

    const updateStatusFilter = (value) => {
        setStatusFilter(value);
        setPage(1);
    };

    return {
        // State
        search,
        setSearch,
        page,
        setPage,
        planFilter,
        setPlanFilter: updatePlanFilter,
        statusFilter,
        setStatusFilter: updateStatusFilter,

        // Data
        users,
        totalPages,
        loadingUsers,

        // Handlers
        handleUpdateTier
    };
};
