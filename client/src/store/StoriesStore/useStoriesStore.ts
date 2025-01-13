import api from "@/config/axios";
import { StoryTypes, UserType } from "@/types/TypeInterfaces";
import { create } from "zustand";

interface storiesStore {
    currentUserWithStory: string,
    setCurrentUserWithStory: (username: string) => void

    stories: StoryTypes[];
    isFetchingStories: boolean;
    fetchStories: (username: string) => void;

    usersHavingStories: UserType[];
    isFetchingUsers: boolean;
    fetchUsers: () => void;

    isCreatingStory: boolean;
    createStory: (story: {
        mediaURL: string;
        caption: string;
    },navigate: any) => void;
}

export const useStoriesStore = create<storiesStore>((set, get) => ({
    stories: [],
    currentUserWithStory: "",
    setCurrentUserWithStory: (username) => {
        set({ currentUserWithStory: username });
    },

    isFetchingStories: true,
    fetchStories: async (username: string) => {
        set({ isFetchingStories: true });
        try {
            const response = await api.get(`/feature/story/${username}`);
            set({ stories: response.data.stories });
        } catch (error) {
            console.log(error);
        } finally {
            set({ isFetchingStories: false });
        }
    },

    isCreatingStory: false,
    createStory: async (story,navigate) => {
        set({ isCreatingStory: true });
        const stories = get().stories;
        try {
            const response = await api.post("/feature/story", story);
            set({ stories: [...stories, response.data.story] });
            navigate("/");
        } catch (error) {
            console.log(error);
        } finally {
            set({ isCreatingStory: false });
        }
    },

    usersHavingStories: [],
    isFetchingUsers: false,
    fetchUsers: async () => {
        set({ isFetchingUsers: true });
        try {
            const response = await api.get("/feature/user-with-stories");
            set({ usersHavingStories: response.data.users });
        } catch (error) {
            console.log(error);
        } finally {
            set({ isFetchingUsers: false });
        }
    }
}));