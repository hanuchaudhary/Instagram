import api from "@/config/axios";
import { comment } from "@/types/PostTypes";
import { toast } from "sonner";
import { create } from "zustand";
import { useUserStore } from "../AuthHeader/getAuthHeaders";

interface CommentStore {
    comments: comment[];
    fetchComments: (postId: number) => Promise<void>;
    postComment: (postId: number, comment: string) => Promise<void>;
}


export const usePostCommentsStore = create<CommentStore>((set, get) => ({
    comments: [],
    fetchComments: async (postId: number) => {
        try {
            const response = await api.get(`/feature/comments/${postId}`);
            set({ comments: response.data.comments });
        } catch (error) {
            console.error("Error fetching comments:", error);
            toast.error("Failed to load comments");
        }
    },
    postComment: async (postId: number, comment: string) => {
        try {
            const stateUser = useUserStore.getState().stateUser;
            await api.post(`/feature/comment/${postId}`, { comment: comment, });
            toast.success("Comment posted successfully");
            const updatedComments = [{
                id: Math.random(),
                comment: comment,
                createdAt: new Date().toISOString(),
                user: {
                    id: stateUser?.id!,
                    username: stateUser?.username!,
                    avatar: stateUser?.avatar!,
                },
            }, ...get().comments];
            set({ comments: updatedComments });
        } catch (error) {
            console.error("Error posting comment:", error);
            toast.error("Failed to post comment");
        }
    },
}));
