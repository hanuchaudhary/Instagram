import { create } from "zustand";
import { LikeType, PostType } from "@/types/TypeInterfaces";
import api from "@/config/axios";
import { useUserStore } from "../AuthHeader/getAuthHeaders";

interface PostStore {
    isPostLoading: boolean;
    posts: any[];
    fetchPosts: () => void;

    error: boolean;
    handleLikePost: (postId: string) => void;
    isPostLiked: (postId: string, userId: string) => boolean;
    setIsPostLiked: (postId: string, userId: string) => void;

    isSinglePostLoading: boolean;
    singlePost: PostType | any;
    fetchSinglePost: (postId: number) => void;
}

export const usePostsStore = create<PostStore>((set, get) => ({
    error: false,
    isPostLoading: true,
    posts: [],
    singlePost: null,
    fetchPosts: async () => {
        try {
            const res = await api.get(`/post/bulk`);
            set({ posts: res.data.posts, isPostLoading: false });
        } catch (error) {
            set({ error: true, isPostLoading: false });
            console.error("Error fetching posts:", error);
        }
    },

    handleLikePost: async (postId: string) => {
        const { stateUser } = useUserStore.getState();
        const userId = stateUser?.id;
        try {
            const response = await api.post(`/post/like/${postId}`);

            if (get().singlePost && get().singlePost?.id === parseInt(postId)) {
                const singlePost = { ...get().singlePost };
                if (response.status === 201) {
                    singlePost._count && singlePost._count.likes++;
                } else if (response.status === 200) {
                    singlePost._count && singlePost._count.likes--;
                    singlePost.likes = singlePost?.likes?.filter(
                        (like: LikeType) => like.userId !== userId
                    );
                }
                set({ singlePost });
            }

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
                const res = await api.get(`/user/post/${postId}`);
                set({ singlePost: res.data.post, isSinglePostLoading: false });
            }
        } catch (error) {
            set({ error: true, isSinglePostLoading: false });
            console.error("Error fetching single post:", error);
        }
    },
}));