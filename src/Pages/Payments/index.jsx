import { useState, useMemo } from "react";
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
} from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  useGetPaymentsQuery,
  useRefundPaymentMutation,
} from "@/store/api/adminApi";

// Mock data for development
const mockPayments = [
  { id: "PAY-001", user: "John Doe", email: "john@example.com", amount: 29.99, status: "completed", plan: "Pro", method: "card", createdAt: "2025-01-09T10:30:00" },
  { id: "PAY-002", user: "Jane Smith", email: "jane@example.com", amount: 99.99, status: "completed", plan: "Enterprise", method: "card", createdAt: "2025-01-09T09:15:00" },
  { id: "PAY-003", user: "Mike Johnson", email: "mike@example.com", amount: 9.99, status: "pending", plan: "Basic", method: "paypal", createdAt: "2025-01-08T14:20:00" },
  { id: "PAY-004", user: "Sarah Wilson", email: "sarah@example.com", amount: 29.99, status: "completed", plan: "Pro", method: "card", createdAt: "2025-01-08T11:45:00" },
  { id: "PAY-005", user: "Tom Brown", email: "tom@example.com", amount: 9.99, status: "failed", plan: "Basic", method: "card", createdAt: "2025-01-07T16:30:00" },
  { id: "PAY-006", user: "Emily Davis", email: "emily@example.com", amount: 29.99, status: "refunded", plan: "Pro", method: "card", createdAt: "2025-01-07T08:00:00" },
  { id: "PAY-007", user: "Chris Lee", email: "chris@example.com", amount: 99.99, status: "completed", plan: "Enterprise", method: "paypal", createdAt: "2025-01-06T13:10:00" },
  { id: "PAY-008", user: "Anna Martinez", email: "anna@example.com", amount: 9.99, status: "completed", plan: "Basic", method: "card", createdAt: "2025-01-06T10:25:00" },
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

const StatCard = ({ title, value, icon: Icon }) => (
  <Card className="bg-[#1a1818] border-[#2a2828]">
    <CardContent className="pt-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-400">{title}</p>
          <h3 className="text-2xl font-bold text-white mt-1">{value}</h3>
        </div>
        <div className="p-3 bg-gradient-to-r from-[#FEC36D]/20 to-[#D78001]/20 rounded-xl">
          <Icon className="w-6 h-6 text-[#FEC36D]" />
          <Icon className="w-6 h-6 text-[#FEC36D]" />
        </div>
      </div>
    </CardContent>
  </Card>
);

const Payments = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [refundDialog, setRefundDialog] = useState(false);
  const [viewDialog, setViewDialog] = useState(false);
  const pageSize = 10;

  // API hooks
  const { data: paymentsData, isLoading, refetch } = useGetPaymentsQuery({ page, pageSize, search, status: statusFilter });
  const [refundPayment, { isLoading: isRefunding }] = useRefundPaymentMutation();

  // Use API data or fallback to mock
  const payments = paymentsData?.data || mockPayments;
  const stats = paymentsData?.stats || mockStats;
  const totalPages = paymentsData?.totalPages || Math.ceil(mockPayments.length / pageSize);

  // Filter payments locally if using mock data
  const filteredPayments = useMemo(() => {
    let result = payments;
    
    if (!paymentsData) {
      if (search) {
        result = result.filter(p => 
          p.user.toLowerCase().includes(search.toLowerCase()) ||
          p.email.toLowerCase().includes(search.toLowerCase()) ||
          p.id.toLowerCase().includes(search.toLowerCase())
        );
      }
      if (statusFilter !== "all") {
        result = result.filter(p => p.status === statusFilter);
      }
    }
    
    return result;
  }, [payments, search, statusFilter, paymentsData]);

  const handleRefund = async () => {
    if (!selectedPayment) return;
    
    try {
      await refundPayment(selectedPayment.id).unwrap();
      toast.success("Payment refunded successfully");
      setRefundDialog(false);
      setSelectedPayment(null);
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to refund payment");
    }
  };

  const formatCurrency = (value) => 
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

  const formatDate = (date) => 
    new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });

  const exportToCSV = () => {
    const headers = ["ID", "User", "Email", "Amount", "Status", "Plan", "Method", "Date"];
    const rows = filteredPayments.map(p => [p.id, p.user, p.email, p.amount, p.status, p.plan, p.method, p.createdAt]);
    const csv = [headers, ...rows].map(row => row.join(",")).join("\n");
    
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `payments-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    toast.success("Export completed");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Payments</h1>
          <p className="text-gray-400">Manage transactions and revenue</p>
        </div>
        <Button onClick={exportToCSV} variant="outline" className="border-[#2a2828] text-gray-300">
          <Download className="w-4 h-4 mr-2" /> Export
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Revenue" value={formatCurrency(stats.totalRevenue)} icon={DollarSign} />
        <StatCard title="This Month" value={formatCurrency(stats.monthlyRevenue)} icon={TrendingUp} />
        <StatCard title="Pending" value={formatCurrency(stats.pendingPayments)} icon={CreditCard} />
        <StatCard title="Success Rate" value={`${stats.successRate}%`} icon={AlertCircle} />
      </div>

      {/* Filters */}
      <Card className="bg-[#1a1818] border-[#2a2828]">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
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
              <SelectContent className="bg-[#1a1818] border-[#2a2828]">
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

      {/* Payments Table */}
      <Card className="bg-[#1a1818] border-[#2a2828]">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-[#FEC36D]" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-[#2a2828] hover:bg-transparent">
                  <TableHead className="text-gray-400">Transaction ID</TableHead>
                  <TableHead className="text-gray-400">User</TableHead>
                  <TableHead className="text-gray-400">Amount</TableHead>
                  <TableHead className="text-gray-400">Status</TableHead>
                  <TableHead className="text-gray-400 hidden md:table-cell">Plan</TableHead>
                  <TableHead className="text-gray-400 hidden lg:table-cell">Date</TableHead>
                  <TableHead className="text-gray-400 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map((payment) => (
                  <TableRow key={payment.id} className="border-[#2a2828]">
                    <TableCell className="font-mono text-sm text-gray-300">{payment.id}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-white">{payment.user}</p>
                        <p className="text-sm text-gray-400">{payment.email}</p>
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold text-white">
                      {formatCurrency(payment.amount)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusColors[payment.status]} className="capitalize">
                        {payment.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-gray-400">
                      {payment.plan}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-gray-400">
                      {formatDate(payment.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-[#1a1818] border-[#2a2828]">
                          <DropdownMenuItem
                            onClick={() => { setSelectedPayment(payment); setViewDialog(true); }}
                            className="text-gray-300 focus:text-white focus:bg-[#2a2828]"
                          >
                            <Eye className="w-4 h-4 mr-2" /> View Details
                          </DropdownMenuItem>
                          {payment.status === "completed" && (
                            <DropdownMenuItem
                              onClick={() => { setSelectedPayment(payment); setRefundDialog(true); }}
                              className="text-yellow-500 focus:text-yellow-400 focus:bg-[#2a2828]"
                            >
                              <RefreshCcw className="w-4 h-4 mr-2" /> Refund
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">
          Page {page} of {totalPages}
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="border-[#2a2828] text-gray-300"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="border-[#2a2828] text-gray-300"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Refund Dialog */}
      <Dialog open={refundDialog} onOpenChange={setRefundDialog}>
        <DialogContent className="bg-[#1a1818] border-[#2a2828]">
          <DialogHeader>
            <DialogTitle className="text-white">Refund Payment</DialogTitle>
            <DialogDescription className="text-gray-400">
              Are you sure you want to refund {formatCurrency(selectedPayment?.amount || 0)} to {selectedPayment?.user}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRefundDialog(false)} className="border-[#2a2828] text-gray-300">
              Cancel
            </Button>
            <Button onClick={handleRefund} disabled={isRefunding} className="bg-yellow-600 hover:bg-yellow-700">
              {isRefunding ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Refund
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Payment Dialog */}
      <Dialog open={viewDialog} onOpenChange={setViewDialog}>
        <DialogContent className="bg-[#1a1818] border-[#2a2828]">
          <DialogHeader>
            <DialogTitle className="text-white">Payment Details</DialogTitle>
          </DialogHeader>
          {selectedPayment && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Transaction ID</p>
                  <p className="text-white font-mono">{selectedPayment.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Status</p>
                  <Badge variant={statusColors[selectedPayment.status]} className="capitalize mt-1">
                    {selectedPayment.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-400">User</p>
                  <p className="text-white">{selectedPayment.user}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <p className="text-white">{selectedPayment.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Amount</p>
                  <p className="text-white text-xl font-bold">{formatCurrency(selectedPayment.amount)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Plan</p>
                  <p className="text-white">{selectedPayment.plan}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Payment Method</p>
                  <p className="text-white capitalize">{selectedPayment.method}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Date</p>
                  <p className="text-white">{formatDate(selectedPayment.createdAt)}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Payments;
