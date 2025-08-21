import React, { useState } from 'react';
import { Camera } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectImg , setSelectImg] = useState('https://i.pinimg.com/564x/dd/2d/0a/dd2d0a59ad7e79453110b2968af72d89.jpg')
  
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = async () => {
      const base64img = reader.result
      setSelectImg(base64img)
      await updateProfile({profilePic : base64img})
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Thông tin cá nhân</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Avatar section */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative mb-4">
            <img 
              src={authUser.profilePic || selectImg} 
              alt="Profile" 
              className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
            />
            <label 
              htmlFor="avatar-upload" 
              className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer hover:bg-blue-600 transition"
            >
              <Camera size={16} />
              <input 
                id="avatar-upload" 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleImageUpload}
              />
            </label>
          </div>
          <h2 className="text-xl font-semibold">{authUser?.displayName || "Người dùng"}</h2>
          <p className="text-gray-600">{authUser?.email}</p>
        </div>

        {/* Profile info */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
              <input
                type="text"
                defaultValue={authUser.fullName || ""}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                defaultValue={authUser?.email || ""}
                disabled
                className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
            <input
              type="tel"
              placeholder="Nhập số điện thoại"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
            <textarea
              rows={3}
              placeholder="Nhập địa chỉ"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-6 flex justify-end space-x-3">
          <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition">
            Hủy bỏ
          </button>
          <button 
            
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition disabled:opacity-50"
            disabled={isUpdatingProfile}
          >
            {isUpdatingProfile ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;