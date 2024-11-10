import { Heart } from "lucide-react";
import axios, { AxiosError } from "axios";
import { BACKEND_URL } from "@/config/config";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { usePosts } from "@/hooks/Posts/usePosts";

const LikePost = ({ postId }: { postId: number }) => {
  const [liked, setLiked] = useState(false);
  const { fetchPosts } = usePosts();

  useEffect(() => {
    const checkIfLiked = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/post/postLikes/${postId}`, {
          headers: {
            Authorization: localStorage.getItem("token")?.split(" ")[1],
          },
        });
        setLiked(!!res.data.isLiked);
      } catch (error) {
        console.error("Error checking like status:", error);
      }
    };
    checkIfLiked();
  }, [postId]);

  const handleLikePost = async () => {
    try {
      await axios.post(
        `${BACKEND_URL}/feature/like-dislike/${postId}`,
        {},
        {
          headers: {
            Authorization: localStorage.getItem("token")?.split(" ")[1],
          },
        }
      );

      setLiked(!liked);
      fetchPosts();

      toast.success(
        liked ? "Post disliked successfully" : "Post liked successfully",
        {
          dismissible: true,
          duration: 1000,
        }
      );
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message, {
          dismissible: true,
          duration: 1000,
        });
      } else {
        toast.error("Error while liking post", {
          dismissible: true,
          duration: 1000,
        });
      }
    }
  };

  return (
    <div>
      <button onClick={handleLikePost}>
        <Heart
          className={`${liked ? "text-rose-600 fill-rose-600" : ""} h-6 w-6`}
        />
      </button>
    </div>
  );
};

export default LikePost;
