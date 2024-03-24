import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { useState } from 'react';
import { useUserAuth } from '../context/UserAuthContext';
import '../css/login.css'
const Login = () => {
  const navigate = useNavigate();
  const [email, setemail] = useState();
  const [password, setpassword] = useState()
  const [loginRole, setLoginRole] = useState("CO")
  const [message, setmessage] = useState(null)
  const { logIn, auth,loading } = useUserAuth();
 
  if (auth?.roles === 'AD') {
    navigate('/admin/adminhome');
  }
  else if (auth?.roles === 'CO') {
    navigate('/contractor/home');
  }


 
  const onSubmit = async (e) => {
    e.preventDefault();//prevent page refresh on submit
    try {
      const resMessage = await logIn(e.target[0].value, e.target[1].value,loginRole);
    } catch (err) {
      setmessage(err.message);
      console.log(err.message);
    }
  }
  useEffect(() => {
    if (auth?.roles === 'AD') {
      navigate('/admin/adminhome');
    }
    else if (auth?.roles === 'CO') {
      navigate('/contractor/home');
    }

  }, [auth]);

  return (
    <div className='login-container'>
      <form onSubmit={onSubmit} className='login-form'>
        <h1>Login</h1>
        <input type='text' placeholder='Enter Username' value={email} onChange={(e) => setemail(e.target.value)} />
        <input type='password' placeholder='Enter Password' value={password} onChange={(e) => setpassword(e.target.value)} />
        <select id="role" name="role" onChange={(e) => {setLoginRole(e.target.value);console.log(e.target.value)}} >
          <option value="CO">Contractor</option>
          <option value="AD">Admin</option>
        </select>
        <button type='submit'>Submit</button>
        {message && <p className='error-message'>{message}</p>}
      </form>
    </div>
  )
}

export default Login