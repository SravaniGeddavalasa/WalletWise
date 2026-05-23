import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../hooks/useToast";
import { profileSchema, changePasswordSchema } from "../../validations/schemas";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { User, Shield, Camera, Phone, MapPin, Mail, Key } from "lucide-react";
import { motion } from "framer-motion";

export const Settings: React.FC = () => {
  const { user, updateProfile, uploadAvatar, changePassword } = useAuth();
  const { addToast } = useToast();
  
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Profile Form
  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
  } = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      phone: user?.phone || "",
      address: user?.address || "",
    },
  });

  // Password Form
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPasswordForm,
    formState: { errors: passwordErrors },
  } = useForm({
    resolver: yupResolver(changePasswordSchema),
  });

  const onProfileSubmit = async (data: any) => {
    setProfileLoading(true);
    try {
      await updateProfile(data);
      addToast("Profile details updated successfully!", "success");
    } catch (error: any) {
      addToast(error.message || "Failed to update profile", "error");
    } finally {
      setProfileLoading(false);
    }
  };

  const onPasswordSubmit = async (data: any) => {
    setPasswordLoading(true);
    try {
      await changePassword(data.currentPassword, data.newPassword);
      addToast("Password changed successfully!", "success");
      resetPasswordForm();
    } catch (error: any) {
      addToast(error.message || "Failed to change password. Make sure current password is correct.", "error");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (e.g., 2MB)
    if (file.size > 2 * 1024 * 1024) {
      addToast("Image size must be less than 2MB", "error");
      return;
    }

    setAvatarLoading(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const base64String = reader.result as string;
        await uploadAvatar(base64String);
        addToast("Profile picture updated successfully!", "success");
      } catch (error: any) {
        addToast(error.message || "Failed to upload avatar", "error");
      } finally {
        setAvatarLoading(false);
      }
    };
    reader.onerror = () => {
      addToast("Failed to read image file", "error");
      setAvatarLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex-1 space-y-8 p-6 md:p-8 pt-24 max-w-5xl mx-auto w-full">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/75 bg-clip-text text-transparent">
            Settings
          </h2>
          <p className="text-muted-foreground mt-1 select-none">
            Manage your personal profile, secure your account details and configure preferences.
          </p>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Left Column: Avatar & Summary */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="md:col-span-1"
        >
          <Card className="border-border/50 bg-background/50 backdrop-blur-xl shadow-lg h-full">
            <CardHeader className="text-center pb-4">
              <div className="relative mx-auto w-28 h-28 mb-4">
                <div 
                  onClick={triggerFileSelect}
                  className="w-full h-full rounded-full border-2 border-primary/20 flex items-center justify-center overflow-hidden group cursor-pointer relative bg-accent/50 hover:border-primary transition-all duration-300"
                >
                  {avatarLoading ? (
                    <div className="animate-pulse w-full h-full bg-muted flex items-center justify-center">
                      <span className="text-xs font-medium text-muted-foreground">Uploading...</span>
                    </div>
                  ) : user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <User className="h-14 w-14 text-primary/75" />
                  )}
                  
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Camera className="h-6 w-6 text-white" />
                  </div>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAvatarChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
              <CardTitle className="text-xl font-bold">{user?.name || "Alex Johnson"}</CardTitle>
              <CardDescription className="capitalize font-medium text-primary mt-1">
                {user?.role || "Premium Member"}
              </CardDescription>
            </CardHeader>
            <CardContent className="border-t border-border/20 pt-6">
              <div className="space-y-4 text-sm">
                <div className="flex items-center text-muted-foreground gap-3">
                  <Mail className="h-4.5 w-4.5 text-primary/70 shrink-0" />
                  <span className="truncate">{user?.email || "alex.johnson@example.com"}</span>
                </div>
                <div className="flex items-center text-muted-foreground gap-3">
                  <Phone className="h-4.5 w-4.5 text-primary/70 shrink-0" />
                  <span>{user?.phone || "No phone number added"}</span>
                </div>
                <div className="flex items-center text-muted-foreground gap-3">
                  <MapPin className="h-4.5 w-4.5 text-primary/70 shrink-0" />
                  <span className="line-clamp-2">{user?.address || "No address added"}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Right Column: Update Profile & Change Password */}
        <div className="md:col-span-2 space-y-8">
          {/* Personal Information */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card className="border-border/50 bg-background/50 backdrop-blur-xl shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2.5 text-xl font-bold">
                  <User className="h-5 w-5 text-primary" />
                  Personal Information
                </CardTitle>
                <CardDescription>Update your personal details and location details.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Full Name"
                      placeholder="Alex Johnson"
                      error={profileErrors.name?.message}
                      {...registerProfile("name")}
                    />
                    <Input
                      label="Phone Number"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      error={profileErrors.phone?.message}
                      {...registerProfile("phone")}
                    />
                  </div>
                  <Input
                    label="Email Address (Cannot be changed)"
                    type="email"
                    value={user?.email || ""}
                    disabled
                    containerClassName="opacity-70"
                  />
                  <Input
                    label="Address"
                    placeholder="123 Innovation Drive, San Francisco, CA"
                    error={profileErrors.address?.message}
                    {...registerProfile("address")}
                  />
                  <div className="pt-4 flex justify-end">
                    <Button type="submit" isLoading={profileLoading}>
                      Save Changes
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Change Password */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card className="border-border/50 bg-background/50 backdrop-blur-xl shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2.5 text-xl font-bold">
                  <Shield className="h-5 w-5 text-primary" />
                  Security & Password
                </CardTitle>
                <CardDescription>Update your password to keep your account secure.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4">
                  <Input
                    label="Current Password"
                    type="password"
                    placeholder="••••••••"
                    leftIcon={<Key className="h-4.5 w-4.5 text-muted-foreground" />}
                    error={passwordErrors.currentPassword?.message}
                    {...registerPassword("currentPassword")}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="New Password"
                      type="password"
                      placeholder="••••••••"
                      leftIcon={<Key className="h-4.5 w-4.5 text-muted-foreground" />}
                      error={passwordErrors.newPassword?.message}
                      {...registerPassword("newPassword")}
                    />
                    <Input
                      label="Confirm New Password"
                      type="password"
                      placeholder="••••••••"
                      leftIcon={<Key className="h-4.5 w-4.5 text-muted-foreground" />}
                      error={passwordErrors.confirmPassword?.message}
                      {...registerPassword("confirmPassword")}
                    />
                  </div>
                  <div className="pt-4 flex justify-end">
                    <Button type="submit" isLoading={passwordLoading}>
                      Update Password
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
