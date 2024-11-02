import {
  Heart,
  MessageCircle,
  Send,
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
import { useRecoilState } from "recoil";
import { currentProfileState } from "@/store/atoms/profile";

const PostCard = ({ post }: { post: post }) => {
  const profileImage = useRecoilState(currentProfileState);
  return (
    <div>
      <Card className="rounded-none border-t-0 border-l-0 border-r-0 border-b pb-4 border-b-neutral-800  shadow-sm w-[468px]">
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
            <div className="flex gap-4">
              <button>
                <Heart className="h-6 w-6 hover:text-rose-600" />
              </button>
              <button>
                <MessageCircle className="h-6 w-6" />
              </button>
              <button>
                <Send className="h-6 w-6" />
              </button>
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
            <div className="flex items-center gap-2 mt-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={profileImage[0].avatar} alt="U" />
                <AvatarFallback>
                  <UserCircle className="fill-neutral-400 h-3 w-3 text-neutral-400" />
                </AvatarFallback>
              </Avatar>
              <input
                type="text"
                placeholder="Add a comment..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-500"
              />
              <button className="text-sm font-semibold text-blue-500 hover:text-blue-600">
                Post
              </button>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PostCard;
