import { Heart } from "lucide-react";
import axios, { AxiosError } from "axios";
import { BACKEND_URL } from "@/config/config";
import { toast } from "sonner";
import { usePosts } from "@/hooks/Posts/usePosts";
import { useState } from "react";

const LikePost = ({
  postId,
  isLiked,
}: {
  postId: number;
  isLiked: boolean;
}) => {
  const [liked, setLiked] = useState(isLiked);
  const { fetchPosts } = usePosts();  
  const handleLikePost = async () => {
    try {
      if (liked) {
        await axios.post(
          `${BACKEND_URL}/feature/dislike/${postId}`,
          {},
          {
            headers: {
              Authorization: localStorage.getItem("token")?.split(" ")[1],
            },
          }
        );
        setLiked(false);
        fetchPosts();
        toast.success("Post disliked successfully");
      } else {
        await axios.post(
          `${BACKEND_URL}/feature/like/${postId}`,
          {},
          {
            headers: {
              Authorization: localStorage.getItem("token")?.split(" ")[1],
            },
          }
        );
        setLiked(true);
        fetchPosts();
        toast.success("Post liked successfully");
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      } else {
        toast.error("Error while liking post");
      }
    }
  };

  return (
    <div>
      <button onClick={handleLikePost}>
        <Heart
          className={`${liked ? "text-rose-600 fill-rose-600" : "fill-white"} h-6 w-6`}
        />
      </button>
    </div>
  );
};

export default LikePost;
