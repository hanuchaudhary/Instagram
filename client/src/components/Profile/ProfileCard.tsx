import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Link } from "lucide-react"
import EditProfile from "./EditProfile"
import { useNavigate } from "react-router-dom"

const ProfileCard = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/auth/signin");
  };

  return (
    <div className="flex flex-row items-start gap-4 sm:gap-8 md:gap-12 lg:gap-20 p-4">
      <div>
        <Avatar className="h-20 w-20 sm:h-32 sm:w-32 md:h-40 md:w-40">
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
      <div className="flex-1">
        <div className="flex flex-row flex-wrap gap-3 items-center mb-4">
          <h1 className="text-xl">Username.1</h1>
          <div className="flex gap-2">
            <EditProfile />
            <Button onClick={handleLogout} size="sm" variant="destructive">Logout</Button>
          </div>
        </div>
        <div className="flex items-center gap-4 sm:gap-10 py-4">
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
          <div className="flex items-center gap-1 text-blue-900 font-semibold text-sm mt-2">
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