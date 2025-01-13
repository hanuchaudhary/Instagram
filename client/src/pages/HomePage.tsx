import { useEffect, useRef } from "react";
import PostCard from "@/components/Post/PostCard";
import SuggestedUsers from "@/components/SuggestedUsers";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Loader2, UserPlus } from "lucide-react";
import { useFollowDataStore } from "@/store/UserStore/useFollowStore";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { usePostsStore } from "@/store/PostsStore/usePostsStore";
import StoryViewer from "@/components/Stories/StoryViewer";

export default function HomePage() {
  const { fetchFollowData } = useFollowDataStore();
  const { posts, fetchPosts, hasMore, isPostLoading, error } = usePostsStore();
  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetchFollowData();
  }, [fetchFollowData]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  useEffect(() => {
    if (!hasMore || isPostLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchPosts();
        }
      },
      { threshold: 1.0 }
    );

    if (observerRef.current) observer.observe(observerRef.current);

    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current);
    };
  }, [fetchPosts, hasMore, isPostLoading]);

  return (
    <div className="mx-auto w-full max-w-7xl py-4 px-2 md:px-4">
      <div className="md:my-6">
        <StoryViewer />
      </div>
      <div className="grid lg:grid-cols-5 md:mx-6 gap-4">
        <div className="lg:col-span-3">
          {isPostLoading && (
            <div className="space-y-4">
              {[...Array(3)].map((_, index) => (
                <Skeleton key={index} className="w-full h-[400px] rounded-xl" />
              ))}
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                Failed to load posts. Please try again later.
              </AlertDescription>
            </Alert>
          )}

          {!isPostLoading && posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center bg-secondary/30 rounded-xl p-8 text-center">
              <UserPlus className="h-16 w-16 mb-4 text-muted-foreground" />
              <h2 className="text-2xl font-semibold mb-2">No posts yet</h2>
              <p className="text-muted-foreground max-w-md">
                Start following some users to see their posts here. Explore
                suggested users to get started!
              </p>
            </div>
          ) : (
            <ScrollArea className="md:mx-10 w-full">
              <div className="space-y-6">
                {posts.map((post, idx) => (
                  <PostCard key={post.id || idx} {...post} />
                ))}
              </div>
              <div ref={observerRef} />
              {isPostLoading && (
                <div className="flex justify-center mt-4">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              )}
              {!hasMore && (
                <div className="my-4 bg-secondary/30 rounded-xl p-4">
                  <p className="text-center text-sm font-semibold text-muted-foreground">
                    No more posts to show
                  </p>
                </div>
              )}
            </ScrollArea>
          )}
        </div>
        <div className="lg:col-span-2 hidden lg:block">
          <h2 className="text-2xl font-semibold mb-4">Suggested Users</h2>
          <SuggestedUsers />
        </div>
      </div>
    </div>
  );
}
