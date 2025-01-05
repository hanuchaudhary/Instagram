import { Reel } from "@/store/ReelsStore/useReelsStore";
import ReelVideoPlayer from "./ReelVideoPlayer";
import UserTile from "../userTile";
import { getTimeAgo } from "@/lib/getTimeFormat";
import { Bookmark } from "lucide-react";
import PostShareDialog from "./PostShareDialog";
import LikePost from "../LikePost";
import PostComments from "../PostComments";
import { usePostCommentsStore } from "@/store/PostsStore/usePostComments";

export default function ReelCard(reel: Reel) {
  const { setPostId } = usePostCommentsStore();
  return (
    <div className="relative w-full mx-auto bg-background">
      <div className="flex flex-row items-end gap-2 backdrop-blur-sm">
        <div className="w-full relative h-[600px] bg-black flex items-center justify-center">
          <ReelVideoPlayer mediaURL={reel.mediaURL} />
          <div className="px-4 absolute bottom-0 z-[99999999999] w-full py-2">
            <UserTile user={{ ...reel.User }} />
            <p className="text-xs text-muted-foreground ">
              {getTimeAgo(reel.createdAt)}
            </p>
            <h1 className="text-sm font-medium line-clamp-2">{reel.caption}</h1>
          </div>
        </div>

        <div className="flex md:relative absolute right-0 z-[999999] flex-col items-center space-y-2">
          <div className="flex flex-col items-center">
            <LikePost postId={reel.Post.id} />
            <span className="text-sm font-semibold">
              {reel.Post._count.likes}k
            </span>
          </div>
          <div className="flex flex-col items-center">
            <div onClick={() => setPostId(reel.Post.id)}>
              <PostComments />
            </div>
            <span className="text-sm font-semibold">
              {reel.Post._count.comments}k
            </span>
          </div>
          <button
            className="p-2 rounded-full text-foreground"
            aria-label="Share"
          >
            <PostShareDialog postURL={reel.mediaURL} />
          </button>

          <button
            className="p-2 rounded-full text-foreground"
            aria-label="Save"
          >
            <Bookmark className="w-7 h-7" />
          </button>
        </div>
      </div>
    </div>
  );
}
