import ProfileCard from "@/components/Profile/ProfileCard";
import { Separator } from "@/components/ui/separator";
import ProfilePagePostCard from "@/components/Profile/ProfilePagePostCard";
import { useRecoilState } from "recoil";
import { currentProfileState } from "@/store/atoms/profile";

const ProfilePage = () => {
  const profileData = useRecoilState(currentProfileState);
  const posts = profileData[0].posts;

  return (
    <div className="flex flex-col h-full ">
      <div className="w-full flex items-center justify-center mt-10 mb-20">
        <ProfileCard />
      </div>
      <Separator />
      <div className="flex-grow ">
        <div className="w-full md:px-20 grid grid-cols-3 px-3 gap-4 md:gap-3 pb-20 pt-4 md:py-4">
          {posts?.length! > 0 ? (
            posts?.map((post) => <ProfilePagePostCard post={post} />)
          ) : (
            <div>
              <h1>there is no post yet</h1>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
