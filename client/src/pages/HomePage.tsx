import PostCard from "@/components/PostCard";
import SuggestedUsers from "@/components/SuggestedUsers";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePostsStore } from "@/store/PostsStore/usePostsStore";
import { useEffect } from "react";
export default function HomePage() {
  const { posts, fetchPosts } = usePostsStore();
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return (
    <div className="lg:max-w-4xl max-w-lg px-3 mx-auto py-2 md:py-10">
      <h1 className="font-semibold text-xl py-2">Posts</h1>
      <div className="grid lg:grid-cols-5 grid-cols-1 gap-4">
        <div className="lg:col-span-3 col-span-1 h-[calc(100vh-150px)]">
          <ScrollArea className="flex flex-col items-center justify-center gap-4">
            {posts.length === 0 ? (
              <div className="flex flex-col py-10 mt-10 items-center justify-center h-full bg-secondary/30 rounded-lg p-8 mx-auto max-w-md">
                <p className="text-lg">No posts available</p>
                <p className="text-sm">
                  Follow some users to see their posts here
                </p>
              </div>
            ) : (
              posts.map((post) => <PostCard key={post.id} post={post} />)
            )}
          </ScrollArea>
        </div>

        <div className="lg:block hidden col-span-2">
          <h1>Suggestions</h1>
          <div className="mt-4">
            <SuggestedUsers />
          </div>
        </div>
      </div>
    </div>
  );
}
