import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Link } from "lucide-react"

const ProfileCard = () => {
  return (
    <div className="flex flex-col items-center sm:flex-row sm:items-start sm:gap-8 md:gap-12 lg:gap-20 p-4">
      <div className="mb-4 sm:mb-0">
        <Avatar className="h-24 w-24 sm:h-32 sm:w-32 md:h-40 md:w-40">
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
      <div className="text-center sm:text-left">
        <div className="flex flex-col sm:flex-row gap-3 items-center sm:items-start mb-4">
          <h1 className="text-xl mb-2 sm:mb-0">Username.1</h1>
          <div className="flex gap-2">
            <Button size="sm" className="w-full sm:w-auto">Edit Profile</Button>
            <Button size="sm" className="w-full sm:w-auto">View Archive</Button>
          </div>
        </div>
        <div className="flex justify-center sm:justify-start items-center gap-4 sm:gap-10 py-4">
          <h2 className="text-sm">
            <span className="font-semibold">4</span> Posts
          </h2>
          <h2 className="text-sm">
            <span className="font-semibold">77</span> Followers
          </h2>
          <h2 className="text-sm">
            <span className="font-semibold">87</span> Following
          </h2>
        </div>
        <div className="mt-4">
          <h2 className="font-semibold">Kush Chaudhary</h2>
          <p className="text-sm mt-1">Learning Everything | Coding | Dev</p>
          <div className="flex items-center justify-center sm:justify-start gap-1 text-blue-900 font-semibold text-sm mt-2">
            <Link size={15}/>
            <a href="https://github.com/hanuchaudhary" target="_blank" rel="noopener noreferrer" className="hover:underline">
              github.com/hanuchaudhary
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileCard