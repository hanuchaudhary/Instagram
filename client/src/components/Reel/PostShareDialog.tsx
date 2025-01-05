import { useState } from "react";
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
import { useSendPostStore } from "@/store/PostsStore/useSendPostStore";
import { useFollowDataStore } from "@/store/UserStore/useFollowStore";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";

const PostShareDialog = ({ postURL }: { postURL: string }) => {
  const [open, setOpen] = useState(false);
  const [filterUser, setFilterUser] = useState("");
  const { sendPost, isSendingPost } = useSendPostStore();
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const { followers, following } = useFollowDataStore();
  const users = [...following, ...followers].map((user) => ({
    user: {
      id: user.user.id,
      username: user.user.username,
      avatar: user.user.avatar,
    },
  }));

  const handleSelectUsers = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleShare = () => {
    console.log(`Sharing with user ids: ${selectedUsers.join(", ")}`);
    sendPost(selectedUsers.join(", "), postURL);
    setSelectedUsers([]);
    setOpen(false);
  };

  const filteredUsers = filterUser
    ? users.filter((user) => {
        user.user.username.includes(filterUser);
        console.log(user.user.username);
      })
    : users;

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
            {filteredUsers.map(({ user }) => (
              <UserCard
                key={user.id}
                user={user}
                isSelected={selectedUsers.includes(user.id)}
                onClick={() => handleSelectUsers(user.id)}
              />
            ))}
          </div>
        </ScrollArea>
        <>
          <Button
            disabled={selectedUsers.length <= 0}
            className="w-full mt-4"
            onClick={handleShare}
          >
            {isSendingPost ? (
              "Sending..."
            ) : (
              <div className="flex items-center justify-center">
                Share <Send />
              </div>
            )}
          </Button>
          <Button
            disabled={selectedUsers.length <= 0 || isSendingPost}
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
  user,
  isSelected,
  onClick,
}: {
  user: { id: string; username: string; avatar: string };
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
      <AvatarImage
        className="object-cover"
        src={user.avatar}
        alt={user.username}
      />
      <AvatarFallback className="dark:bg-neutral-900 bg-neutral-200">
        {user.username[0].toUpperCase()}
      </AvatarFallback>
    </Avatar>
    <p className="text-sm text-muted-foreground">@{user.username}</p>
  </div>
);

export default PostShareDialog;
