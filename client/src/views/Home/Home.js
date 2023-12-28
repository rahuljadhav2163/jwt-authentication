import React, { useState, useEffect } from 'react';
import axios from 'axios';

import './Home.css'; 

function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    const storedUser = localStorage.getItem('user');

    if (accessToken && refreshToken && storedUser) {
      setIsLoggedIn(true);
      setUser(JSON.parse(storedUser));
    }
  }, []);

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
      {
        user ? isLoggedIn && (
            <div className='user-info'>
              <p>Welcome, {user.name}!</p>
              <button className='logout-btn' type='button' onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : <p>Hello User</p>
      }
    </div>
  );
}

export default Home;
