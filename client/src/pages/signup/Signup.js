import React from 'react'
import './signup.scss';
import { Link } from 'react-router-dom';


function Signup() {
  return (
    <div className='signup'>
    <div className="box">
        <h2 className='heading'>Signup</h2>
        <form action="">
            <label htmlFor="name">Name</label>
            <input type="name" className="name" id='name' />
            
            <label htmlFor="email">Email</label>
            <input type="email" className="email" id='email' />

            <label htmlFor="password">Password</label>
            <input type="password" className="password" id='password' />
            <input type="submit" className="submit" />
            
        </form>
        < p className="text" >Already have an account? <Link to='/login'>Login</Link></p>
    </div>
</div>
  )
}

export default Signup;