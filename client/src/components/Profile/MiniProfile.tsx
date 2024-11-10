import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { MapPin } from "lucide-react";

interface MiniProfileProps {
  username: string;
  fullName: string;
  avatar: string;
  bio: string;
  location: string;
}

const MiniProfile = ({
  username,
  fullName,
  avatar,
  bio,
  location,
}: MiniProfileProps) => {
  const navigate = useNavigate();
  const path = `/`;
  const storedUser = localStorage.getItem('user');
  const loggedInUser = storedUser ? JSON.parse(storedUser) : null;
  const loggedInUsername = loggedInUser?.username;
  
  const handleViewProfile = () => {
    navigate(`/user/${username}`);
  };

  if (username === loggedInUsername) {
    return (
      <div className="flex items-center gap-2 cursor-pointer">
        <Avatar className="h-8 w-8">
          <AvatarImage className="object-cover" src={avatar} alt={username} />
          <AvatarFallback>{username[0]?.toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-sm font-semibold">{username}</span>
          {path === "/" ? (
            !location || location === "" ? (
              <h1 className="text-xs text-neutral-400">{fullName}</h1>
            ) : (
              <div className="items-center flex text-neutral-400">
                <MapPin className="h-3 w-3" />
                <p className="text-xs ">{location}</p>
              </div>
            )
          ) : (
            <h1 className="text-xs text-neutral-400">{fullName}</h1>
          )}
        </div>
      </div>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex items-center gap-2 cursor-pointer">
          <Avatar className="h-8 w-8">
            <AvatarImage className="object-cover" src={avatar} alt={username} />
            <AvatarFallback>{username[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">{username}</span>
            {path === "/" ? (
              !location || location === "" ? (
                <h1 className="text-xs text-neutral-400">{fullName}</h1>
              ) : (
                <div className="items-center flex text-neutral-400">
                  <MapPin className="h-3 w-3" />
                  <p className="text-xs ">{location}</p>
                </div>
              )
            ) : (
              <h1 className="text-xs text-neutral-400">{fullName}</h1>
            )}
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <div className="flex flex-col items-center gap-4 p-4">
          <Avatar className="h-24 w-24">
            <AvatarImage className="object-cover" src={avatar} alt={username} />
            <AvatarFallback>{username[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="text-center">
            <h2 className="text-xl font-bold">{username}</h2>
            <p className="text-neutral-400">{fullName}</p>
            <p className="mt-2 text-sm ">{bio}</p>
            <Button
              onClick={handleViewProfile}
              className="mt-4 w-full"
              variant="blue"
            >
              View Full Profile
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MiniProfile;
