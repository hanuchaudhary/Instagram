import { SearchedUser } from "@/store/atoms/users";
import UserTile from "./userTile";
import { useRecoilValue } from "recoil";
import { suggestedUsersAtom } from "@/store/atoms/SuggestedUsers";
import { useSuggestedUsers } from "@/hooks/Users/useSuggestedUsers";

const SuggestedUsers = () => {
  useSuggestedUsers();
  const suggestedUsersData = useRecoilValue(suggestedUsersAtom);
  const {users} = suggestedUsersData;
  console.log(users);


  return (
    <div>
      <div className="w-full bg-neutral-900 p-4 rounded-xl">
        {users.length > 0 && users.map((user) => (
          <UserTile key={user.id} user={user as SearchedUser} />
        ))}
      </div>
    </div>
  );
};

export default SuggestedUsers;
