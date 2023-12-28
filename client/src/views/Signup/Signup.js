import React, { useState } from 'react'
import axios from "axios"
import "./Signup.css"
import { Link } from 'react-router-dom';
function Signup() {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const userSignup = async () => {

        if (!(name && email && password)) {
            alert("all fields are required");
        }

        try {
            const response = await axios.post('/api/signup', {
                name,
                email,
                password,
            });

            if (response?.data?.success) {
                console.log(response?.data?.token)
                alert(response?.data?.message)
                window.location.href = "login";
            } else {
                alert(response?.data?.message)
            }

        } catch (e) {
            alert(e.message)
        }


    }


    return (
        <div>
            <form className='signup-form-container'>
                <h1 className='signup-heading'>Signup</h1>

                <input className='input-box'
                    type='text'
                    placeholder='enter name'
                    onChange={(e) => {
                        setName(e.target.value)
                    }}
                />

                <input className='input-box'
                    type='email'
                    placeholder='enter email'
                    onChange={(e) => {
                        setEmail(e.target.value)
                    }}
                />

                <input className='input-box'
                    type='password'
                    placeholder='enter password'
                    onChange={(e) => {
                        setPassword(e.target.value)
                    }}
                />
                <p className='home'><Link to='/'>🏠</Link></p>
                <button className='signup-btn' onClick={userSignup} type='button'>Signup</button>

                <p className='login-in'>Already have account ? <Link to='/login'>Login</Link></p>

            </form>
        </div>
    )
}

export default Signup