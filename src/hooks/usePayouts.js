import { useEffect, useState } from "react";
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

    const [payoutDialog, setPayoutDialog] = useState(false);
    const [selectedPayoutUser, setSelectedPayoutUser] = useState(null);

    // Refresh payouts when tab changes
    useEffect(() => {
        if (activeTab === "payouts") {
            dispatch(fetchPayouts());
        }
    }, [activeTab, dispatch]);

    const handleMarkAsPaid = (user) => {
        setSelectedPayoutUser(user);
        setPayoutDialog(true);
    };

    const confirmPayoutAction = async () => {
        if (!selectedPayoutUser) return;
        
        try {
            await dispatch(confirmPayout({ userId: selectedPayoutUser._id, amount: selectedPayoutUser.walletBalance })).unwrap();
            toast.success("Payout recorded successfully!");
            setPayoutDialog(false);
            setSelectedPayoutUser(null);
            // Payouts list is automatically updated via extraReducers in slice
        } catch (error) {
            toast.error("Action failed");
        }
    };

    return {
        payouts,
        loadingPayouts,
        processingPayoutId,
        handleMarkAsPaid,
        payoutDialog,
        setPayoutDialog,
        selectedPayoutUser,
        confirmPayoutAction
    };
};
