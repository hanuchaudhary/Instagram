import api from "@/config/axios";
import { create } from "zustand";

interface FollowData {
    user: {
        id: string,
        avatar: string,
        username: string
    }
}

interface FollowResponse {
    success: boolean,
    followers: FollowData[],
    following: FollowData[]
}

interface FollowDataStore {
    isLoading: boolean;
    followers: FollowData[];
    following: FollowData[];
    fetchFollowData: () => void;
    handleFollow: (userId: string) => void;
    handleUnfollow: (userId: string) => void;

}

export const useFollowDataStore = create<FollowDataStore>((set) => ({
    isLoading: true,
    followers: [],
    following: [],
    fetchFollowData: async () => {
        try {
            const response = await api.get<FollowResponse>(`/user/bulk-followers`);
            const data = response.data;
            set({ followers: data.followers, following: data.following });
        } catch (err) {
            console.error("Failed to fetch follow data");
        } finally {
            set({ isLoading: false });
        }
    },
    handleFollow: async (userId: string) => {
        try {
            const res = await api.post(`/feature/follow/${userId}`);

            if (res.data.success) {
                set((state) => ({
                    following: [...state.following, { user: { id: userId, avatar: "", username: "" } }],
                    isFollowing: true,
                }));
            }
        } catch (error) {
            console.log(error);
        }
    },
    handleUnfollow: async (userId: string) => {
        try {
            const res = await api.post(`/api/v1/feature/unfollow/${userId}`);

            if (res.data.success) {
                set((state) => ({
                    following: state.following.filter((user) => user.user.id !== userId),
                    isFollowing: false,
                }));
            }
        } catch (error) {
            console.log(error);
        }
    }
}));