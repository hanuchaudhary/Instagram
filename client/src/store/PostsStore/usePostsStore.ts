import { BACKEND_URL } from "@/config/config";
import axios from "axios";
import { create } from "zustand";
import { getAuthHeaders } from "../AuthHeader/getAuthHeaders";
import { LikeType, PostType } from "@/types/TypeInterfaces";

interface PostStore {
    isPostLoading: boolean;
    posts: any[];
    fetchPosts: () => void;

    error: boolean;
    handleLikePost: (postId: string) => void;
    isPostLiked: (postId: string, userId: string) => boolean;
    setIsPostLiked: (postId: string, userId: string) => void;

    isSinglePostLoading: boolean;
    singlePost: PostType | null;
    fetchSinglePost: (postId: number) => void;
}

const { Authorization, userId } = getAuthHeaders()

export const usePostsStore = create<PostStore>((set, get) => ({
    error: false,
    isPostLoading: true,
    posts: [],
    singlePost: null,
    fetchPosts: async () => {
        try {
            const res = await axios.get(`${BACKEND_URL}/api/v1/post/bulk`, {
                headers: {
                    Authorization: Authorization,
                },
            });
            set({ posts: res.data.posts, isPostLoading: false });
        } catch (error) {
            set({ error: true, isPostLoading: false });
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
                        Authorization: Authorization,
                    },
                }
            );
            const posts = get().posts.map((post) => {
                if (post.id === parseInt(postId)) {
                    if (response.status === 201) {
                        post._count.likes++;
                        post.likes.push({
                            userId: userId,
                        });
                    } else if (response.status === 200) {
                        post._count.likes--;
                        post.likes = post.likes.filter(
                            (like: LikeType) => like.userId !== userId
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
        if (post) {
            return post.likes.some((like: LikeType) => like.userId === userId);
        }
        return false;
    },
    isSinglePostLoading: true,
    fetchSinglePost: async (postId: number) => {
        try {
            if (postId !== null) {
                const res = await axios.get(`${BACKEND_URL}/api/v1/user/post/${postId}`, {
                    headers: {
                        Authorization: Authorization,
                    },
                });
                set({ singlePost: res.data.post, isSinglePostLoading: false });
            }
        } catch (error) {
            set({ error: true, isSinglePostLoading: false });
            console.error("Error fetching single post:", error);
        }
    },
}));