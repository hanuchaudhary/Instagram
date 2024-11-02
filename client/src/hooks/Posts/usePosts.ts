import { BACKEND_URL } from "@/config/config";
import { postsState } from "@/store/atoms/posts";
import axios from "axios";
import { useEffect } from "react";
import { useSetRecoilState } from "recoil";

export const usePosts = () => {
    const setPostState = useSetRecoilState(postsState);
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get(`${BACKEND_URL}/post/bulk`, {
                    headers: {
                        Authorization: localStorage.getItem("token")?.split(" ")[1]
                    }
                });
                const postsData = res.data;
                setPostState(postsData);
            } catch (error) {
                console.error("Error fetching profile:", error);
            }
        };

        fetchProfile();
    }, [setPostState]);
};
