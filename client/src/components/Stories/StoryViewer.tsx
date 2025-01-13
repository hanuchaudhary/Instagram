import { useStoriesStore } from "@/store/StoriesStore/useStoriesStore";
import Story from "./Story";
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function StoryViewer() {
  const { usersHavingStories, fetchUsers } = useStoriesStore();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleScroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      const currentScroll = scrollContainerRef.current.scrollLeft;
      const targetScroll =
        direction === "left"
          ? currentScroll - scrollAmount
          : currentScroll + scrollAmount;

      scrollContainerRef.current.scrollTo({
        left: targetScroll,
        behavior: "smooth",
      });
    }
  };

  if (usersHavingStories.length === 0) {
    return (
      <div className="md:w-[650px] w-full md:px-4 py-6 bg-secondary/50 rounded-xl text-center">
        <p className="text-muted-foreground select-none">
          No stories available at the moment.
        </p>
      </div>
    );
  }

  return (
    <div className="md:w-[650px] relative w-full md:px-4 py-2">
      <Button
        disabled={usersHavingStories.length < 5}
        variant="outline"
        size="icon"
        className="absolute z-[9999] md:flex hidden rounded-full -left-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm"
        onClick={() => handleScroll("left")}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button
        disabled={usersHavingStories.length < 5}
        variant="outline"
        size="icon"
        className="absolute z-[9999] md:flex hidden rounded-full -right-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm"
        onClick={() => handleScroll("right")}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
      <div
        ref={scrollContainerRef}
        className="flex md:space-x-4 relative space-x-2 overflow-x-auto scrollbar-hide"
      >
        {usersHavingStories.map((user, index) => (
          <Link key={user.id || index} to={`/story/${user.username}`}>
            <Story user={user} />
          </Link>
        ))}
      </div>
    </div>
  );
}
