import { Button } from "./ui/button";
import { useFollowDataStore } from "@/store/UserStore/useFollowStore";
import { motion } from "framer-motion";

interface followUserProps {
  followText?: string;
  userId: string;
  unFollowText?: string;
}

const FollowUser = ({
  userId,
  followText = "Follow",
  unFollowText = "Unfollow",
}: followUserProps) => {
  const { following, handleFollow, handleUnfollow } = useFollowDataStore();
  const isFollowing = following.some(({ user }) => user.id === userId);

  return (
    <motion.div whileTap={{ scale: 0.9 }}>
      <Button
        onClick={
          isFollowing
            ? () => handleUnfollow(userId)
            : () => handleFollow(userId)
        }
        size="sm"
        variant={"blue"}
      >
        {isFollowing ? unFollowText : followText}
      </Button>
    </motion.div>
  );
};

export default FollowUser;
