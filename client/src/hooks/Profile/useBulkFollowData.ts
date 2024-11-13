import { BACKEND_URL } from "@/config/config";
import { followDatasState } from "@/store/atoms/FollowDataAtom";
import axios from "axios";
import { useEffect } from "react";
import { useRecoilState } from "recoil";

export const useProfile = () => {
    const [followers, setFollowers] = useRecoilState(followDatasState)
    const [following, setFollowing] = useRecoilState(followDatasState)
    const fetchFollowData = async () => {
        try {
            const res = await axios.get(`${BACKEND_URL}/user/bulk-followers`, {
                headers: {
                    Authorization: localStorage.getItem("token")?.split(" ")[1]
                }
            });
            setFollowers(res.data.followers);
            setFollowing(res.data.following);
        } catch (error) {
            console.error("Error fetching profile:", error);
        }
    };
    useEffect(() => {
        fetchFollowData();
    }, []);
    return { followers, following };
};
