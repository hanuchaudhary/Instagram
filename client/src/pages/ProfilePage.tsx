import ProfileCard from "@/components/Profile/ProfileCard";
import { Separator } from "@/components/ui/separator";
import ProfilePagePostCard from "@/components/Profile/ProfilePagePostCard";
import { useProfileStore } from "@/store/UserStore/useProfileStore";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePostCommentsStore } from "@/store/PostsStore/usePostComments";
import PageLoader from "@/components/PageLoader";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { fetchProfile, profile, isFetchingProfile } = useProfileStore();
  const setPostId = usePostCommentsStore.getState().setPostId;
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);
  const posts = profile.posts;

  if (isFetchingProfile) {
    return <PageLoader />;
  }

  return (
    <div className="flex relative flex-col h-full ">
      <div className="mt-10">
        <ProfileCard />
      </div>
      <Separator />
      <div className="flex-grow ">
        <div>
          {posts?.length! > 0 ? (
            <div className="w-full md:px-20 grid grid-cols-3 px-3 gap-4 md:gap-3 pb-20 pt-4 md:py-4">
              {posts?.map((post) => (
                <div
                  onClick={() => {
                    navigate(`/post/${post.id}`);
                    setPostId(post.id!);
                  }}
                  className="cursor-pointer"
                  key={post.id}
                >
                  <ProfilePagePostCard post={post} />
                </div>
              ))}
            </div>
          ) : (
            <div className="col-span-3 text-center py-8">
              <h1 className="text-xl text-neutral-500">
                No posts to display yet
              </h1>
              <p className="text-neutral-400 mt-2">
                Share your first post to get started!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
