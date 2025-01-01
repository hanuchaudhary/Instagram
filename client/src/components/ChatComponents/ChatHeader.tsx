import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { X, MoreVertical } from "lucide-react";
import { useChatStore } from "@/store/ChatStore/useChatStore";

export default function ChatHeader() {
  const { selectedUser, setSelectedUser, onlineUsers } = useChatStore();

  if (!selectedUser) {
    return null;
  }

  const isOnline = onlineUsers.includes(selectedUser.id as string);

  return (
    <div className="flex items-center justify-between px-2 py-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center md:gap-4 gap-1">
        <Avatar className="h-10 w-10">
          <AvatarImage
            className="object-cover"
            src={selectedUser.avatar || "/avatar.png"}
            alt={selectedUser.fullName}
          />
          <AvatarFallback className="uppercase font-semibold">
            {selectedUser.fullName[0]}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <h1 className="font-semibold text-sm md:text-lg">
            {selectedUser.fullName}
          </h1>
          <p className="md:text-sm text-xs text-muted-foreground">
            @{selectedUser.username || "username"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Badge
          variant={isOnline ? "default" : "secondary"}
          className={`select-none ${
            isOnline
              ? "bg-green-500 hover:bg-green-600"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          }`}
        >
          {isOnline ? "Online" : "Offline"}
        </Badge>

        <Separator orientation="vertical" className="h-6" />

        <Button variant="ghost" className="md:block hidden" size="icon">
          <MoreVertical className="h-5 w-5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSelectedUser(null)}
          aria-label="Close chat"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
