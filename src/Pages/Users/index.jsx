import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import toast from "react-hot-toast";
import { useGetUsersQuery, useUpdateUserTierMutation } from "@/store/api/adminApi";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useGetUsersQuery,
  useDeleteUserMutation,
  useToggleUserStatusMutation,
} from "@/store/api/adminApi";
import DeleteModal from "../../components/UsersComponents/deleteModal";
import ViewUserModal from "../../components/UsersComponents/viewUserModal";
import Pagination from "../../components/Customs/pagination";
import UsersTable from "../../components/UsersComponents/usersTable";

// Mock data for development
const mockUsers = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    avatar: "",
    status: "active",
    plan: "Pro",
    createdAt: "2025-01-01",
    lastLogin: "2025-01-09",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    avatar: "",
    status: "active",
    plan: "Enterprise",
    createdAt: "2025-01-02",
    lastLogin: "2025-01-08",
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike@example.com",
    avatar: "",
    status: "inactive",
    plan: "Basic",
    createdAt: "2024-12-15",
    lastLogin: "2025-01-05",
  },
  {
    id: "4",
    name: "Sarah Wilson",
    email: "sarah@example.com",
    avatar: "",
    status: "active",
    plan: "Pro",
    createdAt: "2024-11-20",
    lastLogin: "2025-01-09",
  },
  {
    id: "5",
    name: "Tom Brown",
    email: "tom@example.com",
    avatar: "",
    status: "suspended",
    plan: "Basic",
    createdAt: "2024-10-10",
    lastLogin: "2024-12-20",
  },
  {
    id: "6",
    name: "Emily Davis",
    email: "emily@example.com",
    avatar: "",
    status: "active",
    plan: "Free",
    createdAt: "2025-01-05",
    lastLogin: "2025-01-09",
  },
  {
    id: "7",
    name: "Chris Lee",
    email: "chris@example.com",
    avatar: "",
    status: "active",
    plan: "Pro",
    createdAt: "2024-09-15",
    lastLogin: "2025-01-07",
  },
  {
    id: "8",
    name: "Anna Martinez",
    email: "anna@example.com",
    avatar: "",
    status: "inactive",
    plan: "Basic",
    createdAt: "2024-08-20",
    lastLogin: "2024-11-15",
  },
];

const Users = () => {
  const [search, setSearch] = useState("");
  // Debounce search input
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Debounce effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to page 1 on new search
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  // RTK Query Hooks
  const { data: usersData, isLoading: loading } = useGetUsersQuery({
    page,
    limit: pageSize,
    search: debouncedSearch
  });

  const [updateTier] = useUpdateUserTierMutation();

  const users = usersData?.users || [];
  const totalPages = usersData?.pages || 1;

  // --- Update Affiliate Tier Handler ---
  const handleUpdateTier = async (userId, newTier) => {
    try {
      await updateTier({ userId, tier: newTier }).unwrap();

      if (newTier === 'tier1') toast.success("User is now a Founding Partner! 🏆");
      else if (newTier === 'tier2') toast.success("User is now an Affiliate.");
      else toast.success("Status removed.");

    } catch (error) {
      console.error(error);
      toast.error(error?.data?.message || "Update failed");
    }
  };

  // Helper Functions
  const getInitials = (name) => name?.charAt(0).toUpperCase() || "U";
  const formatDate = (date) => new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  const getTierBadge = (tier) => {
    switch (tier) {
      case 'tier1':
        return <Badge className="bg-orange-500/10 text-orange-500 border-orange-500/20 hover:bg-orange-500/20"><ShieldCheck className="w-3 h-3 mr-1" /> VIP Partner</Badge>;
      case 'tier2':
        return <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20"><UsersIcon className="w-3 h-3 mr-1" /> Affiliate</Badge>;
      default:
        return <Badge variant="outline" className="text-gray-500 border-gray-700">User</Badge>;
    }
  };

  return (
    <div className="space-y-6 p-6 bg-[#0f0d0d] min-h-screen text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Users Management</h1>
          <p className="text-gray-400 text-sm">Manage Founding Partners and Affiliates</p>
        </div>
      </div>
      {/* Filters */}
      <Card className="bg-[#1a1818] border-[#363A42]">
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search users by email or name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-[#0f0d0d] border-[#2a2828] text-white focus:border-orange-500"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[150px] py-[23px] px-3.5 bg-[#0f0d0d] border-[#2a2828] hover:border-[#363A42] text-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1818] border-[#363A42]">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
            <Select value={planFilter} onValueChange={setPlanFilter}>
              <SelectTrigger className="w-full sm:w-[150px] py-[23px] px-3.5 bg-[#0f0d0d] border-[#2a2828] hover:border-[#363A42] text-white">
                <SelectValue placeholder="Plan" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1818] border-[#2a2828]">
                <SelectItem value="all">All Plans</SelectItem>
                <SelectItem value="Free">Free</SelectItem>
                <SelectItem value="Basic">Basic</SelectItem>
                <SelectItem value="Pro">Pro</SelectItem>
                <SelectItem value="Enterprise">Enterprise</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="bg-[#1a1818] border-[#2a2828] overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-[#111]">
              <TableRow className="border-[#2a2828] hover:bg-transparent">
                <TableHead className="text-gray-400">User</TableHead>
                <TableHead className="text-gray-400">Plan</TableHead>
                <TableHead className="text-gray-400">Affiliate Status</TableHead>
                <TableHead className="text-gray-400">Referred By</TableHead>
                <TableHead className="text-gray-400 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-64 text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-orange-500" />
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-40 text-center text-gray-500">
                    No users found.
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user._id} className="border-[#2a2828] hover:bg-[#1f1d1d]">
                    {/* 1. User */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-9 h-9 border border-[#333]">
                          <AvatarImage src={user.profileImage} />
                          <AvatarFallback className="bg-gradient-to-r from-gray-700 to-gray-600 text-white text-xs">
                            {getInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-gray-200">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>

                    {/* 2. Plan */}
                    <TableCell>
                      <Badge variant="outline" className="border-gray-700 text-gray-300">
                        {user.plan}
                      </Badge>
                    </TableCell>

                    {/* 3. Affiliate Status */}
                    <TableCell>
                      {getTierBadge(user.affiliateTier)}
                    </TableCell>

                    {/* 4. Referred By */}
                    <TableCell className="text-gray-500 text-sm">
                      {user.referredBy ? (
                        <span className="bg-[#111] px-2 py-1 rounded border border-[#333] text-xs font-mono">
                          ID: {user.referredBy.slice(-4)}
                        </span>
                      ) : "-"}
                    </TableCell>

                    {/* 5. Actions */}
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-[#2a2828]">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-[#1a1818] border-[#2a2828] text-gray-300">
                          <DropdownMenuLabel>Affiliate Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator className="bg-[#2a2828]" />

                          {/* Make Founding Partner */}
                          <DropdownMenuItem
                            onClick={() => handleUpdateTier(user._id, 'tier1')}
                            className="text-orange-500 focus:text-orange-400 focus:bg-[#2a2828] cursor-pointer"
                          >
                            <ShieldCheck className="w-4 h-4 mr-2" /> Make Founding Partner
                          </DropdownMenuItem>

                          {/* Make Standard Affiliate */}
                          <DropdownMenuItem
                            onClick={() => handleUpdateTier(user._id, 'tier2')}
                            className="focus:text-white focus:bg-[#2a2828] cursor-pointer"
                          >
                            <UsersIcon className="w-4 h-4 mr-2" /> Make Standard Affiliate
                          </DropdownMenuItem>

                          {/* Remove Status */}
                          <DropdownMenuItem
                            onClick={() => handleUpdateTier(user._id, 'none')}
                            className="text-red-500 focus:text-red-400 focus:bg-[#2a2828] cursor-pointer"
                          >
                            <UserX className="w-4 h-4 mr-2" /> Remove Status
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
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
            className="border-[#2a2828] bg-[#1a1818] text-gray-300 hover:bg-[#2a2828]"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="border-[#2a2828] bg-[#1a1818] text-gray-300 hover:bg-[#2a2828]"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Users;