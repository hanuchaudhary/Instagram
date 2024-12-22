import { Heart } from "lucide-react";
import { usePostsStore } from "@/store/PostsStore/usePostsStore";
import { useLoggedUserId } from "@/store/UserStore/useProfileStore";
import { getAuthHeaders } from "@/store/AuthHeader/getAuthHeaders";

const LikePost = ({ postId }: { postId: number }) => {
  const { handleLikePost, isPostLiked, setIsPostLiked } =
    usePostsStore();

  const handleLikeOnClick = () => {
    handleLikePost(postId.toString());
    setIsPostLiked(postId.toString(), getAuthHeaders().userId);
  };

  return (
    <div>
      <button onClick={handleLikeOnClick}>
        <Heart
          className={`${
            isPostLiked(postId.toString(), useLoggedUserId())
              ? "text-rose-600 fill-rose-600"
              : ""
          } h-6 w-6`}
        />
      </button>
    </div>
  );
};

export default LikePost;
