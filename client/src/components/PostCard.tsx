import { MoreHorizontal } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import LikePost from "./LikePost";
import PostComments from "./PostComments";
import MiniProfile from "./Profile/MiniProfile";
import ReelVideoPlayer from "./Reel/ReelVideoPlayer";
import { post } from "@/types/PostTypes";
import { mediaType } from "@/types/TypeInterfaces";
const PostCard = ({ post }: { post: post }) => {
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
          <CardContent className="p-0 overflow-hidden h-[500px]">
            <div className="w-full h-full aspect-square">
              {post.mediaType === mediaType.video.toString() ? (
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
