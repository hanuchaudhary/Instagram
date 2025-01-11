import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserType } from "@/types/TypeInterfaces";

export default function Story({ user }: { user: UserType }) {
  return (
    <div className="relative select-none w-16 h-16">
      <div className="absolute inset-0 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 rounded-full">
        <div className="absolute inset-[2px] bg-primary-foreground rounded-full"></div>
      </div>

      <Avatar className="absolute select-none inset-[4px] w-[calc(100%-8px)] h-[calc(100%-8px)]">
        <AvatarImage
          src={user.avatar}
          alt={user.username}
          className="object-cover select-none"
        />
        <AvatarFallback className="uppercase">
          {user.username[0]}
        </AvatarFallback>
      </Avatar>
    </div>
  );
}
