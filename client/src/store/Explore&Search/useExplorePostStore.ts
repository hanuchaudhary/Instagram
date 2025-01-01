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
    page: number;
    hasMore: boolean;
    explorePosts: ExplorePost[];
    isLoading: boolean;
    filter: string;
    setFilter: (filter: string) => void;
    fetchExplorePosts: (filter: string) => Promise<void>;
}

export const useExplorePostStore = create<explorePostStore>((set, get) => ({
    page: 1,
    hasMore: true,
    explorePosts: [],
    isLoading: false,
    filter: "",
    setFilter: (filter: string) => set({ filter }),
    fetchExplorePosts: async (filter) => {
        set({ isLoading: true });
        const { explorePosts, page } = get();
        try {
            const res = await api.get(`/post/explore`, {
                params: { filter, page: page, limit: 10 }
            })
            if (res.data.posts.lenght > 0) {
                set({ ...explorePosts, ...res.data.posts, page: page + 1 });
            } else {
                set({ hasMore: false });
            }
            set({ explorePosts: res.data.posts })
        } catch (error) {
            console.error("Error fetching explore posts:", error);
        } finally {
            set({ isLoading: false });
        }
    },
}));