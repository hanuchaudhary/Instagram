import { BACKEND_URL } from "@/config/config";
import { users } from "@/store/atoms/users";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";

export const useSearchUsers = () => {
    const [searchedUsers, setSearchedUsers] = useRecoilState(users)
    const [isLoading, setIsLoading] = useState(false);
    const [filter, setFilter] = useState("")
    useEffect(() => {
        const fetchUsers = async () => {
            setIsLoading(true);
            try {
                const res = await axios.get(`${BACKEND_URL}/user/bulk?filter=${filter}`, {
                    headers: {
                        Authorization: localStorage.getItem("token")?.split(" ")[1]
                    }
                });
                const data = res.data;
                setSearchedUsers(data);
            } catch (error) {
                console.error("Error fetching profile:", error);
            }finally{
                setIsLoading(false)
            }
        };

        fetchUsers();
    }, [filter]);
    return {setFilter , isLoading, searchedUsers}
};
