import UserTile from "./userTile";
import { Card } from "./ui/card";
import { useSuggestedUsersStore } from "@/store/UserStore/useSuggestedUsersStore";
import { useEffect } from "react";
import { searchUser } from "@/store/Explore&Search/useSearchUserStore";

const SuggestedUsers = () => {
  const { fetchSuggestedUsers, suggestedUsers } = useSuggestedUsersStore();
  useEffect(() => {
    fetchSuggestedUsers();
  }, [fetchSuggestedUsers]);

  return (
    <div>
      <Card className="w-full shadow-none p-4 bg-popover rounded-xl">
        {suggestedUsers.length > 0 ? (
          <div>
            <h2 className="text-lg font-semibold mb-4">Suggested Users</h2>
            <p className="text-sm mb-4">People you might want to follow</p>
            {suggestedUsers.map((user) => (
              <UserTile key={user.id} user={user as searchUser} />
            ))}
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="">No suggestions available right now</p>
            <p className="text-sm ">Check back later for new suggestions</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default SuggestedUsers;
