
import Navbar from './components/Navbar'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import ProfilePage from './pages/ProfilePage'
import SettingsPage from './pages/SettingsPage'
import HomePage from './pages/HomePage'
import { Toaster , toast } from 'react-hot-toast';

import { BrowserRouter, Routes, Route,Navigate } from 'react-router-dom'
import { useAuthStore  } from './store/useAuthStore'
import { useEffect } from 'react'

import { Loader } from 'lucide-react'
function App() {
  const {checkAuth , authUser,isCheckingAuth,onlineUsers} = useAuthStore()
  useEffect(() => {
    checkAuth() 
  }, [checkAuth])
  if(isCheckingAuth && !authUser){
    return (
      <div className= "flex justify-center items-center h-screen">
         <Loader className="animate-spin w-8 h-8 text-blue-500" />
      </div>
    )
  }
  console.log({onlineUsers})
  return (
    <BrowserRouter>
      <Navbar /> 
      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to='/login'/>} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to = '/' />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to = '/'/>} /> 
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to = '/login'/>} />
        <Route path="/settings" element={<SettingsPage />} />
        
      </Routes>
      <Toaster />
    </BrowserRouter>
  )
}

export default App
