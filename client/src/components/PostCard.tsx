import { Heart, MessageCircle, Send, MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

const PostCard = () => {
  return (
    <div>
      <Card className="rounded-none shadow-sm w-[468px]">
        <CardHeader className="flex flex-row items-center justify-between p-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>KC</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-sm font-semibold">kushchaudhary</CardTitle>
              <CardDescription className="text-xs">New York, USA</CardDescription>
            </div>
          </div>
          <button>
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="aspect-square w-full">
            <img
              src="https://imgs.search.brave.com/HlXTmfFjmnDiU8eNLGsrCVYRH-nh2y_5uoDT3F01mt8/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzLzkwLzM0/L2ZhLzkwMzRmYWMy/MGIxMGFjYmMwZWMx/MGQyYmRmOGNmNmEw/LmpwZw"
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
                <span className="font-semibold">kushchaudhary</span> Beautiful sunset in New York City! 🌇
              </p>
            </div>
            <p className="text-xs text-neutral-500 uppercase">2 hours ago</p>
            <div className="flex items-center gap-2 mt-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                <AvatarFallback>KC</AvatarFallback>
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
