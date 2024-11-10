import { SearchedUser } from "@/store/atoms/users";
import FollowUser from "./FollowUser";
import MiniProfile from "./Profile/MiniProfile";

const UserTile = ({ user }: { user: SearchedUser }) => {
  return (
    <div>
      <div className="px-2 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 flex-row">
          <MiniProfile
            username={user.username}
            fullName={user.fullName}
            avatar={user.avatar}
            bio={user.bio}
            location={user.location}
          />
        </div>
        <div className="flex items-center justify-center">
          <h1 className="font-semibold text-blue-500">
            <FollowUser userId={user.id} isFollowing={user.isFollowing} />
          </h1>
        </div>
      </div>
    </div>
  );
};

export default UserTile;
