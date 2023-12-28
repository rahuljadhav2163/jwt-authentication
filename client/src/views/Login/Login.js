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
            if (!(email && password)) {
                alert('All fields are required');
                return;
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


                const refreshResponse = await axios.post('/api/refresh-token', {}, { withCredentials: true });

                const newAccessToken = refreshResponse.data.accessToken;
                localStorage.setItem('accessToken', newAccessToken);

                alert('Login successful');
                window.location.href = '/';
            } else {
                alert('Login failed');
            }
        } catch (error) {
            console.error('Error during login:', error);
            alert('Invalid details. Please try again.');
        }
    };

    return (
        <div>
            <form className='login-form-container'>
                <h1 className='login-heading'>Login</h1>

                <input
                    className='input-box'
                    type='email'
                    placeholder='Enter email'
                    value={email}
                    onChange={handleEmailChange}
                />

                <input
                    className='input-box'
                    type='password'
                    placeholder='Enter password'
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
