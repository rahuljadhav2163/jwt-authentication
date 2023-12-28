import React, { useState, useEffect } from 'react';
import axios from 'axios';

import './Home.css';
import { Link } from 'react-router-dom';

function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [data, setData] = useState('');
  const [logoutTimeout, setLogoutTimeout] = useState(null);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    const storedUser = localStorage.getItem('user');

    if (accessToken && refreshToken && storedUser) {
      setIsLoggedIn(true);
      setUser(JSON.parse(storedUser));
      fetchData(accessToken);

      
      const timeoutId = setTimeout(() => {
        handleLogout();
      }, 5 * 60 * 1000); 

      setLogoutTimeout(timeoutId);
    }
  }, []);

  const fetchData = async (accessToken) => {
    try {
      const response = await axios.get('/api/protected', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log('Authenticated API Response:', response.data);
      setData(response.data.message);
    } catch (error) {
      console.error('Error during authenticated API request:', error.response.data);
    }
  };

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await axios.post('/api/invalidate-refresh-token', { refreshToken });
      }
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      setIsLoggedIn(false);
      setUser(null);
      console.log('Logout successful');
      clearTimeout(logoutTimeout); 
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <div>
      <div className='home-box-container'>
        {user ? (
          isLoggedIn && (
            <div className='user-info'>
              <p className='toast-msg'>{data}</p>
              <p className='expire-msg'>Session expires in 5 minutes after login.</p>
              <p className='user'>👤 Welcome, {user.name}!</p>
              <button className='logout-btn' type='button' onClick={handleLogout}>
                Logout
              </button>
            </div>
          )
        ) : (
          <>
            <p className='user'>👤 Hello User</p>
            <p className='routes'>Routes</p>
            <Link className='sigup-route' to='/signup'>
              ➡️ Signup
            </Link>
            <Link className='login-route' to='/login'>
              🔐 Login
            </Link>
            <p className='slogen'>Hello user signup fast..!</p>
          </>
        )}
      </div>
    </div>
  );
}

export default Home;
