import ChatContainer from "@/components/ChatComponents/ChatContainer";
import NoChatSelected from "@/components/ChatComponents/NoChatSelected";
import Sidebar from "@/components/ChatComponents/Sidebar";
import { useChatStore } from "@/store/ChatStore/useChatStore";
import { useEffect } from "react";

export default function MessagePage() {
  const { selectedUser} = useChatStore();

  const { socketConnect, socketDisconnect } = useChatStore();
  useEffect(() => {
    socketConnect();
    return () => {
      socketDisconnect();
    };
  }, [socketConnect,socketDisconnect]);
  

  return (
    <div className="h-screen">
      <div className="flex h-full rounded-lg overflow-hidden">
        <Sidebar />
        {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
      </div>
    </div>
  );
}
