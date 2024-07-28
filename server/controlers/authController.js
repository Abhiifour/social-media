const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { error, success } = require('../utils/responseWrapper');

const signupController = async(req,res) =>{
    try {
     const {email,password , name} = req.body;
     if(!email || !password ||!name){
       // return res.status(400).send('All fields are required');
          return res.send(error(400,'All fields are required')); 
    }
     const oldUser = await User.findOne({email});
     if(oldUser){
       //return res.status(409).send('User already exists');
       return res.send(error(409,'User already exists')); 
     }
     const hashedPassword = await bcrypt.hash(password, 10);
     const user = await User.create({
        name,
        email,
        password:hashedPassword,
     });
     
     return res.send(success(202,'user created'));

    } catch (error) {
        console.log(error);
    }

}

const loginController = async(req,res) =>{
    try {
        const {email,password} = req.body;
        if(!email || !password){
          // return res.status(400).send('All fields are required');
          return res.send(error(400,'All fields are required')); 
        }
        const user =await User.findOne({email}).select("+password");
        if(!user){
            //return res.status(404).send('user is not registered');
            return res.send(error(404,'User is not registered')); 
        }

        const matched = await bcrypt.compare(password,user.password)
        if(!matched){
            //return res.status(403).send('Incorrect password')
            return res.send(error(403,'Incorrect password')); 
        }

        const accessToken = generateAccessToken({_id:user._id})
        const refreshToken = generateRefreshToken({_id:user._id})
        
        res.cookie('jwt',refreshToken,{
            httpOnly: true,
            secure: true
        });

        return res.send(success(202,{
            accessToken
        }))
    
    } catch (error) {
        console.log(error)
    }

}

const logoutController = async(req,res)=>{
    try {
      res.clearCookie('jwt',{
        httpOnly:true,
        secure:true
      })
      return res.send(success(200,'user logged out'));
    } catch (e) {
      return res.send(error(500,e.message));
    }
}

const refreshController = async(req,res)=>{

    const cookies = req.cookies;

    if(!cookies.jwt){
       // return res.status(401).send('Refresh token in cookie is required');
       return res.send(error(401,'Refresh token in cookie is required')); 
    }

    const refreshToken = cookies.jwt;
    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY);
        const id = decoded._id;
        const accessToken = generateAccessToken({_id:id});
        return res.send(success(200,{accessToken}));
    
    } catch (error) {
        console.log(error);
       // return res.status(401).send("Invalid refresh token");
       return res.send(error(400,'Invalid refresh token')); 
    }
    
};

//internal functions 
//function to generate access token.
const generateAccessToken = (data)=>{
  const token =  jwt.sign(data,process.env.ACCESS_TOKEN_KEY,{
    expiresIn:'1d'
  });

  return token;
}
//functions to generate refresh token.
const generateRefreshToken = (data)=>{
    const token =  jwt.sign(data,process.env.REFRESH_TOKEN_KEY,{
      expiresIn:'1y'
    });
    return token;
  }



module.exports = {
    loginController,
    signupController,
    refreshController,
    logoutController
}