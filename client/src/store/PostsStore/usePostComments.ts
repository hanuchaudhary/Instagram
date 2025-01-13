import api from "@/config/axios";
import { comment } from "@/types/PostTypes";
import { toast } from "sonner";
import { create } from "zustand";
import { useAuthStore } from "../AuthStore/useAuthStore";
import { useProfileStore } from "../UserStore/useProfileStore";

interface CommentStore {
    comments: comment[];
    fetchComments: (postId : number) => Promise<void>;
    postComment: (postId: number, comment: string) => Promise<void>;

    postId: number | null;
    setPostId: (postId: number | null) => void;
}


export const usePostCommentsStore = create<CommentStore>((set, get) => ({
    comments: [],
    fetchComments: async (paramsPostId) => {
        const postId = get().postId;
        try {
            const response = await api.get(`/feature/comments/${paramsPostId || postId}`);
            set({ comments: response.data.comments });
        } catch (error) {
            console.error("Error fetching comments:", error);
            toast.error("Failed to load comments");
        }
    },
    postComment: async (postId: number, comment: string) => {
        try {
            const authUser = useAuthStore.getState().authUser;
            const profileAvatar = useProfileStore.getState().profile?.avatar;
            await api.post(`/feature/comment/${postId}`, { comment: comment, });
            toast.success("Comment posted successfully");
            const updatedComments = [{
                id: Math.random(),
                comment: comment,
                createdAt: new Date().toISOString(),
                user: {
                    id: authUser?.id!,
                    username: authUser?.username!,
                    avatar: profileAvatar || authUser?.avatar!,
                },
            }, ...get().comments];
            set({ comments: updatedComments });
        } catch (error) {
            console.error("Error posting comment:", error);
            toast.error("Failed to post comment");
        }
    },

    postId: null,
    setPostId: (postId) => {
        set({ postId });
    }
}));
