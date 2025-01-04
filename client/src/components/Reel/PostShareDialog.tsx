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

const PostShareDialog = ({ postURL }: { postURL: string }) => {
  const [open, setOpen] = useState(false);
  const { sendPost } = useSendPostStore();
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
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Send className="w-9 h-9" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl p-2 md:p-6 border-none bg-secondary">
        <DialogHeader>
          <DialogTitle className="text-xl">Share</DialogTitle>
        </DialogHeader>
        <ScrollArea className="mt-4 max-h-[60vh] pr-4">
          <div className="grid lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-3 grid-cols-3">
            {users.map(({ user }) => (
              <UserCard
                key={user.id}
                user={user}
                isSelected={selectedUsers.includes(user.id)}
                onClick={() => handleSelectUsers(user.id)}
              />
            ))}
          </div>
        </ScrollArea>
        {selectedUsers.length > 0 && (
          <>
            <Button className="w-full mt-4" onClick={handleShare}>
              Share <Send />
            </Button>
            <Button
              variant="ghost"
              className="w-full mt-2"
              onClick={() => setSelectedUsers([])}
            >
              Clear Selection
            </Button>
          </>
        )}
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
