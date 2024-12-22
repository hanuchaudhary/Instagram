import ProfileCard from "@/components/Profile/ProfileCard";
import { Separator } from "@/components/ui/separator";
import ProfilePagePostCard from "@/components/Profile/ProfilePagePostCard";
import { useProfileStore } from "@/store/UserStore/useProfileStore";
import { useEffect } from "react";

const ProfilePage = () => {
  const {fetchProfile,profile} = useProfileStore();
  const posts = profile.posts;
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return (
    <div className="flex flex-col h-full ">
      <div className="mt-10">
        <ProfileCard />
      </div>
      <Separator />
      <div className="flex-grow ">
        <div className="w-full md:px-20 grid grid-cols-3 px-3 gap-4 md:gap-3 pb-20 pt-4 md:py-4">
          {posts?.length! > 0 ? (
            posts?.map((post) => <ProfilePagePostCard key={post.id} post={post} />)
          ) : (
            <div className="col-span-3 text-center py-8">
              <h1 className="text-xl text-neutral-500">No posts to display yet</h1>
              <p className="text-neutral-400 mt-2">Share your first post to get started!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
