import React,{useState} from 'react';
import './login.css';
import { FaEnvelope, FaLock } from 'react-icons/fa';
 import logo from '../assets/logo.png'
 import { Link } from 'react-router-dom';

const Login = () => {
  return (

    



    <div>
      <div className='company'>
        <img className='logo' src={logo} alt='Company Logo' />
      </div>
      <div className='wrapper'>
        <form action=''>
          <h1>Login</h1>
          <div className='input-box'>
            <input type='email' placeholder='Email ID' required />
            <FaEnvelope className='icon' />
          </div>
          <div className='input-box'>
            <input type='password' placeholder='Password' required />
            <FaLock className='icon' />
          </div>
          <div className='forgot'>
            <a href='#'>Forgot Password?</a>
          </div>
          <Link to="/dashboard">
    <button type="button">
        Login
    </button>
</Link>

          <div className='register-link'>
            <p>
              Don't have an account? <a href='/register'>Register</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;

