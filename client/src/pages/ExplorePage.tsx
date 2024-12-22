import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Loader2, Heart } from "lucide-react";
import { useExplorePostStore } from "@/store/Explore&Search/useExplorePostStore";
import { useEffect } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { mediaType } from "@/types/TypeInterfaces";

export default function ExplorePage() {
  const { explorePosts, fetchExplorePosts, filter, isLoading, setFilter } =
    useExplorePostStore();
  const debouncedFilter = useDebounce(filter, 500);
  useEffect(() => {
    fetchExplorePosts(debouncedFilter);
  }, [fetchExplorePosts, debouncedFilter]);

  return (
    <div className="max-w-3xl mx-auto py-4 px-2">
      <h1 className="text-3xl font-bold mb-6">Explore Posts</h1>
      <Input
        value={filter}
        type="search"
        placeholder="Search posts..."
        className="mb-6"
        onChange={(e) => setFilter(e.target.value)}
      />
      <ScrollArea className="h-[calc(100vh-12rem)]">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="animate-spin" />
          </div>
        ) : explorePosts.length === 0 ? (
          <div className="flex justify-center items-center w-full h-40 bg-secondary/90 rounded-xl">
            <h1 className="md:text-2xl text-lg font-semibold text-primary text-center">
              "No posts found with the search term <strong>{filter}</strong>"
            </h1>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-1 md:gap-4">
            {explorePosts.map((post) => (
              <Card
                key={post.id as number}
                className="overflow-hidden relative group"
              >
                <CardContent className="p-0">
                  {post.mediaType === mediaType.video ? (
                    <video className="w-full h-full object-cover aspect-square">
                      <source src={post.mediaURL as string} type="video/mp4" />
                    </video>
                  ) : (
                    <img
                      src={post.mediaURL as string}
                      alt={`Post ${post.id}`}
                      className="w-full h-full object-cover aspect-square"
                    />
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 text-white flex items-center gap-2">
                      <Heart className="w-6 h-6" />
                      <span className="text-lg font-semibold">
                        {post._count.likes}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
