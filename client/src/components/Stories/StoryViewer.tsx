import { useStoriesStore } from "@/store/StoriesStore/useStoriesStore";
import Story from "./Story";
import { useEffect } from "react";
import { Link } from "react-router-dom";

export default function StoryViewer() {
  const { usersHavingStories, fetchUsers } = useStoriesStore();
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <div>
      <div className="flex space-x-4 p-4 overflow-x-auto">
        {usersHavingStories.map((user, index) => (
          <Link key={index} to={`/story/${user.username}`} state={{ user }}>
            <Story user={user} />
          </Link>
        ))}
      </div>
    </div>
  );
}
