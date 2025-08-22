import {create} from 'zustand'
import {axiosInstance} from '../lib/axios'

import { Toaster, toast } from 'react-hot-toast';
import {io} from 'socket.io-client'


const BASE_URI = "http://localhost:3000"
export const useAuthStore = create((set , get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn : false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    onlineUsers: [] , 
    socket : null ,


    checkAuth : async () => {
        try {
            const res = await axiosInstance.get('/auth/check')
            console.log(res.data) 
            set({authUser : res.data})
            get().connectSocket()
        }catch(err) {
            console.log(err)
            set({authUser : null})
        }finally{
            set({isCheckingAuth: false})
        }
    },
    signup: async (formData) => {
        set({ isSigningUp: true });
    try {
        const res = await axiosInstance.post('/auth/signup', formData);
        set({ authUser: res.data });
    } catch (err) {
        console.error('Signup error:', err.response?.data || err.message);
        throw err;
    } finally {
        set({ isSigningUp: false });
    }
    },
    
    logout: async () => {
        try {
            await axiosInstance.post('/auth/logout')
            set({authUser : null})
            toast.success ('Logout thanh cong')
            get().disconnectSocket()
        }catch(err) {
            console.log(err)
            throw err 
        }
    },
    login: async (formData) => {
        try {

            const res = await axiosInstance.post('/auth/login',formData)
            if(res) {
                set({authUser : res.data})
            }
            get().connectSocket()
        }catch(err) {
            console.log(err)
            toast.error('debug nhé cu')
        }
    },
    updateProfile:  async (data) => {
        try {
            set({isUpdatingProfile : true})
            const res = await axiosInstance.put('/auth/update-profile' , data)
            
            set({authUser : res.data})
            toast.success ('thành công update rồi he!')
        }catch(err){
            console.log(err)
            
        }
        finally {
            set({isUpdatingProfile : false})
        }
    },
    connectSocket: async () => {
        const {authUser} = get()
        if(!authUser || get().socket?.connected) return 
        const socket = io(BASE_URI , {
            query: {
                userId: authUser._id
            },
            transports: ['websocket'],
            withCredentials: true
        });
        socket.connect()
        set({socket: socket})
        socket.on('getOnlineUsers', (users) => {
            set({onlineUsers: users})
        });
    },
    disconnectSocket: async () => {
        if (get().socket?.connected) get().socket.disconnect()
    }
    


}))