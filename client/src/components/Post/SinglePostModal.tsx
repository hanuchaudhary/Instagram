import { motion } from "framer-motion";
import { UserCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import CommentTile from "../Tiles/CommentTile";
import { ScrollArea } from "../ui/scroll-area";
import CommentInput from "./CommentInput";
import LikePost from "./LikePost";
import { usePostsStore } from "@/store/PostsStore/usePostsStore";
import { usePostCommentsStore } from "@/store/PostsStore/usePostComments";
import { useEffect } from "react";
import PostShareDialog from "../Reel/PostShareDialog";

export default function SinglePostModal() {
  const { fetchSinglePost, isSinglePostLoading, singlePost, selectedPostId } =
    usePostsStore();
  const { comments, fetchComments } = usePostCommentsStore();

  useEffect(() => {
    fetchComments();
  }, [selectedPostId, fetchComments]);

  useEffect(() => {
    if (!selectedPostId) return;
    fetchSinglePost(selectedPostId);
  }, [fetchSinglePost, selectedPostId]);

  if (isSinglePostLoading || !singlePost) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary-foreground/75">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <motion.div
      className="w-full rounded-lg max-w-4xl"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
    >
      <div className="flex gap-2 flex-col md:flex-row h-[90vh] md:h-[80vh]">
        <div className="flex-1 bg-transparent flex items-center justify-center relative ">
          <div className="absolute inset-0 z-0">
            <div
              className="w-full h-full blur-3xl opacity-50"
              style={{
                background: singlePost.mediaType
                  ? `url(${singlePost.mediaType ? singlePost.mediaURL : ""})`
                  : "radial-gradient(circle, rgba(131,58,180,1) 0%, rgba(253,29,29,1) 50%, rgba(252,176,69,1) 100%)",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          </div>
          <div className="relative aspect-[9/16] rounded-2xl z-10 w-full  h-full flex items-center justify-center">
            {singlePost?.mediaType === "video" ? (
              <video
                src={singlePost.mediaURL}
                className="w-full h-full object-contain"
                controls
                autoPlay={false}
              />
            ) : (
              <img
                src={singlePost.mediaURL}
                alt={singlePost.caption}
                className="w-full h-full object-contain"
              />
            )}
          </div>
        </div>
        <div className="flex-1 rounded-xl flex flex-col w-full md:max-w-[400px] bg-background z-10 shadow-xl">
          <div className="flex items-center p-4 border-b">
            <Avatar className="h-10 w-10 mr-2">
              <AvatarImage
                className="object-cover"
                src={singlePost.User?.avatar}
                alt={singlePost.User?.fullName}
              />
              <AvatarFallback className="text-2xl uppercase font-bold">
                <UserCircle className="fill-neutral-400 h-16 w-16 md:h-20 md:w-20 text-neutral-400" />
              </AvatarFallback>
            </Avatar>
            <span className="font-semibold">{singlePost.User?.username}</span>
          </div>
          <ScrollArea className="flex-1 p-4">
            <div className="flex flex-col gap-1">
              {comments.length > 0 ? (
                comments?.map((comment) => (
                  <CommentTile key={comment.id} {...comment} />
                ))
              ) : (
                <div className="flex items-center flex-col justify-center h-full">
                  <h1 className="text-neutral-500">No comments yet!</h1>
                  <p className="text-xs text-muted-foreground">
                    Be the first to comment and start the conversation!
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
          <div className="p-4 border-t">
            <div className="flex justify-between mb-1">
              <div className="flex space-x-4">
                <div>
                  <LikePost postId={singlePost.id!} />
                </div>
                <div>
                  <PostShareDialog postURL={singlePost.mediaURL as string} />
                </div>
              </div>
            </div>
            <p className="">
              <span className="font-semibold mr-2">
                {singlePost.User?.username}
              </span>
              {singlePost.caption}
            </p>
            <p className="font-semibold text-sm text-neutral-400">
              {singlePost._count?.likes} likes
            </p>
          </div>
          <CommentInput />
        </div>
      </div>
    </motion.div>
  );
}
