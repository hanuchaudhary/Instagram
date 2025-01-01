import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Loader2, Heart, ImageIcon } from "lucide-react";
import { useExplorePostStore } from "@/store/Explore&Search/useExplorePostStore";
import { useEffect, useRef, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { mediaType } from "@/types/TypeInterfaces";
import ProfilePostPopup from "@/components/Profile/ProfilePostPopup";
import { usePostsStore } from "@/store/PostsStore/usePostsStore";

export default function ExplorePage() {
  const [isOpen, setIsOpen] = useState(false);
  const { setSelectedPostId } = usePostsStore();
  const handleClose = () => {
    setIsOpen(false);
    setSelectedPostId(null);
  };

  const {
    explorePosts,
    fetchExplorePosts,
    filter,
    isLoading,
    setFilter,
    hasMore,
  } = useExplorePostStore();
  const debouncedFilter = useDebounce(filter, 500);
  useEffect(() => {
    fetchExplorePosts(debouncedFilter);
  }, [debouncedFilter]);

  const observerRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!hasMore || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchExplorePosts(debouncedFilter);
        }
      },
      { threshold: 1.0 }
    );

    if (observerRef.current) observer.observe(observerRef.current);

    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current);
    };
  }, [fetchExplorePosts, hasMore, isLoading]);

  return (
    <div className="max-w-3xl relative mx-auto py-4 px-2">
      <h1 className="text-3xl font-bold mb-6">Explore Posts</h1>
      <Input
        value={filter}
        type="search"
        placeholder="Search posts..."
        className="mb-6"
        onChange={(e) => setFilter(e.target.value)}
      />
      <ScrollArea className="h-full">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="animate-spin" />
          </div>
        ) : explorePosts.length === 0 ? (
          <div className="flex justify-center flex-col items-center w-full h-40 bg-secondary/30 rounded-xl">
            <div>
              <ImageIcon className="h-20 w-20 text-muted-foreground" />
            </div>
            <h1 className="md:text-2xl text-lg font-semibold text-muted-foreground text-center">
              No posts found with the search term <strong>{filter}</strong>
            </h1>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-1 md:gap-4">
            {explorePosts.map((post) => (
              <Card
                onClick={() => {
                  setSelectedPostId(post.id as number);
                  setIsOpen(true);
                }}
                key={post.id as number}
                className="overflow-hidden cursor-pointer relative group"
              >
                <CardContent className="p-0">
                  {post.mediaType === mediaType.video ? (
                    <video
                      muted
                      src={post.mediaURL as string}
                      className="w-full h-full object-cover aspect-square"
                    ></video>
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
        <div ref={observerRef} />
        {isLoading && (
          <div className="flex justify-center mt-4">
            <Loader2 className="animate-spin" />
          </div>
        )}
        {!hasMore && (
          <div className="end-message my-4 bg-secondary/30 rounded-xl p-4">
            <h1 className="text-center text-sm font-semibold text-muted-foreground">
              No more posts to show
            </h1>
          </div>
        )}
        <div ref={observerRef} />
      </ScrollArea>
      <div className="z-[9999999999]">
        <ProfilePostPopup handleClose={handleClose} isOpen={isOpen} />
      </div>
    </div>
  );
}
