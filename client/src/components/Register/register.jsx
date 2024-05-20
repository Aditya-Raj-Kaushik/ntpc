import React, { useState, useEffect } from 'react';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import logo from '../assets/logo.png';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './register.css'; // Specific styles for signup page

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    document.body.classList.add('signup-page');

    return () => {
      document.body.classList.remove('signup-page');
    };
  }, []);

  const createUser = async (event) => {
    event.preventDefault(); // Prevent the default form submission
    setError(null); // Reset error state
    try {
      await axios.post('http://localhost:7001/register', {
        Email: email,
        Password: password,
      });
    
      console.log('User created');
    } 
    catch (err) {
      console.error('Error creating user:', err);
      setError('Failed to create user');
    }
  };

  return (
    <div>
      <div className="company">
        <img className="logo" src={logo} alt="Company Logo" />
      </div>
      <div className="wrapper">
        <form onSubmit={createUser}>
          <h1>Register</h1>
          <div className="input-box">
            <input
              type="email"
              placeholder="Email ID"
              required
              onChange={(event) => {
                setEmail(event.target.value);
              }}
            />
            <FaEnvelope className="icon" />
          </div>
          <div className="input-box">
            <input
              type="password"
              placeholder="Password"
              required
              onChange={(event) => {
                setPassword(event.target.value);
              }}
            />
            <FaLock className="icon" />
          </div>
          {error && <p className="error">{error}</p>}
          <button type="submit">Confirm</button>
          <div className="register-link">
            <p>
              Already have an account? <Link to="/">Login</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;

