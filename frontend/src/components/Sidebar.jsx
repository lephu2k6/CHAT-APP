import { useChatStore } from "../store/useChatStore";
import { useEffect, useState } from "react";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { useAuthStore } from "../store/useAuthStore";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelected, isUsersLoading } = useChatStore();
  const [search, setSearch] = useState("");

  useEffect(() => {
    getUsers(); 
  }, [getUsers]);
  const {onlineUsers} = useAuthStore() ; 

  const userList = Array.isArray(users) ? users : Object.values(users || {});
  console.log(userList)

  
  const filteredUsers = userList.filter((user) =>
    user?.name?.toLowerCase().includes(search.toLowerCase())
  );

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <div className="w-64 h-screen bg-gray-100 border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Chats</h2>
        <p className="text-sm text-gray-500">{userList.length} users</p>
      </div>

      {/* Search */}
      <div className="p-3">
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* Users list */}
      <div className="flex-1 overflow-y-auto">
        {userList.length > 0 ? (
          userList.map((user) => (
            <div
              key={user._id || user.id}
              className={`flex items-center p-3 cursor-pointer hover:bg-gray-200 transition ${
                selectedUser?._id === user._id || selectedUser?.id === user.id
                  ? "bg-blue-100"
                  : "bg-white"
              }`}
              onClick={() => setSelected(user)}
            >
              {/* Avatar */}
              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
                {user?.profilePic?.charAt(0)?.toUpperCase() || "?"}
              </div>

              {/* Info */}
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  {user?.fullName || "Unknown User"}
                </p>
                {/* <p className="text-xs text-gray-500">
                  {user?.email || "No email"}
                </p> */}
              </div>
            </div>
          ))
        ) : (
          <p className="p-4 text-gray-500 text-sm">No users found</p>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
