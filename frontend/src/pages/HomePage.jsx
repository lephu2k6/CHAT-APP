import React from 'react';
import Sidebar from '../components/Sidebar';
import NoChatSelected from '../components/NoChatSelected';
import { useChatStore } from '../store/useChatStore';
import ChatContainer from '../components/ChatContainer';

const HomePage = () => {
  const { selectedUser } = useChatStore();

  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-lg w-full max-w-6xl flex h-[calc(100vh-5rem)] overflow-hidden">
          
          <Sidebar />

          
          <div className="flex-1 h-full">
            {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
