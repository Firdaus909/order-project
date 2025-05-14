import { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { Link } from 'react-router';
import { Eye, EyeOff } from 'lucide-react';

const ResetPassword = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { data: user } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();

    if (!user) {
      alert('Username does not exist!');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    const { error: updateError } = await supabase
      .from('users')
      .update({
        password: password,
      })
      .eq('username', username);

    if (updateError) {
      alert(`Error resetting password: ${updateError.message}`);
      return;
    }

    alert('Password reset successfully!');
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
      <div className='w-full max-w-md p-8 bg-white rounded-lg shadow-md'>
        <h1 className='mb-6 text-2xl font-bold text-center text-gray-800'>
          Reset Password
        </h1>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <input
            type='text'
            placeholder='Username'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
          <div className='relative'>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder='Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
            <button
              type='button'
              onClick={() => setShowPassword(!showPassword)}
              className='absolute inset-y-0 right-3 flex items-center text-gray-500 focus:outline-none'>
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <input
            type='password'
            placeholder='Confirm new password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
          <button
            type='submit'
            className='w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200'>
            Reset Password
          </button>
        </form>
      </div>
        <div className='flex justify-center mt-4'>
          <Link to='/login' className='text-blue-500 hover:underline'>
            Back to Login
          </Link>
        </div>
    </div>
  );
};

export default ResetPassword;
