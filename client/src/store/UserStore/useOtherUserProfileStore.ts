import api from "@/config/axios";
import { UserType } from "./useProfileStore";
import { create } from "zustand";
import { useAuthStore } from "../AuthStore/useAuthStore";

interface otherUserProfileStore {
    profile: UserType | null;
    isLoading: boolean;
    fetchProfile: (username: string) => void;
}

export const useOtherUserProfileStore = create<otherUserProfileStore>((set) => ({
    profile: null,
    isLoading: true,
    selectedPost: null,
    fetchProfile: async (username: string) => {
        const {authUser} = useAuthStore()
        try {
            const response = await api.get(`/user/profile/${authUser?.id}/${username}`);
            set({ profile: response.data.user });
        } catch (error) {
            console.error("Error fetching profile:", error);
        } finally {
            set({ isLoading: false });
        }
    },
}));