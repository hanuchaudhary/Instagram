import { AnimatePresence, motion } from "framer-motion";
import { Heart, MessageCircle, Send, UserCircle, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import CommentTile from "../Tiles/CommentTile";
import { Button } from "../ui/button";
import { usePostsStore } from "@/store/PostsStore/usePostsStore";
import { useEffect } from "react";

export default function ProfilePostPopup({
  isOpen,
  postId,
  handleClose,
}: {
  isOpen: boolean;
  postId: number;
  handleClose: () => void;
}) {
  const { fetchSinglePost, isSinglePostLoading, singlePost } = usePostsStore();
  useEffect(() => {
    fetchSinglePost(postId);
  }, [fetchSinglePost, postId]);

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
                {/* Media Section */}
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

                  <div className="flex-1 overflow-y-auto p-4">
                    <div className="flex flex-col gap-1">
                      {singlePost.comments?.map((comment) => (
                        <CommentTile key={comment.id} {...comment} />
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-4 border-t">
                    <div className="flex justify-between mb-2">
                      <div className="flex space-x-4">
                        <Button variant="ghost" size="icon">
                          <Heart className="h-6 w-6" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <MessageCircle className="h-6 w-6" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Send className="h-6 w-6" />
                        </Button>
                      </div>
                    </div>
                    <p className="mb-4">
                      <span className="font-semibold mr-2">
                        {singlePost.User?.username}
                      </span>
                      {singlePost.caption}
                    </p>
                    <p className="font-semibold">797 likes</p>
                  </div>

                  {/* Comment Input */}
                  {/* <form onSubmit={handleCommentSubmit} className="p-4 border-t">
                  <div className="flex items-center">
                    <Input
                      type="text"
                      placeholder="Add a comment..."
                      // value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="flex-1 mr-2"
                    />
                    <Button type="submit" disabled={!newComment.trim()}>
                      Post
                    </Button>
                  </div>
                </form> */}
                </div>
              </div>
            </motion.div>
          </motion.div>
        ))}
    </AnimatePresence>
  );
}
