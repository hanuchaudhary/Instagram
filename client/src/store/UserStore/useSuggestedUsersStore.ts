import { create } from "zustand";
import api from "@/config/axios";
import { searchUser } from "../Explore&Search/useSearchUserStore";

interface SuggestedUsersStore {
  suggestedUsers: searchUser[];
  isLoading: boolean;
  error: string | null;
  fetchSuggestedUsers: () => Promise<void>;
}

export const useSuggestedUsersStore = create<SuggestedUsersStore>((set, get) => ({
  suggestedUsers: [],
  isLoading: false,
  error: null,
  fetchSuggestedUsers: async () => {
    const state = get();
    if (state.suggestedUsers.length > 0) {
      return;
    }
    set({ isLoading: true, error: null });
    try {
      const res = await api.get(`/user/suggestions`);
      set({ suggestedUsers: res.data.suggestedUsers });
    } catch (error: any) {
      set({ error: error.response?.data?.message || "Failed to fetch users" });
    } finally {
      set({ isLoading: false });
    }
  },
}));
