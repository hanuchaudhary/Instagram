import { useEffect, useRef } from "react";
import { format } from "date-fns";
import { Loader2, ArrowDownCircle } from 'lucide-react';
import { useChatStore } from "@/store/ChatStore/useChatStore";
import { useAuthStore } from "@/store/AuthStore/useAuthStore";
import { cn } from "@/lib/utils";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

export default function ChatContainer() {
  const {
    messages,
    selectedUser,
    fetchMessages,
    isMessagesLoading,
    subscribeToMessages,
    unSubscribeFromMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const loggedInUserId = authUser?.id;
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMessages();
    subscribeToMessages();

    return () => {
      unSubscribeFromMessages();
    };
  }, [
    fetchMessages,
    selectedUser,
    subscribeToMessages,
    unSubscribeFromMessages,
  ]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const isScrolledToBottom = () => {
    if (scrollAreaRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollAreaRef.current;
      return scrollTop + clientHeight >= scrollHeight - 10;
    }
    return true;
  };

  if (!selectedUser) {
    return (
      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
        <p className="text-lg font-medium">Select a user to start chatting</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-background">
      <ChatHeader />
      <ScrollArea 
        className="flex-1 p-4"
        ref={scrollAreaRef}
      >
        {isMessagesLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full space-y-2">
            <p className="text-muted-foreground text-lg">
              You have no messages with{" "}
              <span className="font-semibold">{selectedUser.fullName}</span>
            </p>
            <p className="text-sm text-muted-foreground">Send a message to start the conversation!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {messages.map((msg, index) => {
              const isFirstMessageOfDay = index === 0 || !isSameDay(new Date(msg.createdAt), new Date(messages[index - 1].createdAt));
              return (
                <div key={msg.id} className="space-y-2">
                  {isFirstMessageOfDay && (
                    <div className="flex justify-center">
                      <div className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full">
                        {format(new Date(msg.createdAt), 'MMMM d, yyyy')}
                      </div>
                    </div>
                  )}
                  <div
                    className={cn(
                      "flex items-end space-x-2",
                      msg.senderId === loggedInUserId ? "justify-end" : "justify-start"
                    )}
                  >
                    {msg.senderId !== loggedInUserId && (
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={selectedUser.avatar} alt={selectedUser.fullName} />
                        <AvatarFallback>{selectedUser.fullName.charAt(0)}</AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={cn(
                        "max-w-[70%] rounded-lg px-4 py-2 text-sm shadow-sm",
                        msg.senderId === loggedInUserId
                          ? "bg-primary text-primary-foreground rounded-br-none"
                          : "bg-accent text-accent-foreground rounded-bl-none"
                      )}
                    >
                      <p className="leading-relaxed">{msg.message}</p>
                      <p className="text-xs opacity-70 mt-1 text-right">
                        {format(new Date(msg.createdAt), 'h:mm a')}
                      </p>
                    </div>
                    {msg.senderId === loggedInUserId && (
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={authUser?.avatar} alt="You" />
                        <AvatarFallback>{authUser?.username.charAt(0)}</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <div ref={messagesEndRef} />
      </ScrollArea>
      {!isScrolledToBottom() && (
        <Button
          variant="outline"
          size="icon"
          className="absolute bottom-20 right-4 rounded-full shadow-md"
          onClick={scrollToBottom}
        >
          <ArrowDownCircle className="h-4 w-4" />
        </Button>
      )}
      <div className="p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <MessageInput />
      </div>
    </div>
  );
}

function isSameDay(date1: Date, date2: Date) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

