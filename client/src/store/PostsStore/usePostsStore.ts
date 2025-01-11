import { create } from "zustand";
import {  Post, PostType } from "@/types/TypeInterfaces";
import api from "@/config/axios";
import { useAuthStore } from "../AuthStore/useAuthStore";
import { toast } from "sonner";

interface PostStore {
    hasMore: boolean;
    page: number;
    isPostLoading: boolean;
    posts: Post[];
    fetchPosts: () => void;

    error: boolean;
    handleLikePost: (postId: number) => void;
    isPostLiked: (postId: number) => boolean;

    isSinglePostLoading: boolean;
    singlePost: PostType | null;
    selectedPostId: number | null;
    setSelectedPostId: (postId: number | null) => void;
    fetchSinglePost: (postId: number) => void;

    createPost: (formData: FormData, navigate: any) => void;
    isCreatingPost: boolean;
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

    handleLikePost: async (postId) => {
        const { authUser } = useAuthStore.getState();
        if (!authUser) return;

        try {
            const response = await api.post(`/post/like/${postId}`);

            const updatePostLikes = (post: Post) => {
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
                        createdAt: new Date().toString(),
                    });
                } else if (response.status === 200) {
                    if (!post._count || !post.likes) {
                        return
                    }

                    post._count.likes--;
                    post.likes = post.likes.filter(
                        (like) => like.userId !== authUser.id
                    );

                }
            };

            if (get().singlePost && get().singlePost?.id === postId) {
                const singlePost = { ...get().singlePost };
                updatePostLikes(singlePost as any);
                set({ singlePost: singlePost as any });
            }

            const posts = get().posts.map((post) => {
                if (post.id === postId) {
                    updatePostLikes(post);
                }
                return post;
            });

            set({ posts });
        } catch (error) {
            console.error("Error liking post:", error);
        }
    },

    isPostLiked: (postId) => {
        const { authUser } = useAuthStore.getState();
        if (!authUser) return false;

        const post = get().posts.find((post) => post.id === postId);
        return post ? post.likes!.some((like) => like.userId === authUser.id) : false;
    },

    selectedPostId: null,
    setSelectedPostId: (postId) => {
        set({ selectedPostId: postId });
    },
    fetchSinglePost: async (postId: number) => {
        const { selectedPostId } = get();
        try {
            set({ isSinglePostLoading: true });
            const response = await api.get(`/feature/post/${postId || selectedPostId}`);
            set({ singlePost: response.data.post });
        } catch (error) {
            console.error("Error fetching single post:", error);
            set({ error: true });
        } finally {
            set({ isSinglePostLoading: false });
        }
    },

    isCreatingPost: false,
    createPost: async (formData: FormData, navigate: any) => {
        try {
            set({ isCreatingPost: true });
            const response = await api.post("/post/create", formData);
            const data = response.data;
            if (response.status === 201) {
                set({
                    posts: [{
                        id: data.post.id, caption: data.post.caption, createdAt: data.post.createdAt, _count: {
                            comments: 0, likes: 0
                        }, likes: [], mediaURL: data.post.mediaURL, mediaType: data.post.mediaType, User: data.post.User, location: data.post.location, userId: data.post.userId
                    }, ...get().posts]
                });
            }
            navigate('/', { replace: true });
            toast.success("Post created successfully");

        } catch (error) {
            toast.error("Error creating post");
            console.error("Error creating post:", error);
        } finally {
            set({ isCreatingPost: false });
        }
    },
}));
