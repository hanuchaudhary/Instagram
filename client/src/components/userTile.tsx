import { searchUser } from "@/store/Explore&Search/useSearchUserStore";
import FollowUser from "./FollowUser";
import MiniProfile from "./Profile/MiniProfile";
import { useUserStore } from "@/store/AuthHeader/getAuthHeaders";

const UserTile = ({ user }: { user: searchUser }) => {
  const { stateUser } = useUserStore();

  return (
    <div>
      <div className=" py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 flex-row">
          <MiniProfile
            username={user.username}
            fullName={user.fullName}
            avatar={user.avatar}
            bio={user.bio!}
            location={user.location!}
          />
        </div>
        <div className="flex items-center justify-center">
          <h1 className="font-semibold text-blue-500">
            {stateUser?.id === user.id ? "" : <FollowUser userId={user.id} />}
          </h1>
        </div>
      </div>
    </div>
  );
};

export default UserTile;
