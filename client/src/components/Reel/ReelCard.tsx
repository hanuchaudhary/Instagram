import { Reel } from "@/store/ReelsStore/useReelsStore";
import ReelVideoPlayer from "./ReelVideoPlayer";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getTimeAgo } from "@/lib/getTimeFormat";

export default function ReelCard(reel: Reel) {
  return (
    <div className="border ">
      <div>
        <ReelVideoPlayer mediaURL={reel.mediaURL} />
        <div className="px-3 py-6 select-none">
          <div className="flex gap-1 items-center">
            <Avatar>
              <AvatarImage
                className="object-cover"
                src={reel.User.avatar}
                alt={reel.User.username}
              />
              <AvatarFallback>{reel.User.username[0]}</AvatarFallback>
            </Avatar>
            <h1 className="font-semibold">{reel.User.username}</h1>
          </div>
          <div>
            <h1 className="text-sm pt-1 line-clamp-2">{reel.caption}</h1>
            <p className="text-xs text-neutral-400">{getTimeAgo(reel.createdAt)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
