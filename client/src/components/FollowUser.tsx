import { Button } from "./ui/button";
import axios from "axios";
import { BACKEND_URL } from "@/config/config";
import { toast } from "sonner";
import { useState } from "react";
import { useSuggestedUsers } from "@/hooks/Users/useSuggestedUsers";
import { usePosts } from "@/hooks/Posts/usePosts";

const FollowUser = ({ userId, isFollowing }: { userId: string, isFollowing: boolean }) => {
  const [following,setFollowing] = useState(isFollowing)
  const { fetchPosts } = usePosts();
  const { fetchSuggestedUsers } = useSuggestedUsers();
  const handleFollow = async () => {
    try {
      if(isFollowing){
        const res = await axios.post(
            `${BACKEND_URL}/feature/unfollow/${userId}`,
            {},
            {
                headers: {
                    Authorization: localStorage.getItem("token")?.split(" ")[1]
                }
            }
        )
        if(res.data.success){
            toast.success(res.data.message)
        }else{
            toast.error(res.data.message)
        }
        fetchPosts();
        fetchSuggestedUsers();
        setFollowing(false)
      }else{
        const res = await axios.post(
            `${BACKEND_URL}/feature/follow/${userId}`,
            {},
            {
                headers: {
                    Authorization: localStorage.getItem("token")?.split(" ")[1]
                }
            }
        )
        if(res.data.success){
            toast.success(res.data.message)
        }else{
            toast.error(res.data.message)
        }
        fetchPosts();
        fetchSuggestedUsers();
        setFollowing(true)
      }
    } catch (error) {
      toast.error("Error following user");
    }
  };
  return (
    <div>
      <Button onClick={handleFollow} size="sm" variant={"blue"}>
        {following ? "Unfollow" : "Follow"}
      </Button>
    </div>
  );
};

export default FollowUser;
