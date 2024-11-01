import PostCard from "@/components/PostCard";

export default function HomePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="font-semibold text-xl py-2">Posts</h1>
      <div className="flex flex-col items-center justify-center gap-4">
        <PostCard />
        <PostCard />
        <PostCard />
        <PostCard />
        <PostCard />
        <PostCard />
      </div>
    </div>
  );
}
