import React, { useEffect, useState } from "react";
import "./Update.scss";
import userImg from "../../assests/user.png";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, updateMyProfile } from "../../redux/slices/appConfigSlice";

function Update() {
  const myProfile = useSelector((state) => state.appConfigReducer.myProfile);
  const dispatch = useDispatch();
  const [name, setname] = useState("");
  const [bio, setBio] = useState("");
  const [userImg, setUserImg] = useState("");

  useEffect(() => {
    setname(myProfile?.name || '');
    setBio(myProfile?.bio || '');
  }, [myProfile]);

  function handleImageChange(e) {
    const file = e.target.files[0];
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = ()=>{
        if(fileReader.readyState === fileReader.DONE){
            setUserImg(fileReader.result);
        }
    }
  }


  function handleSubmit(e){
      e.preventDefault();
      dispatch(updateMyProfile({
        name , 
        bio, 
        userImg
      }));
  }

  return (
    <div className="Update">
      <div className="container">
        <div className="left-part">
          <div className="input-user-img">
            <label htmlFor="inputImg" className="labelImg">
              <img src={userImg || myProfile?.avatar?.url} alt={name} />
            </label>
            <input
              className="inputImg"
              id="inputImg"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
        </div>
        <div className="right-part">
          <form onClick={handleSubmit}>
            <input
              value={name}
              type="text"
              placeholder="name"
              onChange={(e) => setname(e.target.value)}
            />
            <input
              value={bio}
              type="text"
              placeholder="bio"
              onChange={(e) => setBio(e.target.value)}
            />

            <input type="submit" className="btn-primary" onClick={handleSubmit} />
          </form>
          <button className="delete-account btn-primary">Delete Account</button>
        </div>
      </div>
    </div>
  );
}

export default Update;
