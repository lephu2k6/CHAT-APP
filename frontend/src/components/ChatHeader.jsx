import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { ArrowLeft, Phone, Video, MoreVertical } from "lucide-react";

const ChatHeader = () => {
  const { selectedUser, setSelected } = useChatStore();
  const { onlineUsers } = useAuthStore();

  if (!selectedUser) return null;

  const isOnline = onlineUsers.includes(selectedUser._id);
    const handleBackClick = () => {
        setSelected(null);
    };
    
  

  return (
    <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-white">
      
      <div className="flex items-center space-x-3">
        
        <button
          className="lg:hidden p-2 rounded-full hover:bg-gray-100"
          onClick={() => setSelected(null)}
        >
          <ArrowLeft size={20} />
        </button>

        {/* Avatar */}
        <div className="relative">
          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-semibold">
            {selectedUser?.name?.charAt(0)?.toUpperCase() || "?"}
          </div>
          {/* Online indicator */}
          {isOnline && (
            <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-white rounded-full"></span>
          )}
        </div>

        {/* User Info */}
        <div>
          <h3 className="text-sm font-medium text-gray-900">
            {selectedUser?.fullName || "Unknown User"}
          </h3>
          <p className="text-xs text-gray-500">
            {isOnline ? "online" : "Offline"}
          </p>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center space-x-3 text-gray-600">
        <button className="p-2 rounded-full hover:bg-gray-100">
          <Phone size={18} />
        </button>
        <button className="p-2 rounded-full hover:bg-gray-100">
          <Video size={18} />
        </button>
        <button className="p-2 rounded-full hover:bg-gray-100">
          <MoreVertical size={18} />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
