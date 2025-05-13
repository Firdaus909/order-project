import { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { Link } from 'react-router';

const ResetPassword = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
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
    <div>
      <h1>Reset Password</h1>
      <form onSubmit={handleSubmit}>
        <input
          type='text'
          placeholder='Username'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type='password'
          placeholder='Enter new password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type='password'
          placeholder='Confirm new password'
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type='submit'>Reset Password</button>
      </form>
      <Link to='/login'>Back to Login</Link>
    </div>
  );
};

export default ResetPassword;
