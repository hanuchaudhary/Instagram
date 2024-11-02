import {
  MoreHorizontal,
  UserCircle,
  MapPin,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { post } from "@/store/atoms/posts";
import LikePost from "./LikePost";
import PostComments from "./PostComments";

const PostCard = ({ post }: { post: post }) => {
  return (
    <div>
      <Card className="rounded-none border-t-0 border-l-0 border-r-0 border-b pb-4 border-b-neutral-800 w-[350px]  shadow-sm md:w-[468px]">
        <CardHeader className="flex flex-row items-center justify-between p-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={post.User.avatar} alt="@shadcn" />
              <AvatarFallback>
                <UserCircle className="fill-neutral-400 text-neutral-400" />
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-sm font-semibold">
                {post.User.fullName}
              </CardTitle>
              <CardDescription className="text-xs capitalize">
                {post.location != "" && (
                  <div className="items-center flex">
                    <MapPin className="h-3 w-3" />
                    {post.location}
                  </div>
                )}
              </CardDescription>
            </div>
          </div>
          <button>
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="aspect-square w-full">
            <img
              src={post.mediaURL}
              alt="Post image"
              className="h-full w-full object-cover"
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2 p-3">
          <div className="flex w-full">
            <div className="flex gap-4 items-center">
              <LikePost postId={post.id}/>
              <div className="text-sm">
                {post._count.likes} likes
              </div>
              <PostComments comments={post.comments} postId={post.id} />
            </div>
          </div>
          <div className="flex w-full flex-col gap-1">
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
