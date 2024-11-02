import PostCard from "@/components/PostCard";
import SuggestedUsers from "@/components/SuggestedUsers";
import { usePosts } from "@/hooks/Posts/usePosts";
import { postsState } from "@/store/atoms/posts";
import { useRecoilState } from "recoil";

export default function HomePage() {
  usePosts();
  const postData = useRecoilState(postsState);
  return (
    <div className="w-full px-4 py-10">
      <h1 className="font-semibold text-xl py-2">Posts</h1>
      <div className="grid lg:grid-cols-5 gap-4 ">
        <div className="flex col-span-3 flex-col items-center justify-center gap-4">
          {postData[0].posts.length < 0 ? (
            <div>No Posts</div>
          ) : (
            postData[0].posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))
          )}
        </div>
        <div className="lg:block hidden col-span-2 ">
          <h1>Suggestions</h1>
          <div className="mt-4">
            <SuggestedUsers/>
          </div>
        </div>
      </div>
    </div>
  );
}
