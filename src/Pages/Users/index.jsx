import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import toast from "react-hot-toast";

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
  const [statusFilter, setStatusFilter] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [viewDialog, setViewDialog] = useState(false);
  const pageSize = 10;

  // API hooks
  const {
    data: usersData,
    isLoading,
    refetch,
  } = useGetUsersQuery({
    page,
    pageSize,
    search,
    status: statusFilter,
    plan: planFilter,
  });
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  const [toggleStatus] = useToggleUserStatusMutation();

  // Use API data or fallback to mock
  const users = usersData?.data || mockUsers;
  const totalPages =
    usersData?.totalPages || Math.ceil(mockUsers.length / pageSize);

  // Filter users locally if using mock data
  const filteredUsers = useMemo(() => {
    let result = users;

    if (!usersData) {
      if (search) {
        result = result.filter(
          (u) =>
            u.name.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase())
        );
      }
      if (statusFilter !== "all") {
        result = result.filter((u) => u.status === statusFilter);
      }
      if (planFilter !== "all") {
        result = result.filter((u) => u.plan === planFilter);
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
      toast.success(
        `User ${
          newStatus === "active" ? "activated" : "deactivated"
        } successfully`
      );
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update user status");
    }
  };

  const getInitials = (name) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="md:text-2xl text-xl font-bold text-white">Users</h1>
          <p className="text-light md:text-base text-sm">
            Manage your platform users
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-gray py-2 px-4">
            {filteredUsers.length} users
          </Badge>
        </div>
      </div>
      {/* Filters */}
      <Card className="bg-[#1a1818] border-[#363A42]">
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-4">
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
      <UsersTable
        filteredUsers={filteredUsers}
        isLoading={isLoading}
        setSelectedUser={setSelectedUser}
        setViewDialog={setViewDialog}
        setDeleteDialog={setDeleteDialog}
        handleToggleStatus={handleToggleStatus}
        getInitials={getInitials}
        formatDate={formatDate}
      />

      {/* Pagination */}
      <Pagination
        filteredUsers={filteredUsers}
        users={users}
        page={page}
        setPage={setPage}
        totalPages={totalPages}
      />

      {/* Delete Confirmation Dialog */}
      {deleteDialog && (
        <DeleteModal
          deleteDialog={deleteDialog}
          setDeleteDialog={setDeleteDialog}
          selectedUser={selectedUser}
          handleDelete={handleDelete}
          isDeleting={isDeleting}
        />
      )}

      {/* View User Dialog */}
      {viewDialog && (
        <ViewUserModal
          viewDialog={viewDialog}
          setViewDialog={setViewDialog}
          selectedUser={selectedUser}
          getInitials={getInitials}
          formatDate={formatDate}
        />
      )}
    </div>
  );
};

export default Users;
