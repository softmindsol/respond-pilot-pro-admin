import { useState, useMemo } from "react";
import {
  Search,
  Filter,
  MoreVertical,
  UserCheck,
  UserX,
  Trash2,
  Eye,
  Mail,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  DropdownMenuSeparator,
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
import {
  useGetUsersQuery,
  useDeleteUserMutation,
  useToggleUserStatusMutation,
} from "@/store/api/adminApi";

// Mock data for development
const mockUsers = [
  { id: "1", name: "John Doe", email: "john@example.com", avatar: "", status: "active", plan: "Pro", createdAt: "2025-01-01", lastLogin: "2025-01-09" },
  { id: "2", name: "Jane Smith", email: "jane@example.com", avatar: "", status: "active", plan: "Enterprise", createdAt: "2025-01-02", lastLogin: "2025-01-08" },
  { id: "3", name: "Mike Johnson", email: "mike@example.com", avatar: "", status: "inactive", plan: "Basic", createdAt: "2024-12-15", lastLogin: "2025-01-05" },
  { id: "4", name: "Sarah Wilson", email: "sarah@example.com", avatar: "", status: "active", plan: "Pro", createdAt: "2024-11-20", lastLogin: "2025-01-09" },
  { id: "5", name: "Tom Brown", email: "tom@example.com", avatar: "", status: "suspended", plan: "Basic", createdAt: "2024-10-10", lastLogin: "2024-12-20" },
  { id: "6", name: "Emily Davis", email: "emily@example.com", avatar: "", status: "active", plan: "Free", createdAt: "2025-01-05", lastLogin: "2025-01-09" },
  { id: "7", name: "Chris Lee", email: "chris@example.com", avatar: "", status: "active", plan: "Pro", createdAt: "2024-09-15", lastLogin: "2025-01-07" },
  { id: "8", name: "Anna Martinez", email: "anna@example.com", avatar: "", status: "inactive", plan: "Basic", createdAt: "2024-08-20", lastLogin: "2024-11-15" },
];

const statusColors = {
  active: "success",
  inactive: "secondary",
  suspended: "destructive",
};

const planColors = {
  Free: "outline",
  Basic: "secondary",
  Pro: "default",
  Enterprise: "warning",
};

const Users = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [viewDialog, setViewDialog] = useState(false);
  const pageSize = 10;

  // API hooks
  const { data: usersData, isLoading, refetch } = useGetUsersQuery({ page, pageSize, search, status: statusFilter, plan: planFilter });
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  const [toggleStatus] = useToggleUserStatusMutation();

  // Use API data or fallback to mock
  const users = usersData?.data || mockUsers;
  const totalPages = usersData?.totalPages || Math.ceil(mockUsers.length / pageSize);

  // Filter users locally if using mock data
  const filteredUsers = useMemo(() => {
    let result = users;
    
    if (!usersData) {
      if (search) {
        result = result.filter(u => 
          u.name.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase())
        );
      }
      if (statusFilter !== "all") {
        result = result.filter(u => u.status === statusFilter);
      }
      if (planFilter !== "all") {
        result = result.filter(u => u.plan === planFilter);
      }
    }
    
    return result;
  }, [users, search, statusFilter, planFilter, usersData]);

  const handleDelete = async () => {
    if (!selectedUser) return;
    
    try {
      await deleteUser(selectedUser.id).unwrap();
      toast.success("User deleted successfully");
      setDeleteDialog(false);
      setSelectedUser(null);
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete user");
    }
  };

  const handleToggleStatus = async (user, newStatus) => {
    try {
      await toggleStatus({ id: user.id, status: newStatus }).unwrap();
      toast.success(`User ${newStatus === "active" ? "activated" : "deactivated"} successfully`);
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update user status");
    }
  };

  const getInitials = (name) => name.split(" ").map(n => n[0]).join("").toUpperCase();

  const formatDate = (date) => new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Users</h1>
          <p className="text-gray-400">Manage your platform users</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-gray-300">
            {filteredUsers.length} users
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <Card className="bg-[#1a1818] border-[#2a2828]">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-[#0f0d0d] border-[#2a2828] text-white"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[150px] bg-[#0f0d0d] border-[#2a2828] text-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1818] border-[#2a2828]">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
            <Select value={planFilter} onValueChange={setPlanFilter}>
              <SelectTrigger className="w-full sm:w-[150px] bg-[#0f0d0d] border-[#2a2828] text-white">
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
                  <TableHead className="text-gray-400">User</TableHead>
                  <TableHead className="text-gray-400">Status</TableHead>
                  <TableHead className="text-gray-400">Plan</TableHead>
                  <TableHead className="text-gray-400 hidden md:table-cell">Joined</TableHead>
                  <TableHead className="text-gray-400 hidden lg:table-cell">Last Login</TableHead>
                  <TableHead className="text-gray-400 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id} className="border-[#2a2828]">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback className="bg-gradient-to-r from-[#FEC36D] to-[#D78001] text-white">
                            {getInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-white">{user.name}</p>
                          <p className="text-sm text-gray-400">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusColors[user.status]} className="capitalize">
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={planColors[user.plan]}>{user.plan}</Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-gray-400">
                      {formatDate(user.createdAt)}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-gray-400">
                      {formatDate(user.lastLogin)}
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
                            onClick={() => { setSelectedUser(user); setViewDialog(true); }}
                            className="text-gray-300 focus:text-white focus:bg-[#2a2828]"
                          >
                            <Eye className="w-4 h-4 mr-2" /> View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-gray-300 focus:text-white focus:bg-[#2a2828]">
                            <Mail className="w-4 h-4 mr-2" /> Send Email
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-[#2a2828]" />
                          {user.status === "active" ? (
                            <DropdownMenuItem
                              onClick={() => handleToggleStatus(user, "inactive")}
                              className="text-yellow-500 focus:text-yellow-400 focus:bg-[#2a2828]"
                            >
                              <UserX className="w-4 h-4 mr-2" /> Deactivate
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              onClick={() => handleToggleStatus(user, "active")}
                              className="text-green-500 focus:text-green-400 focus:bg-[#2a2828]"
                            >
                              <UserCheck className="w-4 h-4 mr-2" /> Activate
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => { setSelectedUser(user); setDeleteDialog(true); }}
                            className="text-red-500 focus:text-red-400 focus:bg-[#2a2828]"
                          >
                            <Trash2 className="w-4 h-4 mr-2" /> Delete
                          </DropdownMenuItem>
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog} onOpenChange={setDeleteDialog}>
        <DialogContent className="bg-[#1a1818] border-[#2a2828]">
          <DialogHeader>
            <DialogTitle className="text-white">Delete User</DialogTitle>
            <DialogDescription className="text-gray-400">
              Are you sure you want to delete {selectedUser?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog(false)} className="border-[#2a2828] text-gray-300">
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View User Dialog */}
      <Dialog open={viewDialog} onOpenChange={setViewDialog}>
        <DialogContent className="bg-[#1a1818] border-[#2a2828]">
          <DialogHeader>
            <DialogTitle className="text-white">User Details</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={selectedUser.avatar} />
                  <AvatarFallback className="bg-gradient-to-r from-[#FEC36D] to-[#D78001] text-white text-xl">
                    {getInitials(selectedUser.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold text-white">{selectedUser.name}</h3>
                  <p className="text-gray-400">{selectedUser.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Status</p>
                  <Badge variant={statusColors[selectedUser.status]} className="capitalize mt-1">
                    {selectedUser.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Plan</p>
                  <Badge variant={planColors[selectedUser.plan]} className="mt-1">
                    {selectedUser.plan}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Joined</p>
                  <p className="text-white">{formatDate(selectedUser.createdAt)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Last Login</p>
                  <p className="text-white">{formatDate(selectedUser.lastLogin)}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Users;
