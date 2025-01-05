import api from '@/config/axios';
import { create } from 'zustand';

export interface Reel {
    id: string;
    mediaURL: string;
    caption: string;
    createdAt: string;
    User: {
        id: string;
        avatar: string;
        username: string;
        fullName: string;
        bio: string;
        location: string;
    };
    Post: {
        id : number;
        _count: {
            likes: number;
            comments: number;
        };
    }
}

interface ReelsStore {
    reels: Reel[];
    isLoading: boolean;
    error: string | null;
    hasMore: boolean;
    page: number;
    fetchReels: () => Promise<void>;
}

export const useReelsStore = create<ReelsStore>((set, get) => ({
    reels: [],
    isLoading: false,
    error: null,
    hasMore: true,
    page: 1,
    fetchReels: async () => {
        const { page, reels } = get();
        set({ isLoading: true, error: null });
        try {
            const response = await api.get(`/feature/reels`, {
                params: {
                    page,
                    limit: 2
                }
            });
            const newReels = response.data.reels;
            if (newReels.length > 0) {
                set({ reels: [...reels, ...newReels], page: page + 1 });
            } else {
                set({ error: 'Failed to fetch reels', hasMore: false });
            }
        } catch (error) {
            set({ error: 'An error occurred while fetching reels' });
        } finally {
            set({ isLoading: false });
        }
    },
}));
