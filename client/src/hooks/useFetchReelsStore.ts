import { Reel } from "@/store/ReelsStore/useReelsStore";
import { useState } from "react";

const useFetchReelsStore = () => {
    const [reels, setReels] = useState<Reel[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [hasMore, setHasMore] = useState(true);
    const [skip, setSkip] = useState(0);

    const fetchReels = async () => {
        if (isLoading || !hasMore) return;

        setIsLoading(true);
        try {
            const response = await fetch(`/api/reels?skip=${skip}&take=10`);
            const data = await response.json();

            if (data.success) {
                setReels((prevReels: Reel[]) => [...prevReels, ...data.reels]);
                setHasMore(data.hasMore); // Determines if there are more reels to fetch
                setSkip((prevSkip) => prevSkip + 10); // Increment the skip value for pagination
            } else {
                setError("Failed to load reels");
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
