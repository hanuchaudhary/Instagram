import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { useExplorePosts } from "@/hooks/Posts/useExplorePosts";
import { Loader2, Heart } from "lucide-react";

export default function ExplorePage() {
  const { isLoading, explorePosts, setFilter } = useExplorePosts();

  return (
    <div className="max-w-3xl mx-auto py-4 px-2">
      <h1 className="text-3xl font-bold mb-6">Explore Posts</h1>
      <Input
        type="search"
        placeholder="Search posts..."
        className="mb-6"
        onChange={(e) => setFilter(e.target.value)}
      />
      <ScrollArea className="h-[calc(100vh-12rem)]">
        <div className="grid grid-cols-3 gap-1 md:gap-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="animate-spin" />
            </div>
          ) : (
            explorePosts.map((post) => (
              <Card key={post.id} className="overflow-hidden relative group">
                <CardContent className="p-0">
                  {post.mediaType === "video" ? (
                    <video
                      className="w-full h-full object-cover aspect-square"
                    >
                      <source src={post.mediaURL} type="video/mp4" />
                    </video>
                  ) : (
                    <img
                      src={post.mediaURL}
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
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
