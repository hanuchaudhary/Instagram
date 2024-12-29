import { CommentType } from "@/types/TypeInterfaces";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { UserCircle } from "lucide-react";
import { getTimeAgo } from "@/lib/getTimeFormat";

export default function CommentTile(comment: CommentType | any) {
  return (
    <div
      key={comment.id}
      className="flex items-start justify-between gap-4 bg-secondary rounded-xl p-2"
    >
      <div className="flex items-center gap-1">
        <div className="flex items-center gap-1">
          <Avatar className="h-8 w-8">
            <AvatarImage
              className="object-cover"
              src={comment.user?.avatar}
              alt={comment.user?.username}
            />
            <AvatarFallback className="capitalize">
              <UserCircle className="fill-neutral-400 text-neutral-400" />
            </AvatarFallback>
          </Avatar>
          <h1 className="text-sm font-semibold capitalize">
            {comment.user?.username}
          </h1>
        </div>
      </div>
      <div>
        <p className="md:text-base text-sm ">{comment.comment}</p>
        <p className="text-xs text-right text-neutral-400">
          {getTimeAgo(comment?.createdAt.toString())}
        </p>
      </div>
    </div>
  );
}
