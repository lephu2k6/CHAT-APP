import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  // useChatStore.js
getMessages: async (userId) => {
    console.log('🔄 Getting messages for user:', userId);
    if (!userId) {
      console.warn('❌ No user ID provided');
      return;
    }
    
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      console.log('📦 API Response:', res.data);
      
      let messagesData = res.data;
      
      // Xử lý các định dạng response khác nhau
      if (messagesData && typeof messagesData === 'object') {
        // Nếu là object có thuộc tính messages hoặc Message
        if (messagesData.messages && Array.isArray(messagesData.messages)) {
          messagesData = messagesData.messages;
        } else if (messagesData.Message && Array.isArray(messagesData.Message)) {
          messagesData = messagesData.Message;
        } 
        // Nếu là object thông thường, convert thành array
        else if (!Array.isArray(messagesData)) {
          messagesData = Object.values(messagesData);
        }
      }
      
      // Nếu là nested array [Array(28)]
      if (Array.isArray(messagesData) && messagesData.length > 0 && Array.isArray(messagesData[0])) {
        messagesData = messagesData[0];
      }
      
      // Đảm bảo luôn là array
      if (!Array.isArray(messagesData)) {
        console.warn('⚠️ Messages data is not array, setting to empty array');
        messagesData = [];
      }
      
      console.log('✅ Final messages array:', messagesData);
      set({ messages: messagesData });
      
    } catch (error) {
      console.error('❌ Error getting messages:', error);
      toast.error(error.response?.data?.message || "Lỗi khi lấy tin nhắn");
      set({ messages: [] });
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;

      set({
        messages: [...get().messages, newMessage],
      });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));

//by deepseek huhu :((