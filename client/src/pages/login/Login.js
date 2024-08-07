import React, { useState } from "react";
import "./login.scss";
import { Link, useNavigate } from "react-router-dom";
import { axiosClient } from "../../utils/axiosClient";
import { KEY_ACCESS_TOKEN, setItem } from "../../utils/localStorageManager";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

 const handleSubmit = async (e)=>{
       e.preventDefault();
       console.log(KEY_ACCESS_TOKEN)
      try {
        const response =await axiosClient.post('/auth/login',{
          email,
          password
         });

         console.log(response)
        
        setItem(KEY_ACCESS_TOKEN,response.result.accessToken);
        navigate('/');
      
       
  
      } catch (error) {
        console.log(error)
      }
     
 }


  return (
    <div className="login">
      <div className="box">
        <h2 className="heading">Login</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            className="email"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            className="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <input type="submit" className="submit" onClick={handleSubmit}/>
        </form>
        <p className="text">
          Do not have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
