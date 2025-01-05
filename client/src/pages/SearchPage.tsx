import UserTile from "@/components/Tiles/userTile";
import { Input } from "@/components/ui/input";
import { useSearchUserStore } from "@/store/Explore&Search/useSearchUserStore";
import { useEffect } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { Loader2 } from "lucide-react";

const SearchPage = () => {
  const { fetchSearchedUsers, filter, isLoading, searchUsers, setFilter } =
    useSearchUserStore();
  const debouncedFilter = useDebounce(filter, 300);
  useEffect(() => {
    fetchSearchedUsers(debouncedFilter);
  }, [debouncedFilter, fetchSearchedUsers]);

  return (
    <div className="max-w-xl md:px-0 px-2 mx-auto py-4">
      <div>
        <h1 className="text-2xl font-bold mb-4">Search Users</h1>
        <Input
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Search user via username"
        />
      </div>
      <div className="py-2 px-2">
        {isLoading ? (
          <div className="h-full w-full flex items-center justify-center">
            <Loader2 className="animate-spin" />
          </div>
        ) : searchUsers.length === 0 ? (
          <div className="text-center py-4">
            <h2 className="text-xl text-neutral-500">No Users Found</h2>
            <p className="text-neutral-400">
              Try searching with a different username
            </p>
          </div>
        ) : (
          searchUsers.map((user) => <UserTile key={user.id} user={user} />)
        )}
      </div>
    </div>
  );
};

export default SearchPage;
