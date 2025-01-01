"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, ChevronLeft, ChevronRight } from "lucide-react";
import { useChatStore } from "@/store/ChatStore/useChatStore";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import SidebarSkeleton from "./SidebarSkeleton";

const Sidebar = () => {
  const {
    fetchChatUsers,
    chatUsers,
    selectedUser,
    setSelectedUser,
    isChatUsersLoading,
    onlineUsers,
  } = useChatStore();

  console.log("Online users", onlineUsers);
  

  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const filteredUsers = showOnlineOnly
    ? chatUsers.filter((user) => onlineUsers.includes(user.id as string))
    : chatUsers;

  useEffect(() => {
    fetchChatUsers();
  }, [fetchChatUsers]);

  if (isChatUsersLoading) return <SidebarSkeleton />;

  return (
    <div className="flex h-full border-r border-border">
      <AnimatePresence initial={false}>
        {!isCollapsed && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "20rem", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-80 flex flex-col"
          >
            <div className="border-b border-border p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  <span className="font-medium">Contacts</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsCollapsed(true)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Show online only
                </label>
                <Switch
                  checked={showOnlineOnly}
                  onCheckedChange={setShowOnlineOnly}
                />
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                {onlineUsers.length - 1} online
              </div>
            </div>
            <ScrollArea className="flex-1 p-1">
              {filteredUsers.map((user) => (
                <Button
                  variant={"ghost"}
                  key={user.id}
                  className={`w-full justify-start px-2 py-7 mb-1 ${
                    selectedUser?.id === user.id ? "bg-accent" : ""
                  }`}
                  onClick={() => setSelectedUser(user)}
                >
                  <Avatar className="h-12 w-12 mr-2">
                    <AvatarImage
                      className="object-cover"
                      src={user.avatar || "/user.svg"}
                      alt={user.fullName}
                    />
                    <AvatarFallback>{user.fullName[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start overflow-hidden">
                    <span className="font-medium truncate w-full">
                      {user.fullName}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {onlineUsers.includes(user.id as string)
                        ? "Online"
                        : "Offline"}
                    </span>
                  </div>
                  {onlineUsers.includes(user.id as string) && (
                    <div className="ml-auto w-2 h-2 rounded-full bg-green-500" />
                  )}
                </Button>
              ))}
              {filteredUsers.length === 0 && (
                <div className="text-muted-foreground flex items-center justify-center h-full py-4">
                  <p className="text-sm px-10 text-center">
                    {showOnlineOnly
                      ? "No online users found. Try following more users to see them here."
                      : "No users found. Follow more users to start chatting with them."}
                  </p>
                </div>
              )}
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>
      <div
        className={`flex flex-col items-center py-4 ${
          isCollapsed ? "md:w-20 md: md:px-0 px-2" : "w-0"
        } overflow-hidden transition-all duration-300 ease-in-out`}
      >
        <Button
          variant="ghost"
          size="sm"
          className="mb-4"
          onClick={() => setIsCollapsed(false)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        {filteredUsers.map((user) => (
          <motion.button
            whileHover={{ scale: 1.05 }}
            key={user.id}
            className={`relative mb-2`}
            onClick={() => setSelectedUser(user)}
          >
            <Avatar
              className={`md:h-14 md:w-14 ${
                selectedUser?.id === user.id
                  ? onlineUsers.includes(selectedUser?.id as string)
                    ? "ring-2 ring-green-500"
                    : "ring-2 ring-neutral-400"
                  : ""
              }`}
            >
              <AvatarImage
                className="object-cover"
                src={user.avatar || "/user.svg"}
                alt={user.fullName}
              />
              <AvatarFallback>{user.fullName[0]}</AvatarFallback>
            </Avatar>
            {onlineUsers.includes(user.id as string) && (
              <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-green-500 ring-2 ring-background" />
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
