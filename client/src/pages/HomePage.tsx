import PostCard from "@/components/PostCard";
import SuggestedUsers from "@/components/SuggestedUsers";
import { usePosts } from "@/hooks/Posts/usePosts";
import { postsState } from "@/store/atoms/posts";
import { useRecoilState } from "recoil";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function HomePage() {
  usePosts();
  const [posts] = useRecoilState(postsState);

  return (
    <div className="w-full md:px-4 py-2 md:py-10">
      <h1 className="font-semibold text-xl px-4 md:px-20 py-2">Posts</h1>
      
      <div className="grid lg:grid-cols-5 lg:px-20 gap-4">
        <div className="col-span-3 h-[calc(100vh-150px)]">
          <ScrollArea className="flex flex-col items-center justify-center gap-4 px-3">
            {posts.posts.length === 0 ? (
              <div className="flex flex-col py-10 mt-10 items-center justify-center h-full bg-secondary rounded-lg p-8 mx-auto max-w-md">
                <p className="text-lg">No posts available</p>
                <p className="text-sm">
                  Follow some users to see their posts here
                </p>
              </div>
            ) : (
              posts.posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))
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
