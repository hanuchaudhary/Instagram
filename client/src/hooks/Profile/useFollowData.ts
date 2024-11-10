import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { BACKEND_URL } from "@/config/config";
import { useRecoilValue } from "recoil";
import { authTokenState } from "@/store/atoms/AuthenticatedToken";

interface FollowData {
   user: {
    id: string,
    avatar: string,
    username: string
   }
}

interface FollowResponse {
    success: boolean,
    followers: FollowData[],
    following: FollowData[]
}

export const useFollowData = () => {
    const token = useRecoilValue(authTokenState);
    const [followers, setFollowers] = useState<FollowData[]>([]);
    const [following, setFollowing] = useState<FollowData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchFollowData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get<FollowResponse>(`${BACKEND_URL}/user/bulk-followers`, {
                headers: {
                    Authorization: `${token.split(" ")[1]}`
                }
            });
            setFollowers(response.data.followers);
            setFollowing(response.data.following);
        } catch (err) {
            setError("Failed to fetch follow data");
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchFollowData();
    }, [fetchFollowData]);

    return { followers, following, loading, error, refetch: fetchFollowData };
};