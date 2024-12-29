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
        const { page } = get();
        set({ isLoading: true, error: null });
        try {
            const response = await api.get(`/feature/reels?skip=${(page - 1) * 2}&take=10`);
            const data = response.data;
            if (data.success) {
                set((state) => ({
                    reels: [...state.reels, ...data.reels],
                    page: state.page + 1,
                    hasMore: data.reels.length === 2,
                }));
            } else {
                set({ error: data.message || 'Failed to fetch reels' });
            }
        } catch (error) {
            set({ error: 'An error occurred while fetching reels' });
        } finally {
            set({ isLoading: false });
        }
    },
}));
