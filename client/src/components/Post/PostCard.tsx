import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import LikePost from "./LikePost";
import PostComments from "./PostComments";
import MiniProfile from "../Profile/MiniProfile";
import ReelVideoPlayer from "../Reel/ReelVideoPlayer";
import { usePostsStore } from "@/store/PostsStore/usePostsStore";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { GradientHeartLikeIcon } from "../GradientHeartLikeIcon";
import { ReportButton } from "../ReportButton";
import PostShareDialog from "./PostShareDialog";
import { usePostCommentsStore } from "@/store/PostsStore/usePostComments";
import { Post } from "@/types/TypeInterfaces";
const PostCard = (post: Post) => {
  const { handleLikePost, isPostLiked } = usePostsStore();
  const { setPostId } = usePostCommentsStore();
  const [showHeart, setShowHeart] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleDoubleTap = () => {
    if (!isPostLiked(post.id)) {
      handleLikePost(post.id);
      setShowHeart(true);
      setTimeout(() => setShowHeart(false), 1500);
    }
  };

  setTimeout(() => {
    setCopied(false);
  }, 3000);

  const handleCopyPost = () => {
    navigator.clipboard.writeText(`${window.location.origin}/post/${post.id}`);
    setCopied(true);
  };

  return (
    <div>
      <AnimatePresence>
        {copied && (
          <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 z-[999999999999] left-0 border-t border-t-neutral-700 flex items-center justify-center bg-secondary w-full text-neutral-400 text-sm p-2">
            Link copied to clipboard!
          </motion.div>
        )}
      </AnimatePresence>
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
          <ReportButton
            reportTargetTitle="Report Post"
            reportType="POST"
            reportedId=""
            targetId=""
            postId={post.id!}
          />
        </CardHeader>
        <div className="w-full border rounded-md">
          <CardContent className="p-0 relative cursor-pointer overflow-hidden">
            <div
              className="w-full md:h-[600px] h-[500px] overflow-hidden"
              onDoubleClick={handleDoubleTap}
            >
              {post.mediaType === "video" ? (
                <div className="w-full h-full flex items-center justify-center">
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
                  className="absolute z-[99999] inset-0 flex items-center justify-center pointer-events-none"
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
            <div className="flex gap-3 items-center">
              <LikePost postId={post.id} />
              <div onClick={() => setPostId(post.id!)}>
                <PostComments />
              </div>
              <PostShareDialog
                handleCopy={handleCopyPost}
                postId={post.id}
                postURL={post.mediaURL}
              />
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
