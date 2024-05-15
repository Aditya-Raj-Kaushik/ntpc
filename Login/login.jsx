import React from 'react'
import './login.css'
import {FaMail } from "react-icons/fa"

const login = () => {
  return (
    <div className='wrapper'>
      <form action="">
        <h1>Login</h1>
        <div className='input-box'>
            <input type="email" placeholder='Email ID' required/>
        
        </div>
        <div className='input-box'>
            <input type="password" placeholder='Password' required/>
        </div>
        <div className='forgot'>
            <a href="#">Forgot Password?</a>
        </div>
        <button type='submit'><a href="/dashboard"></a> Login</button>
        <div className='register-link'>
            <p>Don't have an account?<a href="/register">Register</a></p>
        </div>
      </form>
    </div>
  )
}

export default login
