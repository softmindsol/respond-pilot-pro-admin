import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { fetchPayouts, confirmPayout } from "@/store/features/payments/paymentActions";

export const usePayouts = (activeTab) => {
    const dispatch = useDispatch();

    const {
        payouts,
        loadingPayouts,
        processingPayoutId
    } = useSelector((state) => state.payments);

    // Refresh payouts when tab changes
    useEffect(() => {
        if (activeTab === "payouts") {
            dispatch(fetchPayouts());
        }
    }, [activeTab, dispatch]);

    const handleMarkAsPaid = async (user) => {
        if (!confirm(`Confirm payout of $${user.walletBalance} to ${user.name}?`)) return;

        try {
            await dispatch(confirmPayout({ userId: user._id, amount: user.walletBalance })).unwrap();
            toast.success("Payout recorded successfully!");
            // Payouts list is automatically updated via extraReducers in slice
        } catch (error) {
            toast.error("Action failed");
        }
    };

    return {
        payouts,
        loadingPayouts,
        processingPayoutId,
        handleMarkAsPaid
    };
};
