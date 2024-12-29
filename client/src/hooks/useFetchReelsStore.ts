import api from "@/config/axios";
import { Reel } from "@/store/ReelsStore/useReelsStore";
import { useState } from "react";

const useFetchReelsStore = () => {
    const [reels, setReels] = useState<Reel[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);

    const fetchReels = async () => {
        setIsLoading(true);
        try {
            const response = await api.get(`/feature/reels`, {
                params: { page, limit: 2 }
            });
            const data = response.data;
            console.log("data", data);
            

            if (data.reels.length > 0) {
                setReels((prevReels: Reel[]) => [...prevReels, ...data.reels]);
                setPage((page) => page + 1);
            } else {
                setHasMore(false);
            }
        } catch (err) {
            setError("Failed to load reels");
        } finally {
            setIsLoading(false);
        }
    };

    return {
        reels,
        fetchReels,
        isLoading,
        error,
        hasMore,
    };
};

export { useFetchReelsStore };
