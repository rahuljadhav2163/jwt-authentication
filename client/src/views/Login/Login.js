import React, { useState } from 'react';
import axios from 'axios';

import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = async () => {
    try {
        if (!( email && password)) {
            alert("all fields are required");
        }

      const response = await axios.post('/api/login', {
        email,
        password,
      });

      const { success, accessToken, refreshToken, user } = response.data;

      if (success) {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify(user));
        alert('Login successful');
      } else {
        alert('Login failed');
      }
    } catch (error) {
      alert('invalid deatail', error);
    }
  };

  return (
    <div>
      <form className='login-form-container'>
        <h1 className='login-heading'>Login</h1>

        <input
          className='input-box'
          type='email'
          placeholder='enter email'
          value={email}
          onChange={handleEmailChange}
        />

        <input
          className='input-box'
          type='password'
          placeholder='enter password'
          value={password}
          onChange={handlePasswordChange}
        />

        <button className='login-btn' type='button' onClick={handleLogin}>
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
