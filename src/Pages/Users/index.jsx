import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  MoreVertical,
  ShieldCheck,
  Users as UsersIcon,
  UserX,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  Loader2,
  User
} from "lucide-react";
import toast from "react-hot-toast";
import { useGetUsersQuery, useUpdateUserTierMutation } from "@/store/api/adminApi";

// Shadcn UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";



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
      <Card className="bg-[#1a1818] border-[#2a2828]">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search users by email or name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-[#0f0d0d] border-[#2a2828] text-white focus:border-orange-500"
              />
            </div>
            {/* Optional: Add Role Filter later if needed */}
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