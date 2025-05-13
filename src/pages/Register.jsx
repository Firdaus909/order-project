import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { supabase } from '../services/supabaseClient';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    const { error } = await supabase
      .from('users')
      .insert([{ username, password }]);

    if (!error) {
      alert('Account created successfully');
      navigate('/');
    } else {
      alert('Error creating account');
    }
  };
  return (
    <div className='register-container'>
      <h1>Register</h1>
      <form onSubmit={handleRegister}>
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
        <button type='submit'>Register</button>
      </form>
      <p>
        Already have an account? <Link to='/login'>Login</Link> here.
      </p>
    </div>
  );
};

export default Register;
