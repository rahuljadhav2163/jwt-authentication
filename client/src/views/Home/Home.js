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

  const fetchData = async (accessTokens) => {
    try {
        const accessToken = localStorage.getItem('accessToken');
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
      await axios.post('/api/logout');
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
