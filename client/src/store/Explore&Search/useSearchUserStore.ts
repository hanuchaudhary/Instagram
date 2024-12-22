import { BACKEND_URL } from "@/config/config";
import axios from "axios";
import { create } from "zustand";
import { getAuthHeaders } from "../AuthHeader/getAuthHeaders";

export interface searchUser {
    id: string;
    avatar: string;
    username: string;
    fullName: string;
    isFollowing: boolean;
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
            const res = await axios.get(`${BACKEND_URL}/api/v1/user/bulk?filter=${filter}`, {
                headers: {
                    Authorization: getAuthHeaders().Authorization
                }
            })
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