import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { supabase } from '../services/supabaseClient';
import { AuthContext } from '../AuthContext';
import { Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const { login } = useContext(AuthContext);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const { data: user } = await supabase
      .from('users')
      .select('attempts, isblocked')
      .eq('username', username)
      .single();

    if (!user) {
      alert(
        'Username not found. Please check your username or register for an account.'
      );
      return;
    }

    if (user.isblocked) {
      alert('Your account is blocked. Please try again after 24 hours.');
      return;
    }

    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .eq('password', password);

    if (data.length > 0) {
      await supabase
        .from('users')
        .update({ attempts: 0 })
        .eq('username', username);
      login(data);
      navigate('/dashboard', { replace: true });
    } else {
      if (user.attempts >= 3) {
        await supabase
          .from('users')
          .update({ isblocked: true, attempts: 0 })
          .eq('username', username);
        alert(
          'Too many login attempts. Your account has been locked for 24 hours.'
        );
        return;
      }

      const updatedAttempts = user.attempts + 1;
      await supabase
        .from('users')
        .update({ attempts: updatedAttempts })
        .eq('username', username);
      alert(
        `Invalid username or password. You have ${
          3 - updatedAttempts
        } attempts remaining.`
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="mb-6 text-2xl font-bold text-center text-gray-800">Login</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500 focus:outline-none"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-500 hover:underline">
            Register
          </Link>{' '}
          here.
        </p>
        <p className="mt-2 text-sm text-center text-gray-600">
          Forgot your password?{' '}
          <Link to="/forgot-password" className="text-blue-500 hover:underline">
            Reset it
          </Link>.
        </p>
      </div>
    </div>
  );
};

export default Login;
