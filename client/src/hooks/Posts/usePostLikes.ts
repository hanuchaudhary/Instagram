import { BACKEND_URL } from "@/config/config";
import { likesCountAtom } from "@/store/atoms/LikesCoutAtom";
import axios from "axios";
import { useEffect } from "react";
import { useSetRecoilState } from "recoil";



export const usePostLikes = ({ postId }: { postId: number }) => {
    const setLikesCount = useSetRecoilState(likesCountAtom);
    const fetchLikeCount = async () => {
        const res = await axios.get(`${BACKEND_URL}/post/postLikes/${postId}`, {
            headers: {
                Authorization: localStorage.getItem("token")?.split(" ")[1],
            },
        })
        setLikesCount(res.data.likesCount);
    }
    useEffect(() => {
        fetchLikeCount();
    }, [])

    return { fetchLikeCount};
}
