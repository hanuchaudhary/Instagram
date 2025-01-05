import { useEffect, useState } from "react";
import { Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import clsx from "clsx";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import { useChatStore } from "@/store/ChatStore/useChatStore";

const PostShareDialog = ({ postURL }: { postURL: string }) => {
  const [open, setOpen] = useState(false);
  const [filterUser, setFilterUser] = useState("");
  const { isSharingPost, sharePost, chatUsers, fetchChatUsers } =
    useChatStore();
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  useEffect(() => {
    // if (chatUsers) return;
    fetchChatUsers();
  }, [fetchChatUsers]);

  const handleSelectUsers = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleShare = () => {
    sharePost({ message: postURL }, selectedUsers.join(","));
    setSelectedUsers([]);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="cursor-pointer" asChild>
        <Send className="w-7 h-7" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl z-[999999] p-2 md:p-6 border-none bg-secondary">
        <DialogHeader>
          <DialogTitle className="text-xl">Share</DialogTitle>
        </DialogHeader>
        <Separator className="bg-primary-foreground" />
        <div>
          <Input
            value={filterUser}
            onChange={(e) => setFilterUser(e.target.value)}
            placeholder="Search for users"
            className="w-full dark:bg-neutral-700 bg-neutral-200"
            type="search"
          />
        </div>
        <ScrollArea className="mt-4 max-h-[60vh] pr-4">
          <div className="grid lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-3 grid-cols-3">
            {chatUsers.map(
              (user) =>
                user.id && (
                  <UserCard
                    key={user.id}
                    avatar={user.avatar!}
                    id={user.id!}
                    username={user.username!}
                    isSelected={selectedUsers.includes(user.id)}
                    onClick={() => handleSelectUsers(user.id!)}
                  />
                )
            )}
          </div>
        </ScrollArea>
        <>
          <Button
            disabled={selectedUsers.length <= 0}
            className="w-full mt-4"
            onClick={handleShare}
          >
            {isSharingPost ? (
              "Sending..."
            ) : (
              <div className="flex items-center justify-center">
                Share <Send />
              </div>
            )}
          </Button>
          <Button
            disabled={selectedUsers.length <= 0 || isSharingPost}
            variant="ghost"
            className="w-full"
            onClick={() => setSelectedUsers([])}
          >
            Clear Selection
          </Button>
        </>
      </DialogContent>
    </Dialog>
  );
};

const UserCard = ({
  avatar,
  username,
  isSelected,
  onClick,
}: {
  id: string;
  username: string;
  avatar: string;
  isSelected: boolean;
  onClick: () => void;
}) => (
  <div
    role="button"
    aria-selected={isSelected}
    tabIndex={0}
    onClick={onClick}
    onKeyDown={(e) => e.key === "Enter" && onClick()}
    className="flex mb-4 flex-col items-center gap-2 cursor-pointer"
  >
    <Avatar
      className={clsx("h-20 w-20", {
        "border-[4px] border-blue-500": isSelected,
      })}
    >
      <AvatarImage className="object-cover" src={avatar} alt={username} />
      <AvatarFallback className="dark:bg-neutral-900 bg-neutral-200">
        {username[0].toUpperCase()}
      </AvatarFallback>
    </Avatar>
    <p className="text-sm text-muted-foreground">@{username}</p>
  </div>
);

export default PostShareDialog;
