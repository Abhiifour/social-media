const User = require("../models/User");
const { error, success } = require("../utils/responseWrapper");
const Post = require('../models/Post');
const cloudinary = require('cloudinary').v2;
const {mapPostOutput} = require('../utils/util')

const followOrUnfollowUserController = async (req,res)=>{
    try {
        const {userIdToFollow} = req.body;
        const curUserId = req._id;

        const userToFollow = await User.findById(userIdToFollow);
        const curUser = await User.findById(curUserId);

        if(curUserId === userIdToFollow){
            return res.send(error(404,"connot follow yourself"));
        }

        if(!userToFollow){
            return res.send(error(404,"user to follow not found"));

        }

        if(curUser.followings.includes(userIdToFollow)){
            const followingIndex = curUser.followings.indexOf(userIdToFollow);
            curUser.followings.splice(followingIndex,1);

            const followerIndex = userToFollow.followers.indexOf(curUserId);
            userToFollow.followers.splice(followerIndex,1);
            
        }
        else{
            userToFollow.followers.push(curUserId);
            curUser.followings.push(userIdToFollow);
          
        }
        await userToFollow.save();
        await curUser.save();
        return res.send(success(200,{user: userToFollow}));

    } catch (e) {
            return res.send(error(500,e.message));
    }
};

const getPostOfFollowingController = async(req,res)=>{
    try {
        const curUserId = req._id;
        const curUser = await User.findById(curUserId).populate('followings');

        const fullPosts = await Post.find({
            'owner':{
                '$in':curUser.followings
            }
        }).populate('owner');

        const posts = fullPosts.map(item => mapPostOutput(item,req._id)).reverse();
       
        
        const followingsIds = curUser.followings.map(item => item._id);
        followingsIds.push(req._id);
        const suggestions = await User.find({
            _id:{
                '$nin': followingsIds
            }
        })

        return res.send(success(200,{...curUser._doc,suggestions,posts}));
        
    } catch (e) {
        return res.send(error(500,e.message));
    }
}


const getMyPostsController = async (req,res)=>{
    try {
        const curUserId = req._id;
        const curUser = await User.findById(curUserId);

        if(!curUser){
            return res.send(error(404,'user not found'));
        }

        const allPosts = await Post.find({
            'owner':curUserId
        });
        return res.send(success(200,{allPosts}));
    } catch (e) {
        res.send(error(500,e.message));
    }
};

const getUserPostsController = async (req,res)=>{
    try {
        const {userId} = req.body;
        const user = await User.findById(userId);
        
        if(!userId){
            res.send(error(400,'userId is required.'));
        }

        if(!user){
            return res.send(error(404,'user not found'));
        }

        const posts = await Post.find({
            'owner':userId
                
        })
        
        return res.send(success(200,{posts}))
    } catch (e) {
        res.send(error(500,e.message));
    }
};

const deleteProfileController = async (req,res)=>{
    try {
        const curUserId = req._id;
    const curUser = await User.findById(curUserId);

    //delete all posts
    await Post.deleteMany({
        'owner':curUserId
    });

    //removed myself from followers' followings.
    curUser.followers.forEach( async(followerId) =>{
        const follower = await User.findById(followerId);
        const index = follower.followings.indexOf(curUserId);
        follower.followings.splice(index,1);
        await follower.save();
    });
    

    //removed myself from followings' followers.
    curUser.followings.forEach(async(followingId)=>{
        const following = await User.findById(followingId);
        const index = following.followers.indexOf(curUser);
        following.followers.splice(index,1);
        await following.save();
    });

    //remove myself from all likes
    const allPosts = await Post.find();
    allPosts.forEach(async (post)=>{
        const index = post.likes.indexOf(curUser);
        post.likes.splice(index,1);
        await post.save();
    })
    await curUser.remove();

    res.clearCookie('jwt',{
        httpOnly:true,
        secure:true
    });

    return res.send(success(200,'user deleted'));
    } catch (e) {
       return  res.send(error(500,e.message));
    }
};

const getMyInfo = async (req,res)=>{
    try {
        const user = await User.findById(req._id);

    return res.send(success(200,{user}))
    } catch (e) {
    return res.send(error(500,e.message));
    }
}


const updateUserProfile = async (req,res)=>{
    try {
        const {name , bio , userImg} = req.body;
        const user = await User.findById(req._id);

        if(name){
            user.name = name;
        }
        if(bio){
            user.bio = bio;
        }

        if(userImg){
            const cloudImg = await cloudinary.uploader.upload(userImg,{
                folder:'profile'
            });
            user.avatar = {
                url:cloudImg.secure_url,
                publicid:cloudImg.public_id
            }

        }
        
        await user.save();
        return res.send(success(200,{user}));
        
    } catch (e) {
        return res.send(error(500,e.message));
    }
}

const getUserProfile = async (req,res)=>{
   
    try {
        const userId = req.body.userId;
        const user = await User.findById(userId).populate({
            path:'posts',
            populate:{
                path:'owner'
            }
        });
        const fullPosts = user.posts;
        const posts = fullPosts.map(item => mapPostOutput(item,req._id)).reverse();
        return res.send(success(200,{...user._doc,posts}))
        
    } catch (e) {
        return res.send(error(500,e.message));
    }
}

module.exports = {
    followOrUnfollowUserController,
    getPostOfFollowingController,
    getMyPostsController,
    getUserPostsController,
    deleteProfileController,
    getMyInfo,
    updateUserProfile,
    getUserProfile
}