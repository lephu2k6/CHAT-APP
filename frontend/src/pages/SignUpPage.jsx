import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Toaster, toast } from 'react-hot-toast';

const SignUpPage = () => {
  const { signup, isSigningUp } = useAuthStore();
  const [showPassword ,setShowPassword ] = useState(false)
  const [formData,setFormData] = useState({
    fullName : '' , 
    password : '' , 
    email : ''
  })
  const validForm = () => {
    if (!formData.fullName.trim()) return toast.error('Vui lòng nhập họ tên');
    if (!formData.email.trim()) return toast.error('Vui lòng nhập email');
    if (!formData.password.trim()) return toast.error('Vui lòng nhập mật khẩu');
    return true;
  };
  const handleChange = (e) => {
    const {name , value} = e.target
    setFormData(prev => ({...prev , [name] : value}))
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    if (validForm()){
      signup(formData)
    }
  }
  return (
    <div className='min-h-screen grid lg:grid-cols-2'>
      <Toaster />
      
      {/* Left side */}
      <div className='bg-blue-500 flex items-center justify-center text-white text-3xl font-bold'>
        <h1>CREATE ACCOUNT EHEHE!!!</h1>
      </div>

      {/* Right side (Signup Form) */}
      <div className='flex items-center justify-center p-8'>
        <form onSubmit={handleSubmit} className='w-full max-w-md'>
          <h2 className='text-2xl font-semibold mb-6'>Sign Up</h2>

          <input
            type='text'
            name='fullName'
            value={formData.fullName}
            onChange={handleChange}
            placeholder='Name'
            className='w-full p-2 border mb-4'
          />

          <input
            type='email'
            name='email'
            value={formData.email}
            onChange={handleChange}
            placeholder='Email'
            className='w-full p-2 border mb-4'
          />

          <input
            type={showPassword ? 'text' : 'password'}
            name='password'
            value={formData.password}
            onChange={handleChange}
            placeholder='Password'
            className='w-full p-2 border mb-4'
          />

          

          <div className='mb-4'>
            <label className='text-sm'>
              <input
                type='checkbox'
                checked={showPassword}
                onChange={() => setShowPassword(prev => !prev)}
                className='mr-2'
              />
              Show Password
            </label>
          </div>

          <button
            type='submit'
            disabled={isSigningUp}
            className='w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700'
          >
            {isSigningUp ? 'Creating...' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;
