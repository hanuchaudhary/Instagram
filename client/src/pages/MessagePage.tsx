import { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import axios from "axios";
import TypingLoader from "@/components/TypingLoader";
import { Menu, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useFollowDataStore } from "@/store/UserStore/useFollowDataStore";
import { getAuthHeaders } from "@/store/AuthHeader/getAuthHeaders";

interface User {
  id: string;
  username: string;
  avatar?: string;
}

interface Message {
  id?: number;
  message: string;
  senderId: string;
  receiverId: string;
  createdAt?: string;
}

const MessagePage = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { following, fetchFollowData } = useFollowDataStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const chatUsers = [...following];
  const WebSocketUrl = "http://localhost:8080";
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  const { userId, username, avatar } = getAuthHeaders();

  const isCurrentUserMessage = (message: Message) => {
    return message.senderId === userId;
  };

  const isUserOnline = (userId: string) => {
    return onlineUsers.includes(userId);
  };

  const roomId = selectedUser ? [userId, selectedUser.id].sort().join("-") : "";

  // Fetch messages from db
  useEffect(() => {
    fetchFollowData();
    const fetchMessages = async () => {
      if (!selectedUser) return;
      try {
        const res = await axios.get(
          `${WebSocketUrl}/api/chat/${userId}/${selectedUser.id}`
        );
        setMessages(res.data);
      } catch (err) {
        setError("Failed to fetch messages");
      }
    };

    fetchMessages();
  }, [selectedUser, userId, WebSocketUrl, fetchFollowData]);

  // Connect to socket
  useEffect(() => {
    if (!roomId) return;
    const newSocket = io(WebSocketUrl);
    setSocket(newSocket);

    newSocket.emit("roomId", roomId);
    newSocket.emit("user online", userId);

    newSocket.on("receive message", (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    newSocket.on("typing", (username: string) => {
      setTypingUser(username);
    });

    newSocket.on("stopTyping", () => {
      setTypingUser(null);
    });

    newSocket.on("user status", ({ userId, status }) => {
      setOnlineUsers((prev) =>
        status === "online"
          ? [...prev, userId]
          : prev.filter((id) => id !== userId)
      );
    });

    return () => {
      newSocket.off("receive message");
      newSocket.off("typing");
      newSocket.off("stopTyping");
      newSocket.off("user status");
      newSocket.disconnect();
    };
  }, [WebSocketUrl, roomId, userId]);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Select user from chatUsers
  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
  };

  // Handle typing
  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);

    if (!socket || !selectedUser) return;

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Emit typing event with room ID and username
    socket.emit("typing", { roomId, username: username });

    // Set new timeout to emit stop typing
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stopTyping", roomId);
    }, 800);
  };

  // Send message
  const handleSendMessage = () => {
    if (!selectedUser || !newMessage.trim() || !socket) return;

    const messageData = {
      message: newMessage,
      senderId: userId,
      receiverId: selectedUser.id,
      createdAt: new Date().toISOString(),
      roomId,
    };

    socket?.emit("send message", messageData);
    socket?.emit("stopTyping", roomId);
    setNewMessage("");
  };

  return (
    <div className="flex h-screen relative">
      {/* Mobile Menu Button */}
      <Button
        variant="outline"
        size="icon"
        className="fixed lg:top-4 lg:left-4 top-2 left-2 md:hidden z-50"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </Button>

      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 absolute md:relative md:translate-x-0 z-40 bg-background w-full md:w-1/3 border-r border-border h-full`}
      >
        <div className="p-4 flex flex-col h-full">
          <Input
            type="text"
            placeholder="Search users..."
            className="mb-4 mt-12 md:mt-0"
          />
          <ScrollArea className="flex-1">
            {chatUsers.length > 0 ? (
              chatUsers.map((user) => (
                <div
                  key={user.user.id}
                  className={`p-3 mb-1 cursor-pointer dark:hover:bg-neutral-900 hover:bg-neutral-100 transition-colors duration-300 rounded-lg ${
                    selectedUser?.id === user.user.id ? "bg-muted" : ""
                  }`}
                  onClick={() => {
                    handleSelectUser(user.user);
                    // Close sidebar on mobile after selecting a user
                    if (window.innerWidth < 768) {
                      setIsSidebarOpen(false);
                    }
                  }}
                >
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Avatar>
                        <AvatarImage
                          className="object-cover"
                          src={user.user.avatar || ""}
                          alt={user.user.username || "username"}
                        />
                        <AvatarFallback>
                          {user.user.username.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      {isUserOnline(user.user.id) && (
                        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{user.user.username || "username"}</h3>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-secondary p-4 rounded-lg">
                <h1 className="text-neutral-400 text-center">
                  Follow users to start chat
                </h1>
              </div>
            )}
          </ScrollArea>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            <div className="p-2 lg:block fixed top-0 w-full bg-popover z-10 lg:p-4 lg:pl-3 pl-14 border-b border-border">
              <div className=" flex items-center gap-2">
                <h2 className="lg:text-xl font-semibold flex items-center gap-2">
                  <Avatar>
                    <AvatarImage className="object-cover">
                      {selectedUser.avatar || ""}
                    </AvatarImage>
                    <AvatarFallback className="font-semibold uppercase">
                      {selectedUser.username[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                  {selectedUser.username || "username"}
                </h2>
                {isUserOnline(selectedUser.id) && (
                  <Badge className="bg-green-400 text-green-950 font-semibold">
                    Online
                  </Badge>
                )}
              </div>
            </div>
            <ScrollArea className="flex-1 p-4">
              <div className="text-neutral-500 text-center font-semibold text-xs pt-14 pb-4">
                You are messaging To {selectedUser.username}
              </div>
              {error && (
                <div className="mb-4 p-2 bg-destructive/10 text-destructive text-center rounded">
                  {error}
                </div>
              )}
              {messages.length > 0 ? (
                messages.map((message, index) => (
                  <div
                    key={message.id || index}
                    className={`flex mb-2 ${
                      isCurrentUserMessage(message)
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`flex items-center gap-2 max-w-xs ${
                        isCurrentUserMessage(message)
                          ? "flex-row-reverse text-right"
                          : "text-left"
                      }`}
                    >
                      <Avatar>
                        <AvatarImage
                          className="object-cover"
                          src={
                            isCurrentUserMessage(message)
                              ? avatar
                              : selectedUser.avatar
                          }
                          alt={
                            isCurrentUserMessage(message)
                              ? username
                              : selectedUser.username
                          }
                        />
                        <AvatarFallback>
                          {isCurrentUserMessage(message)
                            ? username.charAt(0)
                            : selectedUser.username.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={`inline-block p-2 rounded-lg ${
                          isCurrentUserMessage(message)
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <div className="font-semibold flex items-end gap-2">
                          <span>{message.message}</span>
                          <span className="text-[10px] text-neutral-500">
                            {message.createdAt &&
                              new Date(message.createdAt).toLocaleTimeString(
                                "en-US",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: true,
                                }
                              )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-muted-foreground">
                  No messages yet
                </div>
              )}
              <div ref={messagesEndRef} />
            </ScrollArea>
            {typingUser && (
              <div className="px-4 py-2 bg-transparent bg-opacity-0">
                <TypingLoader />
              </div>
            )}
            <div className="p-4 border-t border-border">
              <div className="flex gap-2">
                <Input
                  type="text"
                  className="flex-1"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={handleTyping}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <Button onClick={handleSendMessage}>Send</Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            Select a user to start chatting
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagePage;
