import { Reel } from "@/store/ReelsStore/useReelsStore";
import ReelVideoPlayer from "./ReelVideoPlayer";
import UserTile from "../userTile";
import { getTimeAgo } from "@/lib/getTimeFormat";
import { Heart, MessageCircle, Bookmark } from "lucide-react";
import PostShareDialog from "./PostShareDialog";

export default function ReelCard(reel: Reel) {
  return (
    <div className="relative w-full mx-auto bg-background">
      <div className="flex flex-row items-end gap-2 backdrop-blur-sm">
        <ReelVideoPlayer mediaURL={reel.mediaURL} />

        <div className="flex flex-col items-center space-y-2">
          <div className="flex flex-col items-center">
            <button
              className="p-2 rounded-full text-foreground"
              aria-label="Like"
            >
              <Heart className="w-9 h-9" />
            </button>
            <span className="text-sm font-semibold">12.5k</span>
          </div>
          <div className="flex flex-col items-center">
            <button
              className="p-2 rounded-full text-foreground"
              aria-label="Comment"
            >
              <MessageCircle className="w-9 h-9" />
            </button>
            <span className="text-sm font-semibold">1.2k</span>
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
            <Bookmark className="w-9 h-9" />
          </button>
        </div>
      </div>

      <div className="px-4 py-2">
        <UserTile user={{ ...reel.User }} />
        <p className="text-xs text-muted-foreground ">
          {getTimeAgo(reel.createdAt)}
        </p>
        <div className="">
          <h1 className="text-sm font-medium line-clamp-2">{reel.caption}</h1>
        </div>
      </div>
    </div>
  );
}
