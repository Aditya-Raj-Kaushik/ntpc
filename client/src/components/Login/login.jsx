import React, { useState } from 'react';
import './login.css';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import logo from '../assets/logo.png';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const loginUser = async (event) => {
    event.preventDefault(); // Prevent default form submission
    setError(null); // Reset error state

    try {
      const response = await axios.post('http://localhost:7001/login', {
      Email: loginEmail,
      Password: loginPassword,
    });
    

      if (response.data.success) {
        navigate('/dashboard'); // Navigate to the dashboard on success
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError('Invalid email or password');
      } else {
        setError('Failed to login. Please try again later.');
      }
    }
  };

  return (
    <div>
      <div className='company'>
        <img className='logo' src={logo} alt='Company Logo' />
      </div>
      <div className='wrapper'>
        <form onSubmit={loginUser}>
          <h1>Login</h1>
          <div className='input-box'>
            <input
              type='email'
              placeholder='Email ID'
              required
              onChange={(event) => setLoginEmail(event.target.value)}
            />
            <FaEnvelope className='icon' />
          </div>
          <div className='input-box'>
            <input
              type='password'
              placeholder='Password'
              required
              onChange={(event) => setLoginPassword(event.target.value)}
            />
            <FaLock className='icon' />
          </div>
          {error && <p className="error">{error}</p>}
          <button type="submit">Login</button>
          <div className='forgot'>
            <a href='#'>Forgot Password?</a>
          </div>
          <div className='register-link'>
            <p>
              Don't have an account? <Link to='/register'>Register</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
