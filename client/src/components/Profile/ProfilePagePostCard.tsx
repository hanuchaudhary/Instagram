import { PostType } from "@/store/atoms/profile";
import { Card } from "../ui/card";

const ProfilePagePostCard = ({post}:{post :PostType}) => {
  return (
    <div>
      <div>
        <Card className="h-36 w-36 lg:h-72 lg:w-72 rounded-none overflow-hidden">
          <img
            src={post.mediaURL}
            alt="Post"
            className="h-full w-full object-cover"
          />
        </Card>
      </div>
    </div>
  );
};

export default ProfilePagePostCard;
