import { BACKEND_URL } from "@/config/config";
import { currentProfileState } from "@/store/atoms/profile";
import axios from "axios";
import { useEffect } from "react";
import { useSetRecoilState } from "recoil";

export const useProfile = () => {
    const setCurrentUserProfile = useSetRecoilState(currentProfileState);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get(`${BACKEND_URL}/user/me`, {
                    headers: {
                        Authorization: localStorage.getItem("token")?.split(" ")[1]
                    }
                });
                const profileData = res.data;
                console.log(profileData);
                setCurrentUserProfile(profileData.user);
            } catch (error) {
                console.error("Error fetching profile:", error);
            }
        };

        fetchProfile();
    }, [setCurrentUserProfile]);
};
