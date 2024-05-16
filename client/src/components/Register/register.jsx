import React from 'react'
import { FaEnvelope, FaLock } from 'react-icons/fa';
 import logo from '../assets/logo.png'
  import { Link } from 'react-router-dom';

const register = () => {
  return (
    <div>
      <div className='company'>
        <img className='logo' src={logo} alt='Company Logo' />
      </div>
      <div className='wrapper'>
        <form action=''>
          <h1>Register</h1>
          <div className='input-box'>
            <input type='email' placeholder='Email ID' required />
            <FaEnvelope className='icon' />
          </div>
          <div className='input-box'>
            <input type='password' placeholder='Password' required />
            <FaLock className='icon' />
          </div>
          <div className='input-box'>
            <input type='password' placeholder='Confirm Password' required />
            <FaLock className='icon' />
          </div>
          <Link to="/">
            <button type="button">
              Confirm
              </button>
              </Link>
          <div className='register-link'>
            <p>
               Already having an account?  <a href='/register'>Login</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default register
