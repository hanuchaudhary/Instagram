import { useEffect } from "react";
import { usePostsStore } from "@/store/PostsStore/usePostsStore";
import PostCard from "@/components/PostCard";
import SuggestedUsers from "@/components/SuggestedUsers";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, UserPlus } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useFollowDataStore } from "@/store/UserStore/useFollowStore";

export default function HomePage() {
  const { posts, fetchPosts, isPostLoading, error } = usePostsStore();
  const { fetchFollowData } = useFollowDataStore();

  useEffect(() => {
    fetchFollowData();
    fetchPosts();
  }, [fetchPosts, fetchFollowData]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Feed</h1>
      <div className="grid lg:grid-cols-5 md:mx-20">
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

          {!isPostLoading && !error && posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center bg-secondary/30 rounded-xl p-8 text-center">
              <UserPlus className="h-16 w-16 mb-4 text-muted-foreground" />
              <h2 className="text-2xl font-semibold mb-2">No posts yet</h2>
              <p className="text-muted-foreground max-w-md">
                Start following some users to see their posts here. Explore
                suggested users to get started!
              </p>
            </div>
          ) : (
            <ScrollArea className="">
              <div className="space-y-6">
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
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
