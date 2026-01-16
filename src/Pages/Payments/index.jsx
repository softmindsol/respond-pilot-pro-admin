import { useState } from "react";
import { usePaymentTable } from "@/hooks/usePaymentTable";
import { usePayouts } from "@/hooks/usePayouts";
import { formatCurrency, formatDate } from "@/utils/formatters";
import {
  Search,
  Download,
  MoreVertical,
  Eye,
  RefreshCcw,
  ChevronLeft,
  ChevronRight,
  Loader2,
  DollarSign,
  TrendingUp,
  CreditCard,
  AlertCircle,
  CheckCircle,
  Wallet,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StatCard from "../../components/DashboardComponents/statCards";

// --- CONFIG & MOCK DATA ---
const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const mockPayments = [
  {
    id: "PAY-001",
    user: "John Doe",
    email: "john@example.com",
    amount: 29.99,
    status: "completed",
    plan: "Pro",
    method: "card",
    createdAt: "2025-01-09T10:30:00",
  },
  {
    id: "PAY-002",
    user: "Jane Smith",
    email: "jane@example.com",
    amount: 99.99,
    status: "completed",
    plan: "Enterprise",
    method: "card",
    createdAt: "2025-01-09T09:15:00",
  },
  {
    id: "PAY-003",
    user: "Mike Johnson",
    email: "mike@example.com",
    amount: 9.99,
    status: "pending",
    plan: "Basic",
    method: "paypal",
    createdAt: "2025-01-08T14:20:00",
  },
  {
    id: "PAY-004",
    user: "Sarah Wilson",
    email: "sarah@example.com",
    amount: 29.99,
    status: "completed",
    plan: "Pro",
    method: "card",
    createdAt: "2025-01-08T11:45:00",
  },
  {
    id: "PAY-005",
    user: "Tom Brown",
    email: "tom@example.com",
    amount: 9.99,
    status: "failed",
    plan: "Basic",
    method: "card",
    createdAt: "2025-01-07T16:30:00",
  },
  {
    id: "PAY-006",
    user: "Emily Davis",
    email: "emily@example.com",
    amount: 29.99,
    status: "refunded",
    plan: "Pro",
    method: "card",
    createdAt: "2025-01-07T08:00:00",
  },
];

const mockStats = {
  totalRevenue: 89420,
  monthlyRevenue: 12450,
  pendingPayments: 3240,
  successRate: 94.5,
};

const statusColors = {
  completed: "success",
  pending: "warning",
  failed: "destructive",
  refunded: "secondary",
};

const Payments = () => {
  const [activeTab, setActiveTab] = useState("transactions");
  const {
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
    transactions: filteredPayments,
    loadingTransactions,
    totalPages,
    handleRefund,
    exportToCSV,
    stats,
  } = usePaymentTable(activeTab);

  // --- CUSTOM HOOK: PAYOUTS ---
  const {
    payouts,
    loadingPayouts,
    processingPayoutId,
    handleMarkAsPaid,
    payoutDialog,
    setPayoutDialog,
    selectedPayoutUser,
    confirmPayoutAction,
  } = usePayouts(activeTab);

  return (
    <div className="space-y-6 p-6 bg-[#090909] min-h-screen text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Financials</h1>
          <p className="text-gray">Manage Transactions & Affiliate Payouts</p>
        </div>
        <Button
          onClick={exportToCSV}
          variant="outline"
          className="border-[#2a2828] bg-[#1a1818] text-gray-300"
        >
          <Download className="w-4 h-4 mr-2" /> Export CSV
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          color="text-green-500"
        />
        <StatCard
          title="Monthly Revenue"
          value={`$${stats.monthlyRevenue.toLocaleString()}`}
          icon={TrendingUp}
          color="text-blue-400"
        />
        <StatCard
          title="Pending Payouts"
          value={`$${stats.pendingPayouts.toLocaleString()}`}
          icon={Wallet}
          color="text-red-400"
        />
        <StatCard
          title="Success Rate"
          value={`${stats.successRate}%`}
          icon={CheckCircle}
          color="text-orange-500"
        />
      </div>

      {/* TABS SECTION */}
      <Tabs
        defaultValue="transactions"
        className="w-full"
        onValueChange={setActiveTab}
      >
        <TabsList className="bg-[#1a1818] border border-[#2a2828] p-1">
          <TabsTrigger
            value="transactions"
            className="text-white data-[state=active]:bg-[#2a2828]"
          >
            Transactions
          </TabsTrigger>
          <TabsTrigger
            value="payouts"
            className="text-white data-[state=active]:bg-[#2a2828]"
          >
            Affiliate Payouts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="mt-6 space-y-6">
          {/* Filters */}
          <Card className="bg-[#1a1818] border-[#2a2828]">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray" />
                  <Input
                    placeholder="Search payments..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 bg-[#0f0d0d] border-[#2a2828] text-white"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[180px] bg-[#0f0d0d] border-[#2a2828] text-white">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-dark border-[#2a2828]">
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="refunded">Refunded</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Transactions Table */}
          <Card className="bg-[#1a1818] border-[#2a2828]">
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-dark">
                  <TableRow className="border-[#2a2828] hover:bg-transparent">
                    <TableHead className="text-gray-400">User</TableHead>
                    <TableHead className="text-gray-400">Amount</TableHead>
                    <TableHead className="text-gray-400">Status</TableHead>
                    <TableHead className="text-gray-400 hidden md:table-cell">
                      Plan
                    </TableHead>
                    <TableHead className="text-gray-400 hidden md:table-cell">
                      Payment Method
                    </TableHead>
                    <TableHead className="text-gray-400 hidden lg:table-cell">
                      Date
                    </TableHead>
                    <TableHead className="text-gray-400 text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.map((payment) => (
                    <TableRow key={payment.id} className="border-[#2a2828]">
                      <TableCell>
                        <div>
                          <p className="font-medium text-white">
                            {payment.userId?.name}
                          </p>
                          <p className="text-sm text-gray-400">
                            {payment.userId?.email}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold text-white">
                        {formatCurrency(payment.amount)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={statusColors[payment.status]}
                          className="capitalize"
                        >
                          {payment.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-gray-400">
                        {payment.planType}
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-gray-400 uppercase">
                        <Badge
                          variant={statusColors[payment.paymentMethod]}
                          className="capitalize"
                        >
                          {payment.paymentMethod}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-gray">
                        {formatDate(payment.createdAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-gray hover:text-dark"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="bg-[#1a1818] border-[#2a2828]"
                          >
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedPayment(payment);
                                setViewDialog(true);
                              }}
                              className="text-gray-300 focus:text-white focus:bg-[#2a2828]"
                            >
                              <Eye className="w-4 h-4 mr-2" /> View Details
                            </DropdownMenuItem>
                            {/* {payment.status === "completed" && (
                              <DropdownMenuItem
                                onClick={() => { setSelectedPayment(payment); setRefundDialog(true); }}
                                className="text-yellow-500 focus:text-yellow-400 focus:bg-[#2a2828]"
                              >
                                <RefreshCcw className="w-4 h-4 mr-2" /> Refund
                              </DropdownMenuItem>
                            )} */}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Pagination for Transactions */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-400">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="border-[#2a2828] text-gray-300"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="border-[#2a2828] text-gray-300"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="payouts" className="mt-6">
          <Card className="bg-[#1a1818] border-[#2a2828]">
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-[#111]">
                  <TableRow className="border-[#2a2828] hover:bg-transparent">
                    <TableHead className="text-gray-400">Partner</TableHead>
                    <TableHead className="text-gray-400">Tier</TableHead>
                    <TableHead className="text-gray-400">
                      Referral Code
                    </TableHead>
                    <TableHead className="text-gray-400">
                      Unpaid Balance
                    </TableHead>
                    <TableHead className="text-gray-400 text-right">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingPayouts ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-40 text-center">
                        <Loader2 className="animate-spin mx-auto text-orange-500" />
                      </TableCell>
                    </TableRow>
                  ) : payouts.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="h-40 text-center text-gray-500"
                      >
                        No pending payouts found. 🎉
                      </TableCell>
                    </TableRow>
                  ) : (
                    payouts.map((user) => (
                      <TableRow
                        key={user._id}
                        className="border-[#2a2828] hover:bg-[#1f1d1d]"
                      >
                        <TableCell>
                          <div className="font-medium text-white">
                            {user.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {user.email}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`border-0 ${
                              user.affiliateTier === "tier1"
                                ? "bg-orange-500/10 text-orange-500"
                                : "bg-blue-500/10 text-blue-400"
                            }`}
                          >
                            {user.affiliateTier === "tier1"
                              ? "Founding Partner"
                              : "Standard Affiliate"}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-xs text-gray-400">
                          {user.referralCode}
                        </TableCell>
                        <TableCell>
                          <span className="text-green-400 font-bold text-lg flex items-center gap-1">
                            <DollarSign size={16} />{" "}
                            {user.walletBalance.toFixed(2)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            onClick={() => handleMarkAsPaid(user)}
                            disabled={processingPayoutId === user._id}
                            className="bg-green-600 hover:bg-green-700 text-white h-8 text-xs"
                          >
                            {processingPayoutId === user._id ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              "Mark Paid"
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* --- DIALOGS (Refund & View) --- */}
      <Dialog open={refundDialog} onOpenChange={setRefundDialog}>
        <DialogContent className="bg-[#1a1818] border-[#2a2828]">
          <DialogHeader>
            <DialogTitle className="text-white">Refund Payment</DialogTitle>
            <DialogDescription className="text-gray">
              Are you sure you want to refund{" "}
              {formatCurrency(selectedPayment?.amount || 0)} to{" "}
              {selectedPayment?.user}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRefundDialog(false)}
              className="border-[#2a2828] text-gray-300"
            >
              Cancel
            </Button>
            {/* <Button onClick={handleRefund} disabled={isRefunding} className="bg-yellow-600 hover:bg-yellow-700">
              {isRefunding ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null} Refund
            </Button> */}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={viewDialog} onOpenChange={setViewDialog}>
        <DialogContent className="bg-[#1a1818] border-[#2a2828]">
          <DialogHeader>
            <DialogTitle className="text-white">Payment Details</DialogTitle>
          </DialogHeader>
          {selectedPayment && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Status</p>
                  <Badge
                    variant={statusColors[selectedPayment.status]}
                    className="capitalize mt-1"
                  >
                    {selectedPayment.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-400">User</p>
                  <p className="text-white">{selectedPayment.userId?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <p className="text-white">{selectedPayment.userId?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Amount</p>
                  <p className="text-white text-xl font-bold">
                    {formatCurrency(selectedPayment.amount)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Plan</p>
                  <p className="text-white">{selectedPayment.planType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Method</p>
                  <p className="text-white capitalize">
                    {selectedPayment.paymentMethod}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Date</p>
                  <p className="text-white">
                    {formatDate(selectedPayment.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* --- Payout Confirmation Dialog --- */}
      <Dialog open={payoutDialog} onOpenChange={setPayoutDialog}>
        <DialogContent className="bg-[#1a1818] border-[#2a2828]">
          <DialogHeader>
            <DialogTitle className="text-white">Confirm Payout</DialogTitle>
            <DialogDescription className="text-gray-400">
              Are you sure you want to mark paid{" "}
              {selectedPayoutUser &&
                formatCurrency(selectedPayoutUser.walletBalance)}{" "}
              to {selectedPayoutUser?.name}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setPayoutDialog(false)}
              className="border-[#2a2828] text-gray-300"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmPayoutAction}
              className="bg-green-600 hover:bg-green-700 text-white"
              disabled={processingPayoutId === selectedPayoutUser?._id}
            >
              {processingPayoutId === selectedPayoutUser?._id && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              Confirm Payout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Payments;
