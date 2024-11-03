import UserTile from "@/components/userTile";
import { Input } from "@/components/ui/input";
import { useSearchUsers } from "@/hooks/Users/useSearchUsers";

const SearchPage = () => {
  const {searchedUsers, setFilter } = useSearchUsers();
  return (
    <div className="max-w-xl md:px-0 px-2 mx-auto py-10">
      <div>
        <h1 className="text-2xl font-bold mb-4">Search Users</h1>
        <Input
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Search user via username"
        />
      </div>
      <div className="py-2 px-2">
        {searchedUsers.users.length < 0 ? (
          <div className="text-center py-4">
            <h2 className="text-xl text-gray-500">No Users Found</h2>
            <p className="text-gray-400">Try searching with a different username</p>
          </div>
        ) : (
          searchedUsers.users.map((user) => <UserTile key={user.id} user={user} />)
        )}
      </div>
    </div>
  );
};

export default SearchPage;
