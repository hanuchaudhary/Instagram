import api from "@/config/axios";
import { useState } from "react"

export const useFetchPostsHook = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [page, setPage] = useState(1);
    const [posts, setPosts] = useState<any[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const fetchPosts = async () => {
        setLoading(true);
        try {
            const response = await api.get("/post/bulk", {
                params: { page, limit: 5 },
            });

            if (response.data.posts.length > 0) {
                setPosts((prevPosts) => [...prevPosts, ...response.data.posts]);
                setPage((prevPage) => prevPage + 1);
            } else {
                setHasMore(false);
            }
        } catch (error) {
            setError(true);
            console.error("Error fetching posts:", error);
        } finally {
            setLoading(false);
        }
    };
    return { loading, posts, hasMore, fetchPosts, page , error};
}