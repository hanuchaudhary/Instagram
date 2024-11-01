import ProfileCard from "@/components/ProfileCard"
import { Separator } from "@/components/ui/separator"
import UserPost from "@/components/UserPost"

const ProfilePage = () => {
  return (
    <div className="flex flex-col h-full ">
      <div className="w-full flex items-center justify-center mt-10 mb-20">
        <ProfileCard />
      </div>
      <Separator />
      <div className="flex-grow ">
        <div className="w-full md:px-20 grid grid-cols-3 px-3 gap-4 md:gap-3 pb-20 pt-4 md:py-4">
          <UserPost />
          <UserPost />
          <UserPost />
          <UserPost />
          <UserPost />
          <UserPost />
          <UserPost />
          <UserPost />
          <UserPost />
          <UserPost />
          <UserPost />
          <UserPost />
        </div>
      </div>
    </div>
  )
}

export default ProfilePage