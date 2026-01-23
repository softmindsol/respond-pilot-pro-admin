import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUpdatePasswordMutation } from "@/store/api/authApi";

const PasswordField = ({ 
  name, 
  label, 
  value, 
  showPassword, 
  onToggleVisibility, 
  onChange, 
  placeholder, 
  error 
}) => (
  <div className="space-y-2">
    <Label className="text-white">{label}</Label>
    <div className="relative">
      <Input
        type={showPassword ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="bg-[#1a1818] border-[#363A42] text-white pr-10"
        error={error}
      />
      <button
        type="button"
        onClick={onToggleVisibility}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-light hover:text-white transition-colors"
      >
        {showPassword ? (
          <EyeOff className="w-4 h-4" />
        ) : (
          <Eye className="w-4 h-4" />
        )}
      </button>
    </div>
  </div>
);

const ChangePassword = ({ onSuccess }) => {
  const [updatePassword, { isLoading }] = useUpdatePasswordMutation();

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const validateForm = () => {
    const newErrors = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }

    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your new password";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    setSuccessMessage("");
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");

    if (!validateForm()) return;

    try {
      await updatePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      }).unwrap();

      setSuccessMessage("Password updated successfully!");
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      
      if (onSuccess) {
        setTimeout(() => onSuccess(), 1500);
      }
    } catch (error) {
      setErrors({
        submit: error?.data?.message || "Failed to update password. Please try again.",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PasswordField
        name="currentPassword"
        label="Current Password"
        value={formData.currentPassword}
        showPassword={showPasswords.current}
        onToggleVisibility={() => togglePasswordVisibility("current")}
        onChange={handleChange}
        placeholder="Enter current password"
        error={errors.currentPassword}
      />

      <PasswordField
        name="newPassword"
        label="New Password"
        value={formData.newPassword}
        showPassword={showPasswords.new}
        onToggleVisibility={() => togglePasswordVisibility("new")}
        onChange={handleChange}
        placeholder="Enter new password"
        error={errors.newPassword}
      />

      <PasswordField
        name="confirmPassword"
        label="Confirm New Password"
        value={formData.confirmPassword}
        showPassword={showPasswords.confirm}
        onToggleVisibility={() => togglePasswordVisibility("confirm")}
        onChange={handleChange}
        placeholder="Confirm new password"
        error={errors.confirmPassword}
      />

      {errors.submit && (
        <p className="text-red-500 text-sm">{errors.submit}</p>
      )}

      {successMessage && (
        <p className="text-green-500 text-sm">{successMessage}</p>
      )}

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full h-11 mt-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
            Updating...
          </>
        ) : (
          "Update Password"
        )}
      </Button>
    </form>
  );
};

export default ChangePassword;
