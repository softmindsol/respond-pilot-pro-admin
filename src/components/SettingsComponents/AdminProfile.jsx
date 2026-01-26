import { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { Loader2, Pencil, Check, X, Camera } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useUpdateProfileMutation } from "@/store/api/authApi";
import { fetchUserProfile } from "@/store/features/auth/authActions";

const AdminProfile = ({ user }) => {
  const dispatch = useDispatch();
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [error, setError] = useState("");

  console.log(user?.profileImage);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [avatarError, setAvatarError] = useState("");
  const fileInputRef = useRef(null);

  const handleEdit = () => {
    setName(user?.name || "");
    setIsEditing(true);
    setError("");
  };

  const handleCancel = () => {
    setName(user?.name || "");
    setIsEditing(false);
    setError("");
  };

  const handleSave = async () => {
    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    try {
      await updateProfile({ name: name.trim() }).unwrap();
      dispatch(fetchUserProfile()); // Refresh profile data
      setIsEditing(false);
      setError("");
    } catch (err) {
      setError(err?.data?.message || "Failed to update name");
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setAvatarError("Please select an image file");
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setAvatarError("Image size should be less than 2MB");
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => setAvatarPreview(e.target.result);
    reader.readAsDataURL(file);

    // Upload avatar
    setIsUploadingAvatar(true);
    setAvatarError("");

    try {
      const formData = new FormData();
      formData.append("profileImage", file);

      await updateProfile(formData).unwrap();
      dispatch(fetchUserProfile()); // Refresh profile data
      setAvatarPreview(null);
    } catch (err) {
      setAvatarError(err?.data?.message || "Failed to update avatar");
      setAvatarPreview(null);
    } finally {
      setIsUploadingAvatar(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="relative group">
          <Avatar className="w-16 h-16">
            <AvatarImage
              src={
                avatarPreview
                  ? avatarPreview
                  : user?.profileImage
                    ? user.profileImage.startsWith("http")
                      ? user.profileImage
                      : `${import.meta.env.VITE_PROFILE_FETCH}${user.profileImage}`
                    : null
              }
            />
            <AvatarFallback className="bg-gradient-to-r from-orange to-yellow text-white text-xl">
              {user?.name?.charAt(0) || "A"}
            </AvatarFallback>
          </Avatar>

          {/* Avatar overlay for upload */}
          <button
            type="button"
            onClick={handleAvatarClick}
            disabled={isUploadingAvatar}
            className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          >
            {isUploadingAvatar ? (
              <Loader2 className="w-5 h-5 text-white animate-spin" />
            ) : (
              <Camera className="w-5 h-5 text-white" />
            )}
          </button>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white">
            {user?.name || "Admin"}
          </h3>
          <p className="text-sm text-light">
            {user?.email || "admin@example.com"}
          </p>
          {avatarError && (
            <p className="text-xs text-red-500 mt-1">{avatarError}</p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-light">Full Name</Label>
          <div className="flex items-center gap-2">
            <Input
              value={isEditing ? name : user?.name || ""}
              onChange={(e) => setName(e.target.value)}
              disabled={!isEditing || isLoading}
              className={`bg-[#1a1818] border-[#363A42] text-white ${
                !isEditing ? "cursor-not-allowed opacity-70" : ""
              }`}
              error={error}
            />
            {!isEditing ? (
              <Button
                type="button"
                size="icon"
                onClick={handleEdit}
                className="text-light h-12 hover:text-white px-6 new-gradient-border"
              >
                <Pencil className="w-4 h-4" />
              </Button>
            ) : (
              <div className="flex gap-1 shrink-0">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={handleSave}
                  disabled={isLoading}
                  className="text-green size-12 hover:text-green hover:bg-green/15"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="size-5" />
                  )}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="text-red size-12 hover:text-red hover:bg-red/15"
                >
                  <X className="size-5" />
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-light">Email Address</Label>
          <Input
            value={user?.email || ""}
            disabled={true}
            className="bg-[#1a1818] border-[#363A42] text-white cursor-not-allowed"
          />
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
