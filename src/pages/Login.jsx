import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { supabase } from '../services/supabaseClient';
import { AuthContext } from '../AuthContext';

const Login = () => {
  const { login } = useContext(AuthContext);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
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
    <div className='login-container'>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <input
          type='text'
          placeholder='Username'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type='password'
          placeholder='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type='submit'>Login</button>
      </form>
      <p>
        Don't have an account? <Link to='/register'>Register</Link> here.
      </p>
      <p>
        Forgot your password? <Link to='/forgot-password'>Reset it</Link>.
      </p>
    </div>
  );
};

export default Login;
