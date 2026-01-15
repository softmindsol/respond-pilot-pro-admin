import {
  Search,
  MoreVertical,
  UserCheck,
  UserX,
  Trash2,
  Eye,
  Mail,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const statusColors = {
  active: "success",
  inactive: "tertiary",
  suspended: "destructive",
};

const planColors = {
  Free: "outline",
  Basic: "default",
  Pro: "secondary",
  Enterprise: "warning",
};

const UsersTable = ({
  filteredUsers,
  isLoading,
  setSelectedUser,
  setViewDialog,
  setDeleteDialog,
  handleToggleStatus,
  getInitials,
  formatDate,
}) => {
  return (
    <Card className="bg-[#1a1818] border-[#363A42] overflow-hidden">
      <CardContent className="p-0">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-[#FEC36D]" />
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-16 h-16 rounded-full bg-[#252323] flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-gray-500" />
            </div>
            <p className="text-white text-lg font-medium">No users found</p>
            <p className="text-gray-400 text-sm mt-1">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead className="bg-[#0f0d0d]">
                <tr>
                  <th className="text-left text-xs uppercase tracking-wider text-gray-400 font-semibold px-6 py-4">
                    User
                  </th>
                  <th className="text-left text-xs uppercase tracking-wider text-gray-400 font-semibold px-6 py-4">
                    Status
                  </th>
                  <th className="text-left text-xs uppercase tracking-wider text-gray-400 font-semibold px-6 py-4">
                    Plan
                  </th>
                  <th className="text-left text-xs uppercase tracking-wider text-gray-400 font-semibold px-6 py-4">
                    Joined
                  </th>
                  <th className="text-left text-xs uppercase tracking-wider text-gray-400 font-semibold px-6 py-4">
                    Last Login
                  </th>
                  <th className="text-right text-xs uppercase tracking-wider text-gray-400 font-semibold px-6 py-4">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2a2828]">
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="group hover:bg-[#252323] transition-all duration-200"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback className="bg-gradient-to-r from-[#FEC36D] to-[#D78001] text-white font-semibold">
                              {getInitials(user.name)}
                            </AvatarFallback>
                          </Avatar>
                          <span
                            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-dark ${
                              user.status === "active"
                                ? "bg-green"
                                : user.status === "suspended"
                                ? "bg-red"
                                : "bg-light"
                            }`}
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-white truncate group-hover:text-[#FEC36D] transition-colors duration-200">
                            {user.name}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant={statusColors[user.status]}
                        className="capitalize font-medium"
                      >
                        {user.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant={planColors[user.plan]}
                        className="font-medium"
                      >
                        {user.plan}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-400 text-sm">
                        {formatDate(user.createdAt)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-400 text-sm">
                        {formatDate(user.lastLogin)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-gray-400 hover:text-white hover:bg-[#2a2828] rounded-full"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="bg-[#1a1818] border-[#2a2828] shadow-xl"
                        >
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedUser(user);
                              setViewDialog(true);
                            }}
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
                              onClick={() =>
                                handleToggleStatus(user, "inactive")
                              }
                              className="text-yellow-500 focus:text-yellow-400 focus:bg-[#2a2828]"
                            >
                              <UserX className="w-4 h-4 mr-2" /> Deactivate
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              onClick={() =>
                                handleToggleStatus(user, "active")
                              }
                              className="text-green-500 focus:text-green-400 focus:bg-[#2a2828]"
                            >
                              <UserCheck className="w-4 h-4 mr-2" /> Activate
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedUser(user);
                              setDeleteDialog(true);
                            }}
                            className="text-red-500 focus:text-red-400 focus:bg-[#2a2828]"
                          >
                            <Trash2 className="w-4 h-4 mr-2" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UsersTable;
