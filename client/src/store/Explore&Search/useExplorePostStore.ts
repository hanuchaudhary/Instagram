import { create } from "zustand";
import { mediaType } from "@/types/TypeInterfaces";
import api from "@/config/axios";

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
            const res = await api.get(`/post/explore?filter=${filter}`)
            set({ explorePosts: res.data.posts })
        } catch (error) {
            console.error("Error fetching explore posts:", error);
        } finally {
            set({ isLoading: false });
        }
    },
}));