import { SearchedUser } from "@/store/atoms/users";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { UserCircle } from "lucide-react";
import FollowUser from "./FollowUser";

const UserTile = ({ user }: { user: SearchedUser }) => {
  return (
    <div>
      <div className="shadow-sm px-2 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 flex-row">
          <Avatar>
            <AvatarImage className="object-cover" src={user.avatar} />
            <AvatarFallback className="uppercase font-semibold">
              <UserCircle className="fill-neutral-400 text-neutral-400" />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-0">
            <h1>{user.username}</h1>
            <p className="text-[10px] text-neutral-400">{user.fullName}</p>
          </div>
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
