import api from "@/config/axios";
import { create } from "zustand";

export interface searchUser {
    id: string;
    avatar: string;
    username: string;
    fullName: string;
    bio?: string
    location?: string
}

interface searchUserStore {
    searchUsers: searchUser[]
    isLoading: boolean;
    filter: string;
    setFilter: (filter: string) => void;
    fetchSearchedUsers: (filter: string) => Promise<void>;
}

export const useSearchUserStore = create<searchUserStore>((set) => ({
    searchUsers: [],
    fetchSearchedUsers: async (filter) => {
        set({ isLoading: true });
        try {
            const res = await api.get(`/user/bulk?filter=${filter}`);
            set({ searchUsers: res.data.users })
        } catch (error) {
            console.error("Error fetching explore posts:", error);
        } finally {
            set({ isLoading: false });
        }
    },
    isLoading: false,
    filter: "",
    setFilter: (filter: string) => set({ filter }),
}));