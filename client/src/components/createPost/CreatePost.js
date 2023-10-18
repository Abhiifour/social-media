import React, { useState } from "react";
import "./CreatePost.scss";
import Avatar from "../avatar/Avatar";
import {useDispatch} from 'react-redux';
import { useParams } from "react-router-dom";
import {BsImage} from 'react-icons/bs';
import { setLoading, showToast } from "../../redux/slices/appConfigSlice";
import { axiosClient } from "../../utils/axiosClient";
import { getUserProfile } from "../../redux/slices/postsSlice";
import { TOAST_SUCCESS } from "../../App";


function CreatePost() {
  const [postImg, setPostImg] = useState("");
  const [caption,setCaption] = useState("");
  const dispatch = useDispatch();
  const params = useParams();

  function handleImgChange(e) {
    const file = e.target.files[0];
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      if (fileReader.readyState === fileReader.DONE) {
        setPostImg(fileReader.result);
      }
    };
  }

 async function handlePostSubmit(){
    try {
        dispatch(setLoading(true));
        const result = await axiosClient.post('/posts',{
            caption,
            postImg
        });
        console.log('post done' ,result);
        dispatch(getUserProfile({
          userId: params.userId
        }))
    } catch (error) {
        
    }
    finally{
        dispatch(setLoading(false));
        dispatch(showToast({
          type:TOAST_SUCCESS,
          message:'posted'
        }))
        setCaption('');
        setPostImg('');

    }
  }

  
  
  return (
    <div className="CreatePost">
      <div className="left-part">
        <Avatar />
      </div>
      <div className="right-part">
        <input
        value={caption}
          type="text"
          className="captionInput"
          placeholder="whats in your mind!"
          onChange={(e)=> setCaption(e.target.value)}
        />
        {postImg && (
          <div className="img-container">
            <img src={postImg} className="post-img" alt="" />
          </div>
        )}

        <div className="bottom-part">
          <div className="input-post-img">
            <label htmlFor="inputImg" className="labelImg">
              <BsImage />
            </label>
            <input
              type="file"
              accept="image/*"
              id="inputImg"
              className="inputImg"
              onChange={handleImgChange}
            />
          </div>
          <button className="post-btn btn-primary" onClick={handlePostSubmit}>Post</button>
        </div>
      </div>
    </div>
  );
        }
        

export default CreatePost;
