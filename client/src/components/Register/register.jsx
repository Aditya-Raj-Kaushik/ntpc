import React,{useState} from 'react'
import { FaEnvelope, FaLock } from 'react-icons/fa';
import logo from '../assets/logo.png'
import { Link } from 'react-router-dom';
import Axios from 'Axios'

const register = () => {

  const[email,setEmail] = useState('')
  const[password,setPassword] = useState('')


  const createUser =()=>{
    Axios.post('http://localhost:3002/register',{
      Email:email,
      Password:password
    }).then(()=>{
      console.log('User created')
    })
  }
  
  return (
    <div>
      <div className='company'>
        <img className='logo' src={logo} alt='Company Logo' />
      </div>
      <div className='wrapper'>
        <form action=''>
          <h1>Register</h1>
          <div className='input-box'>
            <input type='email' placeholder='Email ID' required onChange={(event)=>{
              setEmail(event.target.value)
            }}/>
            <FaEnvelope className='icon' />
          </div>
          <div className='input-box'>
            <input type='password' placeholder='Password' required onChange={(event)=>{
              setPassword(event.target.value)
            }}/>
            <FaLock className='icon' />
          </div>
          <Link to="/">
            <button type="button" onClick={createUser}>
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
