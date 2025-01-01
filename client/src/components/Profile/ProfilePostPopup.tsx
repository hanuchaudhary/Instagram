import { AnimatePresence, motion } from "framer-motion";
import { Send, UserCircle, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import CommentTile from "../Tiles/CommentTile";
import { usePostsStore } from "@/store/PostsStore/usePostsStore";
import { useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import CommentInput from "../Post/CommentInput";
import { usePostCommentsStore } from "@/store/PostsStore/usePostComments";
import LikePost from "../LikePost";

export default function ProfilePostPopup({
  isOpen,
  handleClose,
}: {
  isOpen: boolean;
  handleClose: () => void;
}) {
  const { fetchSinglePost, isSinglePostLoading, singlePost, selectedPostId } =
    usePostsStore();
  const { comments, fetchComments } = usePostCommentsStore();

  useEffect(() => {
    if (isOpen) {
      fetchComments(selectedPostId!);
    }
  }, [isOpen, selectedPostId]);

  useEffect(() => {
    if (!selectedPostId) return;
    fetchSinglePost(selectedPostId!);
  }, [fetchSinglePost, selectedPostId]);

  return (
    <AnimatePresence>
      {isOpen &&
        singlePost &&
        (isSinglePostLoading ? (
          <div>Loading...</div>
        ) : (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative w-full max-w-4xl bg-background rounded-lg shadow-lg overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <button
                onClick={handleClose}
                className="absolute top-2 right-2 z-10 p-2 rounded-full bg-background/80 text-foreground hover:bg-background/60 transition-colors"
                aria-label="Close"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="flex flex-col md:flex-row h-[80vh] md:h-[70vh]">
                <div className="flex-1 bg-black flex items-center justify-center">
                  {singlePost.mediaType === "video" ? (
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
                <div className="flex-1 flex flex-col max-w-full md:max-w-[400px] bg-background">
                  <div className="flex items-center p-4 border-b">
                    <Avatar className="h-10 w-10 mr-2">
                      <AvatarImage
                        className="object-cover"
                        src={singlePost?.User?.avatar}
                        alt={singlePost?.User?.fullName}
                      />
                      <AvatarFallback className="text-2xl uppercase font-bold">
                        <UserCircle className="fill-neutral-400 h-16 w-16 md:h-20 md:w-20 text-neutral-400" />
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-semibold">
                      {singlePost.User?.username}
                    </span>
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
                          {/* <Heart className="h-6 w-6" /> */}
                          <LikePost postId={singlePost.id!} />
                        </div>
                        <div>
                          <Send className="h-6 w-6" />
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

                  <CommentInput postId={selectedPostId!} />
                </div>
              </div>
            </motion.div>
          </motion.div>
        ))}
    </AnimatePresence>
  );
}
