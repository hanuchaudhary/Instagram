import { create } from "zustand";
import { LikeType, PostType } from "@/types/TypeInterfaces";
import api from "@/config/axios";
import { useAuthStore } from "../AuthStore/useAuthStore";

interface PostStore {
    hasMore: boolean;
    page: number;
    isPostLoading: boolean;
    posts: PostType[];
    fetchPosts: () => void;

    error: boolean;
    handleLikePost: (postId: string) => void;
    isPostLiked: (postId: string) => boolean;

    isSinglePostLoading: boolean;
    singlePost: PostType | null;
    fetchSinglePost: (postId: number) => void;
}

export const usePostsStore = create<PostStore>((set, get) => ({
    page: 1,
    hasMore: true,
    error: false,
    isPostLoading: false,
    posts: [],
    singlePost: null,
    isSinglePostLoading: false,

    fetchPosts: async () => {
        try {
            const { page, posts } = get();
            if (!get().hasMore) return;
            set({ isPostLoading: true });

            const response = await api.get(`/post/bulk`, {
                params: { page, limit: 5 },
            });

            const newPosts = response.data.posts;

            if (newPosts.length > 0) {
                set({ posts: [...posts, ...newPosts], page: page + 1 });
            } else {
                set({ hasMore: false });
            }
        } catch (error) {
            console.error("Error fetching posts:", error);
            set({ error: true });
        } finally {
            set({ isPostLoading: false });
        }
    },

    handleLikePost: async (postId: string) => {
        const { authUser } = useAuthStore.getState();
        if (!authUser) return;

        try {
            const response = await api.post(`/post/like/${postId}`);

            const updatePostLikes = (post: PostType) => {
                if (response.status === 201) {
                    if (!post._count || !post.likes) {
                        return
                    }
                    post._count.likes++;
                    post.likes.push({
                        id: Math.random(),
                        userId: authUser.id,
                        isLiked: true,
                        postId: post.id!,
                        createdAt: new Date()
                    });
                } else if (response.status === 200) {
                    if (!post._count || !post.likes) {
                        return
                    }
                    post._count.likes--;
                    post.likes = post.likes.filter(
                        (like: LikeType) => like.userId !== authUser.id
                    );
                }
            };

            if (get().singlePost && get().singlePost?.id === parseInt(postId)) {
                const singlePost = { ...get().singlePost };
                updatePostLikes(singlePost as any);
                set({ singlePost: singlePost as any });
            }

            const posts = get().posts.map((post) => {
                if (post.id === parseInt(postId)) {
                    updatePostLikes(post);
                }
                return post;
            });

            set({ posts });
        } catch (error) {
            console.error("Error liking post:", error);
        }
    },

    isPostLiked: (postId: string) => {
        const { authUser } = useAuthStore.getState();
        if (!authUser) return false;

        const post = get().posts.find((post) => post.id === parseInt(postId));
        return post ? post.likes!.some((like: LikeType) => like.userId === authUser.id) : false;
    },

    fetchSinglePost: async (postId: number) => {
        try {
            set({ isSinglePostLoading: true });

            const response = await api.get(`/user/post/${postId}`);
            set({ singlePost: response.data.post, isSinglePostLoading: false });
        } catch (error) {
            console.error("Error fetching single post:", error);
            set({ error: true, isSinglePostLoading: false });
        }
    },
}));
