import { BACKEND_URL } from "@/config/config";
import axios from "axios";
import { create } from "zustand";
import { getAuthHeaders } from "../AuthHeader/getAuthHeaders";
import { searchUser } from "../Explore&Search/useSearchUserStore";

interface SuggestedUsersStore {
    suggestedUsers: searchUser[];
    fetchSuggestedUsers: () => void;
}

export const useSuggestedUsersStore = create<SuggestedUsersStore>((set) => ({
    suggestedUsers: [],
    fetchSuggestedUsers: async () => {
        try {
            const res = await axios.get(`${BACKEND_URL}/api/v1/user/suggestions`, {
                headers: {
                    Authorization: getAuthHeaders().Authorization,
                },
            });
            set({ suggestedUsers: res.data.suggestedUsers });
        } catch (error) {
            console.error("Error fetching suggested users:", error);
        }
    },
}));