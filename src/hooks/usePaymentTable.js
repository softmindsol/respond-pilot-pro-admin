import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { fetchTransactions, fetchPaymentStats } from "@/store/features/payments/paymentActions";

export const usePaymentTable = (activeTab) => {
    const dispatch = useDispatch();

    // --- LOCAL STATE ---
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [refundDialog, setRefundDialog] = useState(false);
    const [viewDialog, setViewDialog] = useState(false);
    const [isRefunding, setIsRefunding] = useState(false);

    // --- REDUX STATE ---
    const {
        transactions,
        loadingTransactions,
        totalPages,
        stats, // stats from Redux
        loadingStats
    } = useSelector((state) => state.payments);



    useEffect(() => {
        dispatch(fetchPaymentStats());
    }, [dispatch]);

    // Fetch transactions when relevant state changes
    useEffect(() => {
        if (activeTab === 'transactions') {
            dispatch(fetchTransactions({ page, search, status: statusFilter }));
        }
    }, [page, activeTab, search, statusFilter, dispatch]);

    // --- MEMOIZED DATA ---
    const filteredPayments = useMemo(() => {
        return transactions;
    }, [transactions]);

    // --- ACTIONS ---

    const handleRefund = async () => {
        if (!selectedPayment) return;
        setIsRefunding(true);
        // Simulate API call for now (as per original code) or dispatch a real action if available
        setTimeout(() => {
            toast.success("Payment refunded successfully");
            setRefundDialog(false);
            setSelectedPayment(null);
            setIsRefunding(false);
        }, 1000);
    };

    const exportToCSV = () => {
        if (!filteredPayments || filteredPayments.length === 0) {
            toast.error("No data to export");
            return;
        }

        const headers = ["ID", "User", "Email", "Amount", "Status", "Plan Type", "Payment Method", "Date"];
        const rows = filteredPayments.map(p => [
            p.id,
            p.userId?.name || "N/A",
            p.userId?.email || "N/A",
            p.amount,
            p.status,
            p.planType,
            p.paymentMethod,
            p.createdAt
        ]);

        const csv = [headers, ...rows].map(row => row.join(",")).join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `payments-${new Date().toISOString().split("T")[0]}.csv`;
        a.click();
        toast.success("Export completed");
    };

    return {
        // State
        page,
        setPage,
        search,
        setSearch,
        statusFilter,
        setStatusFilter,
        selectedPayment,
        setSelectedPayment,
        refundDialog,
        setRefundDialog,
        viewDialog,
        setViewDialog,
        isRefunding,

        // Data from Redux
        transactions: filteredPayments,
        loadingTransactions,
        totalPages,
        stats,
        loadingStats,

        // Actions
        handleRefund,
        exportToCSV
    };
};
