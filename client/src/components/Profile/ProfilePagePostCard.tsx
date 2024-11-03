import { PostType } from "@/store/atoms/profile";
import { Card } from "../ui/card";
import { Heart, MessageCircle, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import axios from "axios";
import { BACKEND_URL } from "@/config/config";
import { toast } from "sonner";
import { useProfile } from "@/hooks/Profile/useProfile";

const ProfilePagePostCard = ({ post }: { post: PostType }) => {
  const { fetchProfile } = useProfile();
  const handleDeletePost = async () => {
    try {
      await axios.delete(`${BACKEND_URL}/post/delete/${post.id}`, {
        headers: {
          Authorization: localStorage.getItem("token")?.split(" ")[1],
        },
      });
      toast.success("Post deleted Successfully");
      fetchProfile();
    } catch (error) {
      toast.success("Error while deleting post");
      console.log(error);
    }
  };

  return (
    <div>
      <div>
        <Card className="h-36 w-36 lg:h-72 lg:w-72 rounded-none overflow-hidden relative group">
          <img
            src={post.mediaURL}
            alt="Post"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 text-white flex items-center gap-4">
              <div className="absolute top-2 right-2 z-40">
                <Button
                  onClick={handleDeletePost}
                  size={"icon"}
                  variant={"destructive"}
                >
                  <Trash2 />
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-6 h-6" />
                <span className="text-lg font-semibold">
                  {post._count?.likes || 0}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-6 h-6" />
                <span className="text-lg font-semibold">
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
