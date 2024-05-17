import React,{useState} from 'react';
import './login.css';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import logo from '../assets/logo.png'
import { Link,useNavigate } from 'react-router-dom';
import Axios from 'Axios';

const Login = () => {

  const[Loginemail,setLoginEmail] = useState('')
  const[Loginpassword,setLoginPassword] = useState('')
  const navigateTo = useNavigate()

  const loginUser =(e)=>{
    e.preventDefault();
    Axios.post('http://localhost:3002/login',{
      LoginEmail:Loginemail,
      LoginPassword:Loginpassword
    }).then((response)=>{
      if(response.data.message){
        navigateTo('/')   
      }
      else{
        navigateTo('/dashboard')
      }
    })
  }


  return (
    <div>
      <div className='company'>
        <img className='logo' src={logo} alt='Company Logo' />
      </div>
      <div className='wrapper'>
        <form action=''>
          <h1>Login</h1>
          <div className='input-box'>
            <input type='email' placeholder='Email ID' required onChange={(event)=>{
              setLoginEmail(event.target.value)
            }}/>
            <FaEnvelope className='icon' />
          </div>
          <div className='input-box'>
            <input type='password' placeholder='Password' required onChange={(event)=>{
              setLoginPassword(event.target.value)
            }}/>
            <FaLock className='icon' />
          </div>
          <div className='forgot'>
            <a href='#'>Forgot Password?</a>
          </div>
          <Link to="/dashboard">
  <button type="button" onClick={loginUser}>
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

