import api from "@/config/axios";
import { UserType } from "./useProfileStore";
import { create } from "zustand";

interface otherUserProfileStore {
    profile: UserType | null;
    isLoading: boolean;
    fetchProfile: (loggedUserId: string, username: string) => void;
}

export const useOtherUserProfileStore = create<otherUserProfileStore>((set) => ({
    profile: null,
    isLoading: true,
    selectedPost: null,
    fetchProfile: async (loggedUserId: string, username: string) => {
        try {
            const response = await api.get(`/user/profile/${loggedUserId}/${username}`);
            set({ profile: response.data.user });
        } catch (error) {
            console.error("Error fetching profile:", error);
        } finally {
            set({ isLoading: false });
        }
    },
}));