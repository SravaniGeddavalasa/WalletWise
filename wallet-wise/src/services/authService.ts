import axiosInstance from "../api/axiosInstance";
import { mockDb } from "./mockDb";
import type { UserProfile } from "./mockDb";

export const authService = {
  async getProfile(): Promise<UserProfile> {
    try {
      const res = await axiosInstance.get("/auth/profile");
      return res.data.user;
    } catch (error) {
      console.warn("getProfile API failed, falling back to mock");
      return mockDb.getUserProfile();
    }
  },

  async login(credentials: any) {
    // API Call is managed inside context directly, but we provide this for consistency
    const res = await axiosInstance.post("/auth/login", credentials);
    return res.data;
  },

  async register(data: any) {
    const res = await axiosInstance.post("/auth/register", data);
    return res.data;
  },

  async forgotPassword(email: string) {
    const res = await axiosInstance.post("/auth/forgot-password", { email });
    return res.data;
  },

  async resetPassword(data: any) {
    const res = await axiosInstance.post("/auth/reset-password", data);
    return res.data;
  },

  async updateProfile(profileData: Partial<UserProfile>): Promise<UserProfile> {
    try {
      const res = await axiosInstance.patch("/auth/profile", profileData);
      return res.data.user;
    } catch (error) {
      console.warn("updateProfile API failed, updating mock database");
      return mockDb.updateUserProfile(profileData);
    }
  },

  async uploadAvatar(base64Image: string): Promise<UserProfile> {
    try {
      const res = await axiosInstance.post("/auth/avatar", { avatar: base64Image });
      return res.data;
    } catch (error) {
      console.warn("uploadAvatar API failed, updating mock database");
      return mockDb.updateUserProfile({ avatar: base64Image });
    }
  },

  async changePassword(data: any) {
    const res = await axiosInstance.post("/auth/change-password", data);
    return res.data;
  },
};

export default authService;
