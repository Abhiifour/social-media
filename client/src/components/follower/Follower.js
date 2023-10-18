import React, { useState, useEffect } from "react";
import Avatar from "../avatar/Avatar";
import "./Follower.scss";
import { useSelector, useDispatch } from "react-redux";
import { followAndUnfollowUser } from "../../redux/slices/feedSlice";
import {useNavigate} from 'react-router-dom';
import { showToast } from "../../redux/slices/appConfigSlice";
import { TOAST_SUCCESS } from "../../App";

function Follower({ user }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const feedData = useSelector((state) => state.feedDataReducer.feedData);
  const [isFollowing, setIsFollowing] = useState();
  useEffect(() => {
    setIsFollowing(feedData?.followings?.find((item) => item._id === user._id));
  }, [feedData]);

  function handleUserFollow(){
    dispatch(followAndUnfollowUser({
      userIdToFollow : user._id
    }))
    dispatch(showToast({
      type:TOAST_SUCCESS,
      message:'action completed'
    }))
  }
  return (
    <div className="Follower">
      <div className="user-info" onClick={()=> navigate(`/profile/${user._id}`)}>
        <Avatar src={user?.avatar?.url} />
        <h4 className="name">{user?.name}</h4>
      </div>
      <h5 className="hover-link follow-link" onClick={handleUserFollow}>
        {isFollowing ? "Unfollow" : "Follow"}
        
      </h5>
    </div>
  );
}

export default Follower;
