import { searchUser } from "@/store/Explore&Search/useSearchUserStore";
import FollowUser from "../FollowUser";
import MiniProfile from "../Profile/MiniProfile";
import { useAuthStore } from "@/store/AuthStore/useAuthStore";
import { useLocation } from "react-router-dom";

const UserTile = ({ user }: { user: searchUser }) => {
  const { authUser } = useAuthStore();
  const { pathname } = useLocation();
  return (
    <div>
      <div
        className={`py-3 flex items-center ${
          pathname === "/reels" ? "gap-2" : "justify-between"
        } `}
      >
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
            {authUser?.id === user.id ? "" : <FollowUser userId={user.id} />}
          </h1>
        </div>
      </div>
    </div>
  );
};

export default UserTile;
