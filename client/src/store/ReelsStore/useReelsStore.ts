import { BACKEND_URL } from "@/config/config";
import axios from "axios";
import { getAuthHeaders } from "../AuthHeader/getAuthHeaders";
import { create } from "zustand";

export interface Reel {
    id: string;
    mediaURL: string;
    caption: string;
    createdAt: string;
    User: {
        avatar: string;
        username: string;
    };
}

interface ReelsStore {
    isLoading: boolean;
    reels: Reel[];
    fetchReels: () => void;
}
export const useReelsStore = create<ReelsStore>((set) => ({
    isLoading: false,
    reels: [],
    fetchReels: async () => {
        try {
            set({ isLoading: true });
            const response = await axios.get(`${BACKEND_URL}/api/v1/feature/reels`, {
                headers: getAuthHeaders(),
            });
            set({ reels: response.data.reels });
        } catch (error) {
            console.error(error);
        }finally{
            set({ isLoading: false });
        }
    },
}));