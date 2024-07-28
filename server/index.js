const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const dbconnect = require('./dbConnect');
const authRouter = require('./routers/authRouter')
const postRouter = require('./routers/postRouter')
const userRouter = require('./routers/userRouter')
const cloudinary = require('cloudinary').v2;
const app = express();
dotenv.config('./.env');




cloudinary.config({
    cloud_name: "djn8q3ywh",
    api_key: "455828634416478",
    api_secret: "wmca8cl9Gn0VRDytn5RyfyHNOp8"
  });
  




//middlewares

app.use(express.json({limit:'10mb'}));
app.use(cookieParser());

app.use(cors({
    credentials:true,
    origin:'https://social-media-flax-seven.vercel.app/'
}))

app.use('/auth' , authRouter);
app.use('/posts', postRouter );
app.use('/user', userRouter);

app.get('/',(req,res)=>{
    res.status(200).send('ok');
});



const port = process.env.PORT;

dbconnect();

app.listen(port , ()=>{
    console.log(`listening on port : ${port}`);
})
