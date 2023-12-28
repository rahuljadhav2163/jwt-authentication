import React, { useState, useEffect } from 'react';
import axios from 'axios';

import './Home.css';

function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [data, setData] = useState('');

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    const storedUser = localStorage.getItem('user');

    if (accessToken && refreshToken && storedUser) {
      setIsLoggedIn(true);
      setUser(JSON.parse(storedUser));
      fetchData(accessToken);
    }
  }, []);

  useEffect(() => {
    const storedAccessToken = localStorage.getItem('accessToken');

    const interval = setInterval(() => {
      const currentAccessToken = localStorage.getItem('accessToken');

      if (currentAccessToken !== storedAccessToken) {
        
        handleLogout();
      }
    }, 100000); 

    return () => clearInterval(interval);
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
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <div>
      {user ? (
        isLoggedIn && (
          <div className='user-info'>
            <p>{data}</p>
            <p>Welcome, {user.name}!</p>
            <button className='logout-btn' type='button' onClick={handleLogout}>
              Logout
            </button>
          </div>
        )
      ) : (
        <p>Hello User</p>
      )}
    </div>
  );
}

export default Home;
