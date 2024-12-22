import { BACKEND_URL } from "@/config/config";
import axios from "axios";
import { create } from "zustand";
import { getAuthHeaders } from "../AuthHeader/getAuthHeaders";
import { LikeType } from "@/types/TypeInterfaces";

interface PostStore {
    posts: any[];
    fetchPosts: () => void;
    handleLikePost: (postId: string) => void;
    isPostLiked: (postId: string, userId: string) => boolean;
    setIsPostLiked: (postId: string, userId: string) => void;
}

export const usePostsStore = create<PostStore>((set, get) => ({
    posts: [],
    fetchPosts: async () => {
        try {
            const res = await axios.get(`${BACKEND_URL}/api/v1/post/bulk`, {
                headers: {
                    Authorization: getAuthHeaders().Authorization,
                },
            });
            set({ posts: res.data.posts });
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    },

    handleLikePost: async (postId: string) => {
        try {
            const response = await axios.post(
                `${BACKEND_URL}/api/v1/post/like/${postId}`,
                {},
                {
                    headers: {
                        Authorization: getAuthHeaders().Authorization,
                    },
                }
            );
            const posts = get().posts.map((post) => {
                if (post.id === parseInt(postId)) {
                    if (response.status === 201) {
                        post._count.likes++;
                        post.likes.push({
                            userId: getAuthHeaders().userId,
                        });
                    } else if (response.status === 200) {
                        post._count.likes--;
                        post.likes = post.likes.filter(
                            (like: LikeType) => like.userId !== getAuthHeaders().userId
                        );
                    }
                }
                return post;
            });
            set({ posts });
        } catch (error) {
            console.error("Error liking post:", error);
        }
    },
    isPostLiked: (postId: string, userId: string) => {
        const post = get().posts.find((post) => post.id === parseInt(postId));
        if (post) {
            return post.likes.some((like: LikeType) => like.userId === userId);
        }
        return false;
    },
    setIsPostLiked: (postId: string, userId: string) => {
        const post = get().posts.find((post) => post.id === parseInt(postId));
        console.log(post);
        if (post) {
            return post.likes.some((like: LikeType) => like.userId === userId);
        }
        return false;
    }
}));