import { Heart, MessageCircle, Send } from "lucide-react";
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
      <Card className="rounded-none shadow-sm w-fit">
        <CardHeader className="flex flex-row items-center gap-3">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>KC</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>Kush Chaudhary</CardTitle>
            <CardDescription className="text-xs">NEW YORK</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="px-0">
          <div className="post h-full w-full">
            <img
              src="https://imgs.search.brave.com/HlXTmfFjmnDiU8eNLGsrCVYRH-nh2y_5uoDT3F01mt8/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzLzkwLzM0/L2ZhLzkwMzRmYWMy/MGIxMGFjYmMwZWMx/MGQyYmRmOGNmNmEw/LmpwZw"
              alt=""
            />
          </div>
        </CardContent>
        <CardFooter className="flex gap-1 items-center">
          <div>
            <Heart className="fill-rose-600 text-rose-600" />
          </div>
          <div>
            <MessageCircle />
          </div>
          <div>
            <Send />
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PostCard;
