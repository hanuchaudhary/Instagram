import { BACKEND_URL } from "@/config/config";
import { currentProfileState, loggedUserId } from "@/store/atoms/profile";
import axios from "axios";
import { useEffect } from "react";
import { useSetRecoilState } from "recoil";

export const useProfile = () => {
    const setCurrentUserProfile = useSetRecoilState(currentProfileState);
    const setLoggedUserId = useSetRecoilState(loggedUserId);
    const fetchProfile = async () => {
        try {
            const res = await axios.get(`${BACKEND_URL}/user/me`, {
                headers: {
                    Authorization: localStorage.getItem("token")?.split(" ")[1]
                }
            });
            const profileData = res.data;
            const user = {
                id: profileData.user.id,
                avatar: profileData.user.avatar,
                username: profileData.user.username,
                fullName: profileData.user.fullName
            };
            localStorage.setItem("user", JSON.stringify(user));
            
            setCurrentUserProfile(profileData.user);
            setLoggedUserId(profileData.user.id);
        } catch (error) {
            console.error("Error fetching profile:", error);
        }
    };
    useEffect(() => {
        fetchProfile();
    }, [setCurrentUserProfile]);
    return {fetchProfile};
};
