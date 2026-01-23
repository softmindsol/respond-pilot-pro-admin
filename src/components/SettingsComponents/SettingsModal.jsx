import { useState } from "react";
import { User, Lock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminProfile from "./AdminProfile";
import ChangePassword from "./ChangePassword";

const SettingsModal = ({ open, onOpenChange, user }) => {
  const [activeTab, setActiveTab] = useState("profile");

  const handlePasswordSuccess = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#0f0d0d] border-[#363A42] sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="text-white text-xl">Settings</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
          <TabsList className="w-full bg-[#1a1818] border border-[#363A42] p-1 h-auto">
            <TabsTrigger
              value="profile"
              className="flex-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#FEC36D] data-[state=active]:to-[#D78001] data-[state=active]:text-white text-light py-2"
            >
              <User className="w-4 h-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger
              value="password"
              className="flex-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#FEC36D] data-[state=active]:to-[#D78001] data-[state=active]:text-white text-light py-2"
            >
              <Lock className="w-4 h-4 mr-2" />
              Password
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-4">
            <AdminProfile user={user} />
          </TabsContent>

          <TabsContent value="password" className="mt-4">
            <ChangePassword onSuccess={handlePasswordSuccess} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;
