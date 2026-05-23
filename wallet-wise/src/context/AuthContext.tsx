import React, { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import { mockDb } from "../services/mockDb";
import type { UserProfile } from "../services/mockDb";

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, age: number, gender: string) => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>;
  verifyOtp: (email: string, otp: string) => Promise<void>;
  resetPassword: (email: string, otp: string, password: string) => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<UserProfile>;
  uploadAvatar: (base64Image: string) => Promise<UserProfile>;
  changePassword: (current: string, newPass: string) => Promise<void>;
  isMockMode: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isMockMode, setIsMockMode] = useState<boolean>(false);

  // Load user session on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("walletwise_access_token");
      const storedUser = localStorage.getItem("walletwise_user");

      if (token && storedUser) {
        try {
          // If token is present, we try to fetch profile from server
          // If server is unreachable, we fall back to localStorage/mock profile
          const res = await axiosInstance.get("/auth/profile");
          const profile = res.data.user;
          setUser(profile);
          localStorage.setItem("walletwise_user", JSON.stringify(profile));
          setIsMockMode(false);
        } catch (err: any) {
          console.warn("Failed to fetch profile from server, using local fallback.", err.message);
          setUser(JSON.parse(storedUser));
          setIsMockMode(true);
        }
      } else {
        // No session stored
        setUser(null);
      }
      setIsLoading(false);
    };

    initAuth();

    // Listen for session expiry from axios interceptor
    const handleExpired = () => {
      setUser(null);
      setIsMockMode(false);
    };

    window.addEventListener("walletwise_session_expired", handleExpired);
    return () => {
      window.removeEventListener("walletwise_session_expired", handleExpired);
    };
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // 1. Try Live API
      const res = await axiosInstance.post("/auth/login", { email, password });
      const { accessToken, refreshToken, user: serverUser } = res.data;
      
      localStorage.setItem("walletwise_access_token", accessToken);
      localStorage.setItem("walletwise_refresh_token", refreshToken);
      localStorage.setItem("walletwise_user", JSON.stringify(serverUser));
      
      setUser(serverUser);
      setIsMockMode(false);
    } catch (err: any) {
      // If it's a Network Error, we still want to gracefully fall back to the mock database.
      // Removed the explicit throw to allow offline usage.
      
      // 2. Offline Fallback
      console.warn("Login API error or server offline. Using mock authentication.", err.message);
      
      const db = JSON.parse(localStorage.getItem("ww_users_db") || "[]");
      const found = db.find((u: any) => u.email === email && u.password === password);
      
      if (found) {
        localStorage.setItem("walletwise_access_token", "mock_access_token_" + Date.now());
        localStorage.setItem("walletwise_refresh_token", "mock_refresh_token_" + Date.now());
        localStorage.setItem("walletwise_user", JSON.stringify(found.profile));
        
        setUser(found.profile);
        setIsMockMode(true);
      } else {
        throw new Error(err.message || "Invalid email or password");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, age: number, gender: string) => {
    setIsLoading(true);
    try {
      // 1. Try Live API
      const res = await axiosInstance.post("/auth/register", { name, email, password, age, gender });
      const { accessToken, refreshToken, user: serverUser } = res.data;
      
      localStorage.setItem("walletwise_access_token", accessToken);
      localStorage.setItem("walletwise_refresh_token", refreshToken);
      localStorage.setItem("walletwise_user", JSON.stringify(serverUser));
      
      setUser(serverUser);
      setIsMockMode(false);
    } catch (err: any) {
      // If it's a Network Error, we still want to gracefully fall back to the mock database.
      // Removed the explicit throw to allow offline usage.

      // 2. Offline Fallback
      console.warn("Register API error, writing to mock database.", err.message);
      
      const db = JSON.parse(localStorage.getItem("ww_users_db") || "[]");
      if (db.some((u: any) => u.email === email)) {
        throw new Error("Email already registered (Mock Database)");
      }
      
      const newProfile: UserProfile = {
        id: "u_" + Math.random().toString(36).substr(2, 9),
        name,
        email,
        phone: "",
        address: "",
        avatar: "",
        role: "user",
        age,
        gender
      };
      
      db.push({ email, password, profile: newProfile });
      localStorage.setItem("ww_users_db", JSON.stringify(db));
      
      localStorage.setItem("walletwise_access_token", "mock_access_token_" + Date.now());
      localStorage.setItem("walletwise_refresh_token", "mock_refresh_token_" + Date.now());
      localStorage.setItem("walletwise_user", JSON.stringify(newProfile));
      
      // Update the active profile mockDB is tracking too
      localStorage.setItem("ww_user_profile", JSON.stringify(newProfile));
      
      setUser(newProfile);
      setIsMockMode(true);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("walletwise_access_token");
    localStorage.removeItem("walletwise_refresh_token");
    localStorage.removeItem("walletwise_user");
    setUser(null);
    setIsMockMode(false);
  };

  const forgotPassword = async (email: string) => {
    try {
      await axiosInstance.post("/auth/forgot-password", { email });
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.message || "Failed to submit request.";
      throw new Error(errMsg);
    }
  };

  const verifyOtp = async (email: string, otp: string) => {
    try {
      await axiosInstance.post("/auth/verify-otp", { email, otp });
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.message || "Failed to verify OTP.";
      throw new Error(errMsg);
    }
  };

  const resetPassword = async (email: string, otp: string, password: string) => {
    try {
      await axiosInstance.post("/auth/reset-password", { email, otp, password });
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.message || "Failed to reset password.";
      throw new Error(errMsg);
    }
  };

  const updateProfile = async (data: Partial<UserProfile>): Promise<UserProfile> => {
    try {
      const res = await axiosInstance.patch("/auth/profile", data);
      const profile = res.data.user;
      localStorage.setItem("walletwise_user", JSON.stringify(profile));
      setUser(profile);
      return profile;
    } catch (err: any) {
      console.warn("UpdateProfile API error. Saving locally.", err.message);
      const updated = mockDb.updateUserProfile(data);
      localStorage.setItem("walletwise_user", JSON.stringify(updated));
      setUser(updated);
      return updated;
    }
  };

  const uploadAvatar = async (base64Image: string): Promise<UserProfile> => {
    try {
      const res = await axiosInstance.post("/auth/avatar", { avatar: base64Image });
      const updatedUser = { ...user, avatar: res.data.avatar } as UserProfile;
      localStorage.setItem("walletwise_user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      return updatedUser;
    } catch (err: any) {
      console.warn("AvatarUpload API error. Saving locally.", err.message);
      const updated = mockDb.updateUserProfile({ avatar: base64Image });
      localStorage.setItem("walletwise_user", JSON.stringify(updated));
      setUser(updated);
      return updated;
    }
  };

  const changePassword = async (current: string, newPass: string) => {
    try {
      await axiosInstance.post("/auth/change-password", { currentPassword: current, newPassword: newPass });
    } catch (err: any) {
      console.warn("ChangePassword API error. Modifying locally.", err.message);
      const currentProfile = mockDb.getUserProfile();
      const db = JSON.parse(localStorage.getItem("ww_users_db") || "[]");
      const idx = db.findIndex((u: any) => u.email === currentProfile.email && u.password === current);
      
      if (idx !== -1) {
        db[idx].password = newPass;
        localStorage.setItem("ww_users_db", JSON.stringify(db));
      } else {
        throw new Error("Incorrect current password (Mock Database)");
      }
      await new Promise(r => setTimeout(r, 800));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        forgotPassword,
        verifyOtp,
        resetPassword,
        updateProfile,
        uploadAvatar,
        changePassword,
        isMockMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
