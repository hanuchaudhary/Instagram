import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link, UserCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import FollowersDrawer from "./FollowersDrawer";
import { useProfileStore, UserType } from "@/store/UserStore/useProfileStore";
import { DeactivateAccountDialog } from "../DeactivateAccount";
import EditProfile from "./EditProfile";

export default function ProfileCard() {
  const navigate = useNavigate();
  const { fetchProfile, profile } = useProfileStore();

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/auth/signin");
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 md:px-40 shadow-md rounded-lg">
      <div className="flex gap-5 md:w-96">
        <Avatar className="h-24 w-24 md:h-32 md:w-32">
          <AvatarImage
            className="object-cover"
            src={profile.avatar}
            alt={profile.fullName}
          />
          <AvatarFallback className="text-2xl uppercase font-bold">
            <UserCircle className="fill-neutral-400 h-16 w-16 md:h-20 md:w-20 text-neutral-400" />
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col items-start gap-4 w-full">
          <h1 className="text-xl md:text-2xl font-bold">{profile.username}</h1>
          <div className="flex gap-2">
            <EditProfile profileData={profile} />
            <Button onClick={handleLogout} size="sm" variant="outline">
              Logout
            </Button>
            <DeactivateAccountDialog />
          </div>
        </div>
      </div>
      <ProfileStats {...profile} />
      <ProfileInfo {...profile} />
    </div>
  );
}

function ProfileStats(profile: UserType) {
  return (
    <div className="flex items-start gap-4 md:gap-6 text-base md:text-lg">
      <span>
        <strong className="font-semibold text-lg md:text-xl">
          {profile._count.posts}
        </strong>{" "}
        Posts
      </span>
      <span className="flex gap-1">
        <strong className="text-lg md:text-xl">
          {profile._count.followers}
        </strong>{" "}
        <FollowersDrawer />
      </span>
      <span>
        <strong className="text-lg md:text-xl">
          {profile._count.following}
        </strong>{" "}
        Following
      </span>
    </div>
  );
}

function ProfileInfo(profile: UserType) {
  return (
    <div className="space-y-2">
      <div className="flex items-start gap-2">
        <h2 className="font-semibold">{profile.fullName}</h2>
        <Badge className="capitalize font-semibold">
          {profile.accountType}
        </Badge>
      </div>
      <p className="text-sm text-neutral-500 font-semibold">{profile.bio}</p>
      <div className="flex items-center gap-1 text-blue-500">
        <Link size={16} />
        <a
          href="https://github.com/hanuchaudhary"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm hover:underline"
        >
          github.com/hanuchaudhary
        </a>
      </div>
    </div>
  );
}
