import { BACKEND_URL } from "@/config/config";
import { suggestedUsersAtom } from "@/store/atoms/SuggestedUsers";
import axios from "axios";
import { useEffect} from "react";
import { useSetRecoilState } from "recoil";

export const useSuggestedUsers = () => {
    const setSuggestedUsers = useSetRecoilState(suggestedUsersAtom)
    useEffect(() => {
        const fetchSuggestedUsers = async () => {
            try {
                const res = await axios.get(`${BACKEND_URL}/user/suggestions`, {
                    headers: {
                        Authorization: localStorage.getItem("token")?.split(" ")[1]
                    }
                });
                const data = res.data;
                setSuggestedUsers(data);
            } catch (error) {
                console.error("Error fetching suggested users:", error);
            }
        };

        fetchSuggestedUsers();
    }, [setSuggestedUsers]);
};
