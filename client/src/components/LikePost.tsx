import { Heart } from "lucide-react";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { BACKEND_URL } from "@/config/config";
import { toast } from "sonner";

const LikePost = ({postId}:{postId:number}) => {
    const [isLoading,setIsLoading] = useState(false);
    const [isLiked,setIsLiked] = useState(false);
    
    const handleLikePost = async () => {
       try {
        setIsLoading(true);
        await axios.post(`${BACKEND_URL}/feature/like/${postId}`,{},{
            headers: {
                Authorization: localStorage.getItem("token")?.split(" ")[1],
            },
        });
        setIsLiked(true);
       } catch (error) {
        if(error instanceof AxiosError){    
            toast.error(error.response?.data.message);
        }else{
            toast.error("Error while liking post");
        }
       } finally {
        setIsLoading(false);
       }
    }

  return (
    <div>
      <button disabled={isLoading} onClick={handleLikePost}>
        <Heart className={`${isLiked ? "text-rose-600 fill-rose-600" : ""} h-6 w-6`} />
      </button>
    </div>
  );
};

export default LikePost;
