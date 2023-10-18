import React, { useEffect, useState } from "react";
import "./Profile.scss";
import Post from "../post/Post";
import "./Profile.scss";

import { useNavigate, useParams } from "react-router-dom";
import CreatePost from "../createPost/CreatePost";
import { useDispatch ,useSelector } from "react-redux";
import { getUserProfile } from "../../redux/slices/postsSlice";


function Profile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();
  const feedData = useSelector(state => state.feedDataReducer.reedData)
  const userProfile =useSelector(state=>state.postsReducer.userProfile);
  const myProfile =useSelector(state=>state.appConfigReducer.myProfile);
  const [isMyProfile , setIsMyProfile] = useState(false);
  const [isFollowing,setIsFollowing] = useState(false); 

  useEffect(()=>{
    dispatch(getUserProfile({
      userId: params.userId
    }));
    setIsMyProfile(myProfile?._id === params.userId);
    setIsFollowing(feedData?.followings?.find((item) => item._id === params.userId));
  },[myProfile,params.userId]);


  return (
    <div className="Profile">
      <div className="container">
        <div className="left-part">
         {isMyProfile && <CreatePost />}
          {userProfile?.posts?.map(post => <Post key={post._id} post={post}/>)}
        </div>
        <div className="right-part">
          <div className="profile-card">
            <img src={userProfile?.avatar?.url} alt="" className="user-img" />
            <h3 className="user-name">{userProfile?.name}</h3>
            <p>{userProfile?.bio}</p>
            <div className="follower-info">
              <h4>{`${userProfile?.followers?.length} Followers`}</h4>
              <h4>{`${userProfile?.followings?.length} Followings`}</h4>
            </div>
            {!isMyProfile &&  <button className="follow btn-primary">{isFollowing ? "Unfollow" : "Follow"}</button>}
            {isMyProfile && <button
              className="update-profile btn-secondary"
              onClick={() => navigate("/update")}
            >
              Update Profile
            </button>}
            
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
