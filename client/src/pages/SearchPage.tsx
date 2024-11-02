import UserTile from "@/components/userTile";
import { Input } from "@/components/ui/input";
import { useSearchUsers } from "@/hooks/SearchUser/useSearchUsers";

const SearchPage = () => {
  const {searchedUsers, setFilter } = useSearchUsers();
  return (
    <div className="max-w-xl md:px-0 px-2 mx-auto py-10">
      <div>
        <Input
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Search user via username"
        />
      </div>
      <div className="py-2 px-2">
        {searchedUsers.users.length < 0 ? (
          <div>
            <h1>No User Found</h1>
          </div>
        ) : (
          searchedUsers.users.map((user) => <UserTile user={user} />)
        )}
      </div>
    </div>
  );
};

export default SearchPage;
