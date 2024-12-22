import { BACKEND_URL } from "@/config/config";
import axios from "axios";
import { getAuthHeaders } from "../AuthHeader/getAuthHeaders";
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
    unFollowUser: (id: string) => void;
}

export const useFollowDataStore = create<FollowDataStore>((set) => ({
    isLoading: true,
    followers: [],
    following: [],
    fetchFollowData: async () => {
        try {
            const response = await axios.get<FollowResponse>(`${BACKEND_URL}/api/v1/user/bulk-followers`, {
                headers: {
                    Authorization: getAuthHeaders().Authorization,
                }
            });
            set({ followers: response.data.followers, following: response.data.following });
        } catch (err) {
            console.error("Failed to fetch follow data");
        } finally {
            set({ isLoading: false });
        }
    },
    unFollowUser: async (id: string) => {
        try {
            await axios.post(
                `${BACKEND_URL}/api/v1/feature/unfollow/${id}`,
                {},
                {
                    headers: {
                        Authorization: getAuthHeaders().Authorization,
                    },
                }
            );
            set((state) => ({
                following: state.following.filter((user) => user.user.id !== id),
            }));
        } catch (error) {
            console.log(error);
        }
    }
}));