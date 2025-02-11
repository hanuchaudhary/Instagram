import { Heart } from "lucide-react";
import { usePostsStore } from "@/store/PostsStore/usePostsStore";
import { motion } from "framer-motion";
const LikePost = ({ postId }: { postId: number }) => {
  const { handleLikePost, isPostLiked } = usePostsStore();
  const handleLikeOnClick = () => {
    handleLikePost(postId);
  };
  return (
    <div>
      <motion.button whileTap={{ scale: 1.1 }} onClick={handleLikeOnClick}>
        <Heart
          className={`${
            isPostLiked(postId) ? "text-rose-600 fill-rose-600" : ""
          } h-7 w-7 transition-colors`}
        />
      </motion.button>
    </div>
  );
};

export default LikePost;
