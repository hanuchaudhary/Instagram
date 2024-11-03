import { SearchedUser } from "@/store/atoms/users";
import UserTile from "./userTile";
import { useRecoilValue } from "recoil";
import { suggestedUsersAtom } from "@/store/atoms/SuggestedUsers";
import { useSuggestedUsers } from "@/hooks/Users/useSuggestedUsers";

const SuggestedUsers = () => {
  useSuggestedUsers();
  const suggestedUsersData = useRecoilValue(suggestedUsersAtom);
  const {users} = suggestedUsersData;
  
  return (
    <div>
      <div className="w-full bg-neutral-900 p-4 rounded-xl">
        {users.length > 0 ? (
          <div>
            <h2 className="text-lg font-semibold mb-4">Suggested Users</h2>
            <p className="text-sm text-neutral-400 mb-4">People you might want to follow</p>
            {users.map((user) => (
              <UserTile key={user.id} user={user as SearchedUser} />
            ))}
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-neutral-400">No suggestions available right now</p>
            <p className="text-sm text-neutral-500">Check back later for new suggestions</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuggestedUsers;
