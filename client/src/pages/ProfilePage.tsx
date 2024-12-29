import ProfileCard from "@/components/Profile/ProfileCard";
import { Separator } from "@/components/ui/separator";
import ProfilePagePostCard from "@/components/Profile/ProfilePagePostCard";
import { useProfileStore } from "@/store/UserStore/useProfileStore";
import { useEffect, useState } from "react";
import ProfilePostPopup from "@/components/Profile/ProfilePostPopup";

const ProfilePage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const { fetchProfile, profile } = useProfileStore();

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const posts = profile.posts;

  const handleClose = () => {
    setIsOpen(false);
    setSelectedPostId(null);
  };

  useEffect(() => {
    window.addEventListener("keydown", handleClose);
    return () => window.removeEventListener("keydown", close);
  }, []);

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
                  className="cursor-pointer"
                  key={post.id}
                  onClick={() => {
                    setSelectedPostId(post.id!);
                    setIsOpen(true);
                  }}
                >
                  <ProfilePagePostCard post={post} />
                </div>
              ))}
              <ProfilePostPopup
                handleClose={handleClose}
                isOpen={isOpen}
                postId={selectedPostId!}
              />
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
