import { PostType, useProfileStore } from "@/store/UserStore/useProfileStore";
import { Card } from "../ui/card";
import { Heart, MessageCircle, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
const ProfilePagePostCard = ({ post }: { post: PostType }) => {
  const { deleteProfilePost } = useProfileStore();

  return (
    <div>
      <div>
        <Card className="aspect-square h-full w-full rounded-none overflow-hidden relative group">
          {post.mediaType === "video" ? (
            <video
              src={post.mediaURL}
              className="object-cover w-full h-full"
              muted
            />
          ) : (
            <img
              src={post.mediaURL}
              className="object-cover w-full h-full"
              alt="post"
            />
          )}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 text-white flex items-center gap-4">
              <div className="absolute md:top-2 md:right-2 top-1 right-1 z-40">
                <Button
                  onClick={() => deleteProfilePost(post.id!)}
                  size={"icon"}
                  variant={"destructive"}
                >
                  <Trash2 className="md:h-5 md:w-5 h-2 w-2" />
                </Button>
              </div>
              <div className="flex items-center md:gap-2">
                <Heart className="md:w-6 h-4 w-4 md:h-6" />
                <span className="md:text-lg text-xs font-semibold">
                  {post._count?.likes || 0}
                </span>
              </div>
              <div className="flex items-center md:gap-2">
                <MessageCircle className="md:w-6 h-4 w-4 md:h-6" />
                <span className="md:text-lg text-xs font-semibold">
                  {post._count?.comments || 0}
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePagePostCard;
