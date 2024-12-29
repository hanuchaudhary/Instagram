import { Reel } from "@/store/ReelsStore/useReelsStore";
import ReelVideoPlayer from "./ReelVideoPlayer";
import UserTile from "../userTile";
import { getTimeAgo } from "@/lib/getTimeFormat";

export default function ReelCard(reel: Reel) {
  return (
    <div className="border rounded-lg overflow-hidden bg-black">
      <div>
        <ReelVideoPlayer mediaURL={reel.mediaURL} />
        <div className="px-4 py-2">
          <UserTile user={{ ...reel.User }} />
          <div>
            <h1 className="text-sm pt-1 line-clamp-2">{reel.caption}</h1>
            <p className="text-xs text-neutral-400">
              {getTimeAgo(reel.createdAt)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
