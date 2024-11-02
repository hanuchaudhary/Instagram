import { SearchedUser } from "@/store/atoms/users";
import UserTile from "./userTile";

const SuggestedUsers = () => {
  const user : SearchedUser = 
    {
      id: "1",
      avatar: "",
      username: "kalifa",
      fullName: "sexa",
    }

  return (
    <div>
      <div className="w-full bg-neutral-900 p-4 rounded-xl">
        <UserTile user={user as SearchedUser} />
        <UserTile user={user as SearchedUser} />
        <UserTile user={user as SearchedUser} />
      </div>
    </div>
  );
};

export default SuggestedUsers;
