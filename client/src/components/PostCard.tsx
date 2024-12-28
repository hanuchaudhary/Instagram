import { MoreHorizontal } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import LikePost from "./LikePost";
import PostComments from "./PostComments";
import MiniProfile from "./Profile/MiniProfile";
import ReelVideoPlayer from "./Reel/ReelVideoPlayer";
import { post } from "@/types/PostTypes";
import { usePostsStore } from "@/store/PostsStore/usePostsStore";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { GradientHeartLikeIcon } from "./GradientHeartLikeIcon";
const PostCard = ({ post }: { post: post }) => {
  const { handleLikePost, isPostLiked } = usePostsStore();

  const [showHeart, setShowHeart] = useState(false);

  const handleDoubleTap = () => {
    if (!isPostLiked(post.id.toString(), post.User.id)) {
      handleLikePost(post.id.toString());
      setShowHeart(true);
      setTimeout(() => setShowHeart(false), 1500);
    }
  };

  return (
    <div>
      <Card className="rounded-none border-t-0 border-l-0 border-r-0 border-b pb-4 border-b-neutral-800 w-[350px]  shadow-sm md:w-[468px]">
        <CardHeader className="flex flex-row items-center justify-between p-3">
          <div className="flex items-center gap-3">
            <MiniProfile
              username={post.User.username}
              fullName={post.User.fullName}
              avatar={post.User.avatar}
              bio={post.User.bio}
              location={post.location}
            />
          </div>
          <button>
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </CardHeader>
        <div className="w-full border rounded-md">
          <CardContent className="p-0 relative cursor-pointer overflow-hidden h-[500px]">
            <div
              className="w-full h-full aspect-square overflow-hidden"
              onDoubleClick={handleDoubleTap}
            >
              {post.mediaType === "video" ? (
                <div className="h-full w-full">
                  <ReelVideoPlayer mediaURL={post.mediaURL} />
                </div>
              ) : (
                <img
                  src={post.mediaURL}
                  alt="Post image"
                  className="h-full w-full object-contain"
                />
              )}
            </div>
            <AnimatePresence>
              {showHeart && (
                <motion.div
                  initial={{
                    scale: 0,
                    opacity: 0,
                    rotateX: 100,
                    y: "-100%",
                    x: "-30%",
                    rotate: 45,
                  }}
                  animate={{
                    scale: 1,
                    opacity: 1,
                    rotateX: 0,
                    y: 0,
                    x: 0,
                    rotate: 0,
                    transition: { duration: 0.8, type: "spring", bounce: 0.5 },
                  }}
                  exit={{
                    scale: 0,
                    opacity: 0,
                    rotateX: -100,
                    y: "-100%",
                    rotate: 45,
                    transition: { duration: 0.5, type: "spring", bounce: 0.25 },
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 120,
                    damping: 10,
                    mass: 1,
                  }}
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                >
                  <div className="relative w-44 h-44">
                    <GradientHeartLikeIcon />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </div>
        <CardFooter className="flex flex-col gap-1 p-3">
          <div className="flex w-full">
            <div className="flex gap-2  items-center">
              <LikePost postId={post.id} />
              <PostComments postId={post.id} />
            </div>
          </div>
          <div className="flex w-full flex-col gap-1">
            <div className="text-sm font-semibold">
              {post._count.likes} likes
            </div>
            <div className="flex gap-2">
              <p className="text-sm">
                <span className="font-semibold">{post.User.username}</span>{" "}
                {post.caption}
              </p>
            </div>
            <p className="text-xs text-neutral-400">
              {new Date(post.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PostCard;
