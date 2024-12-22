import { BACKEND_URL } from "@/config/config";
import { comment } from "@/types/PostTypes";
import axios from "axios";
import { toast } from "sonner";
import { create } from "zustand";
import { getAuthHeaders } from "../AuthHeader/getAuthHeaders";

interface CommentStore {
    comments: comment[];
    fetchComments: (postId: number) => Promise<void>;
    postComment: (postId: number, comment: string) => Promise<void>;
    // setComments: (comments: Comment[]) => void;
}

export const usePostCommentsStore = create<CommentStore>((set, get) => ({
    comments: [],
    fetchComments: async (postId: number) => {
        try {
            const response = await axios.get(
                `${BACKEND_URL}/api/v1/post/postComments/${postId}`,
                {
                    headers: {
                        Authorization: getAuthHeaders().Authorization,
                    },
                }
            );
            set({ comments: response.data.comments });
        } catch (error) {
            console.error("Error fetching comments:", error);
            toast.error("Failed to load comments");
        }
    },
    postComment: async (postId: number, comment: string) => {
        try {
            await axios.post(
                `${BACKEND_URL}/api/v1/feature/comment/${postId}`,
                {
                    comment: comment,
                },
                {
                    headers: {
                        Authorization: getAuthHeaders().Authorization,
                    },
                }
            );
            toast.success("Comment posted successfully");
            const updatedComments = get().comments.concat({
                id: Math.random(),
                comment: comment,
                createdAt: new Date().toISOString(),
                user: {
                    id: getAuthHeaders().userId,
                    username: getAuthHeaders().username || "",
                    avatar: getAuthHeaders().avatar || "",
                },
            });
            set({ comments: updatedComments });
        } catch (error) {
            console.error("Error posting comment:", error);
            toast.error("Failed to post comment");
        }
    },
}));
