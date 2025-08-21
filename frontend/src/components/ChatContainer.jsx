import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";

const ChatContainer = () => {
  const { messages, getMessages, isMessagesLoading, selectedUser ,subcribeToMessages,unsubscribeFromMessages} = useChatStore();
  const { authUser } = useAuthStore();

  useEffect (() => {
    getMessages(selectedUser._id)
    subcribeToMessages() 
    return () => {
      unsubscribeFromMessages();
    };
  } , [selectedUser._id , getMessages, subcribeToMessages, unsubscribeFromMessages]);

    // Kiểm tra xem selectedUser có hợp lệ không
    

  const safeMessages = Array.isArray(messages?.Message) ? messages.Message : [];

  if (!selectedUser) {
    return <div className="text-center mt-4">Chưa chọn người chat</div>;
  }

  if (isMessagesLoading) {
    return <div className="text-center mt-4">Loading...</div>;
  }

  // Hàm format ngày giờ
  const formatDateTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <ChatHeader />

      {/* Danh sách tin nhắn */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        {safeMessages.map((msg) => (
          <div
            key={msg._id}
            className={`flex ${msg.senderId === authUser._id ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`px-4 py-2 rounded-2xl max-w-xs break-words ${
                msg.senderId === authUser._id
                  ? "bg-blue-500 text-white rounded-br-none"
                  : "bg-gray-200 text-gray-900 rounded-bl-none"
              }`}
            >
              {/* Text */}
              {msg.text && <p>{msg.text}</p>}

              {/* Image */}
              {msg.image && (
                <img
                  src={msg.image}
                  alt="sent"
                  className="mt-2 rounded-lg max-h-60 w-full object-cover"
                />
              )}

              {/* Ngày giờ */}
              <div className="text-[10px] text-gray-400 mt-1 text-right">
                {formatDateTime(msg.createdAt)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Ô nhập tin nhắn */}
      <div className="border-t p-2">
        <MessageInput />
      </div>
    </div>
  );
};

export default ChatContainer;
