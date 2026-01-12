import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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

const ViewUserModal = ({
  viewDialog,
  setViewDialog,
  selectedUser,
  getInitials,
  formatDate,
}) => {
  return (
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
                <h3 className="text-lg font-semibold text-white">
                  {selectedUser.name}
                </h3>
                <p className="text-gray-400">{selectedUser.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400">Status</p>
                <Badge
                  variant={statusColors[selectedUser.status]}
                  className="capitalize mt-1"
                >
                  {selectedUser.status}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-400">Plan</p>
                <Badge
                  variant={planColors[selectedUser.plan]}
                  className="mt-1"
                >
                  {selectedUser.plan}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-400">Joined</p>
                <p className="text-white">
                  {formatDate(selectedUser.createdAt)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Last Login</p>
                <p className="text-white">
                  {formatDate(selectedUser.lastLogin)}
                </p>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ViewUserModal;
