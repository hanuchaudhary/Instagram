import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useProfileStore } from "@/store/UserStore/useProfileStore";
import { useAuthStore } from "@/store/AuthStore/useAuthStore";
import { useNavigate } from "react-router-dom";
import PageLoader from "@/components/PageLoader";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { profile, fetchProfile,isFetchingProfile } = useProfileStore();

  React.useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);
  const { logout } = useAuthStore();

  if (isFetchingProfile) {
    return <PageLoader/>;
  }

  return (
    <header className="bg-card text-card-foreground shadow-sm border-b ">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-xl">Admin Dashboard</h2>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    className="object-cover"
                    src={profile.avatar}
                    alt="@shadcn"
                  />
                  <AvatarFallback className="uppercase">
                    {profile.username[0]}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {profile.username}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {profile.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  logout(navigate);
                }}
              >
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
