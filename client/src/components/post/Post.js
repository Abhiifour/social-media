import React from 'react'
import Avatar from '../avatar/Avatar';
import './Post.scss'
import Img from '../../assests/astronaut.jpg';
import {AiOutlineHeart} from 'react-icons/ai'
import { useDispatch } from 'react-redux';
import { likeAndUnlikePost } from '../../redux/slices/postsSlice';
import {useNavigate} from 'react-router-dom';
import { showToast } from '../../redux/slices/appConfigSlice';
import { TOAST_SUCCESS } from '../../App';

function Post({post}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handlePostLike(){
  dispatch(likeAndUnlikePost({
    postId :post._id
  } 
  ))
  dispatch(showToast({
    type:TOAST_SUCCESS,
    message:'liked or unliked '
  }))
  }
  return (
    <div className='Post'>
    <div className="heading" onClick={()=> navigate(`/profile/${post.owner._id}`)}>
        <Avatar src={post?.owner?.avatar?.url}/>
        <h4>{post?.owner?.name}</h4>
    </div>
    <div className="content">
        <img src={post?.image?.url} alt="" />
    </div>
    <div className="footer">
    <div className="like" onClick={handlePostLike}>
        <AiOutlineHeart className='icon'/>
        <h4>{`${post?.likesCount} likes`}</h4>
    </div>
    <p className="caption">{post?.caption}</p>
    <h6 className="time-ago">{post?.timeAgo}</h6>

    </div>
    </div>
  )
}

export default Post