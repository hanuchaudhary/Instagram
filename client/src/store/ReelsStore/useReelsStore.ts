import { BACKEND_URL } from '@/config/config';
import axios from 'axios';
import { create } from 'zustand';
import { getAuthHeaders } from '../AuthHeader/getAuthHeaders';

export interface Reel {
    id: string;
    mediaURL: string;
    caption: string;
    createdAt: string;
    User: {
        id: string;
        avatar: string;
        username: string;
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
        const { page, reels } = get();
        set({ isLoading: true, error: null });
        try {
            const response = await axios.get(`${BACKEND_URL}/api/v1/feature/reels?skip=${(page - 1) * 2}&take=10`, {
                headers: {
                    Authorization: getAuthHeaders().Authorization,
                },
            });
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
