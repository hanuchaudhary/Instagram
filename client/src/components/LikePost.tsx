import { Heart } from "lucide-react";
import axios, { AxiosError } from "axios";
import { BACKEND_URL } from "@/config/config";
import { toast } from "sonner";
import { useState } from "react";
import { usePostLikes } from "@/hooks/Posts/usePostLikes";

const LikePost = ({
  postId,
  isLiked,
}: {
  postId: number;
  isLiked: boolean;
}) => {
  const [liked, setLiked] = useState(isLiked); 
  const { fetchLikeCount } = usePostLikes({ postId });
  const handleLikePost = async () => {
    try {
      if (liked == true) {
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
        fetchLikeCount();
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
        fetchLikeCount();
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
  usePostLikes({ postId });

  return (
    <div>
      <button onClick={handleLikePost}>
        <Heart
          className={`${
            liked ? "text-rose-600 fill-rose-600" : ""
          } h-6 w-6`}
        />
      </button>
    </div>
  );
};

export default LikePost;
