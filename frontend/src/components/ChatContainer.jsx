// ChatContainer.jsx
import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef } from "react";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import { useAuthStore } from "../store/useAuthStore";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();

  const { authUser } = useAuthStore();
  const messagesContainerRef = useRef(null);

  const formatMessageTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Lấy tin nhắn khi chọn user
  useEffect(() => {
    if (selectedUser && selectedUser._id) {
      getMessages(selectedUser._id);
      subscribeToMessages();
      return () => unsubscribeFromMessages();
    }
  }, [selectedUser]);

  // Scroll xuống cuối khi có tin nhắn mới
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const messageArray = Array.isArray(messages) ? messages : [];

  if (!selectedUser) {
    return (
      <div className="flex-1 flex flex-col h-screen">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-gray-500 p-4">
            <div className="text-2xl mb-2">💬</div>
            <p>Chưa chọn người chat</p>
            <p className="text-sm mt-1">Hãy chọn một người từ danh sách để bắt đầu trò chuyện</p>
          </div>
        </div>
      </div>
    );
  }

  if (isMessagesLoading) {
    return (
      <div className="flex flex-col h-screen">
        <ChatHeader />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="loading loading-spinner loading-lg mb-2"></div>
            <p>Đang tải tin nhắn...</p>
          </div>
        </div>
        <div className="p-4 border-t bg-white">
          <MessageInput />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <ChatHeader />

      {/* Message list */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 pb-20"
      >
        {messageArray.length === 0 ? (
          <div className="text-center text-gray-500 mt-20">
            <div className="text-4xl mb-4">💭</div>
            <p className="text-lg font-medium">Chưa có tin nhắn nào</p>
            <p className="text-sm">Hãy gửi lời chào để bắt đầu cuộc trò chuyện!</p>
          </div>
        ) : (
          messageArray.map((message) => (
            <div
              key={message._id || `msg-${message.createdAt}-${Math.random()}`}
              className={`flex ${message.senderId === authUser._id ? "justify-end" : "justify-start"}`}
            >
              <div className={`flex max-w-xs ${message.senderId === authUser._id ? "flex-row-reverse" : "flex-row"} items-end gap-2`}>
                {/* Avatar */}
                <div className="avatar">
                  <div className="w-10 h-10 rounded-full border-2 border-white">
                    <img
                      src={
                        message.senderId === authUser._id
                          ? authUser.profilePic || "/avatar.png"
                          : selectedUser.profilePic || "/avatar.png"
                      }
                      alt="avatar"
                      onError={(e) => { e.target.src = "/avatar.png"; }}
                    />
                  </div>
                </div>

                {/* Bubble tin nhắn */}
                <div className={`flex flex-col ${message.senderId === authUser._id ? "items-end" : "items-start"}`}>
                  <div className={`px-4 py-2 rounded-2xl ${
                    message.senderId === authUser._id
                      ? "bg-blue-500 text-white rounded-br-none"
                      : "bg-white text-gray-900 rounded-bl-none border border-gray-200"
                  }`}>
                    {message.image && (
                      <img
                        src={message.image}
                        alt="Attachment"
                        className="rounded-lg max-w-[200px] mb-2"
                        onError={(e) => { e.target.style.display = "none"; }}
                      />
                    )}
                    {message.text && <p className="break-words">{message.text}</p>}
                    <div className={`text-xs mt-1 ${message.senderId === authUser._id ? "text-blue-100" : "text-gray-500"}`}>
                      {formatMessageTime(message.createdAt)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input dính dưới */}
      <div className="sticky bottom-0 p-4 border-t bg-white">
        <MessageInput />
      </div>
    </div>
  );
};

export default ChatContainer;
