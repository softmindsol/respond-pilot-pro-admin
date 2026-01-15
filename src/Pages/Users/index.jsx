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
  User,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useUsersTable } from "@/hooks/useUsersTable";
import { getInitials, formatDate } from "@/utils/formatters";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectValue,
  SelectItem,
  SelectContent,
  SelectTrigger,
} from "@/components/ui/select";
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

const Users = () => {
  const {
    search,
    setSearch,
    page,
    setPage,
    users,
    totalPages,
    loadingUsers: loading,
    handleUpdateTier,
    planFilter,
    setPlanFilter,
    statusFilter,
    setStatusFilter,
  } = useUsersTable();

  // Helper Functions

  const getTierBadge = (tier) => {
    switch (tier) {
      case "tier1":
        return (
          <Badge className="bg-orange-500/10 text-orange border-orange/40 hover:bg-orange-500/20">
            <ShieldCheck className="w-3 h-3 mr-0.5" /> VIP Partner
          </Badge>
        );
      case "tier2":
        return (
          <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20">
            <UsersIcon className="w-3 h-3 mr-0.5" /> Affiliate
          </Badge>
        );
      default:
        return (
          <Badge
            variant="outline"
            className="text-light border-gray-600 bg-accent/4"
          >
            User
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6 bg-[#0f0d0d] min-h-screen text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Users Management</h1>
          <p className="text-gray-400 text-sm">
            Manage Founding Partners and Affiliates
          </p>
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
            {/* Filters: Plan & Status */}
            <Select value={planFilter} onValueChange={setPlanFilter}>
              <SelectTrigger className="w-full lg:w-[180px] bg-[#0f0d0d] border-[#2a2828] text-white">
                <SelectValue placeholder="Filter by Plan" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1818] border-[#2a2828]">
                <SelectItem value="all">All Plans</SelectItem>
                <SelectItem value="Free">Free</SelectItem>
                <SelectItem value="Basic">Basic</SelectItem>
                <SelectItem value="Pro">Pro</SelectItem>
                <SelectItem value="PRO_PLUS">PRO_PLUS</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full lg:w-[180px] bg-[#0f0d0d] border-[#2a2828] text-white">
                <SelectValue placeholder="Affiliate Status" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1818] border-[#2a2828]">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="tier1">VIP Partner (Tier 1)</SelectItem>
                <SelectItem value="tier2">Affiliate (Tier 2)</SelectItem>
                <SelectItem value="none">Regular User</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="bg-[#1a1818] border-[#2a2828] overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-dark">
              <TableRow className="border-[#2a2828] hover:bg-transparent">
                <TableHead className="text-gray">User</TableHead>
                <TableHead className="text-gray">Plan</TableHead>
                <TableHead className="text-gray">Affiliate Status</TableHead>
                <TableHead className="text-gray">Referred By</TableHead>
                <TableHead className="text-gray text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-64 text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-orange" />
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-40 text-center text-light"
                  >
                    No users found.
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow
                    key={user._id}
                    className="border-[#2a2828] hover:bg-[#1f1d1d]"
                  >
                    {/* 1. User */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-9 h-9 border border-[#333]">
                          <AvatarImage src={user.profileImage} />
                          <AvatarFallback className="bg-gradient-to-r from-yellow to-orange text-white text-xs">
                            {getInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-gray-200">
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>

                    {/* 2. Plan */}
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="border-gray text-gray bg-accent/5"
                      >
                        {user.plan}
                      </Badge>
                    </TableCell>

                    {/* 3. Affiliate Status */}
                    <TableCell>{getTierBadge(user.affiliateTier)}</TableCell>

                    {/* 4. Referred By */}
                    <TableCell className="text-gray-500 text-sm">
                      {user.referredBy ? (
                        <span className="bg-[#111] px-2 py-1 rounded border border-[#333] text-xs font-mono">
                          ID: {user.referredBy.slice(-4)}
                        </span>
                      ) : (
                        "-"
                      )}
                    </TableCell>

                    {/* 5. Actions */}
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-gray hover:text-white hover:bg-[#2a2828]"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="bg-[#1a1818] border-[#2a2828] text-gray-300"
                        >
                          <DropdownMenuLabel>
                            Affiliate Actions
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator className="bg-[#2a2828]" />

                          {/* Make Founding Partner */}
                          <DropdownMenuItem
                            onClick={() => handleUpdateTier(user._id, "tier1")}
                            className="text-orange-500 focus:text-orange-400 focus:bg-[#2a2828] cursor-pointer"
                          >
                            <ShieldCheck className="w-4 h-4 mr-2" /> Make
                            Founding Partner
                          </DropdownMenuItem>

                          {/* Make Standard Affiliate */}
                          <DropdownMenuItem
                            onClick={() => handleUpdateTier(user._id, "tier2")}
                            className="focus:text-white focus:bg-[#2a2828] cursor-pointer"
                          >
                            <UsersIcon className="w-4 h-4 mr-2" /> Make Standard
                            Affiliate
                          </DropdownMenuItem>

                          {/* Remove Status */}
                          <DropdownMenuItem
                            onClick={() => handleUpdateTier(user._id, "none")}
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
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="border-[#2a2828] bg-[#1a1818] text-gray-300 hover:bg-[#2a2828]"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
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
