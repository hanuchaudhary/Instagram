import { BACKEND_URL } from "@/config/config";
import axios from "axios";
import { create } from "zustand";
import { getAuthHeaders } from "../AuthHeader/getAuthHeaders";
import { mediaType } from "@/types/TypeInterfaces";

interface ExplorePost {
    id: Number,
    mediaURL: String,
    mediaType: mediaType,
    _count: {
        likes: number
    }
}

interface explorePostStore {
    explorePosts: ExplorePost[];
    isLoading: boolean;
    filter: string;
    setFilter: (filter: string) => void;
    fetchExplorePosts: (filter: string) => Promise<void>;
}

export const useExplorePostStore = create<explorePostStore>((set) => ({
    explorePosts: [],
    isLoading: false,
    filter: "",
    setFilter: (filter: string) => set({ filter }),
    fetchExplorePosts: async (filter) => {
        set({ isLoading: true });
        try {
            const res = await axios.get(`${BACKEND_URL}/api/v1/post/explore?filter=${filter}`, {
                headers: {
                    Authorization: getAuthHeaders().Authorization
                }
            })
            set({ explorePosts: res.data.posts })
        } catch (error) {
            console.error("Error fetching explore posts:", error);
        } finally {
            set({ isLoading: false });
        }
    },
}));