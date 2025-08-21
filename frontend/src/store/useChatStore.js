import {create} from 'zustand'
import {axiosInstance} from '../lib/axios'
import { Toaster, toast } from 'react-hot-toast';
import { Socket } from 'socket.io-client';
import { useAuthStore } from './useAuthStore';


export const useChatStore  = create((set,get) => ({
    //state nek 
    messages : [],
    users : [] , 
    selectedUser : null ,
    isUsersLoading : false ,
    isMessagesLoading: false ,
    

    //action
    getUsers : async () => {
        try {
            const res = await axiosInstance.get('/messages/users')
            console.log(res.data)
            set({users : res.data})
        }catch(err){
            toast.error('Get user thất bại')
        }finally{
            set({isUsersLoading : false})
        }

    },
    getMessages: async (userid) => {
        try {
            const res = await axiosInstance.get(`/messages/${userid}`)
            set({messages: res.data})
            
        }catch(err) {
            toast.error('lỗi ngu như bò !!!')
        }finally{
            set({isMessagesLoading: false})
        }
    },
    sendMessage: async (MessageData) => {
        const {selectedUser , messages} = get();
        try {
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}` , MessageData);
            set({messages : [...(Array.isArray(messages) ? messages : []), res.data]});
        }catch(err) {
            console.log(err);
        }
    },
    subcribeToMessages:() => {
        const {selectedUser} = get()
        if(!selectedUser) {
            console.error('No selected user to subscribe to messages');
            return;
        }
        const socket = useAuthStore.getState().socket
        if (!socket) {
            console.error('Socket not initialized');
            return;
        }
        socket.on('newMessage', (message) => {
            set(() => ({
                messages: [...get().messages, newMessage]
            }));
        });
    },
    unsubscribeFromMessages: () => {
        const socket = get().socket
        if (!socket) {
            console.error('Socket not initialized');
            return;
        }
        socket.off('newMessage');
    },
    setSelected: async (selectedUser) => {set({selectedUser})}

}))