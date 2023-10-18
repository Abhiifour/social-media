import React from 'react'
import Avatar from '../avatar/Avatar';
import './Navbar.scss';
import { useNavigate } from 'react-router-dom';
import {GrLogout} from 'react-icons/gr'
import { useSelector , useDispatch } from 'react-redux';
import { setLoading } from '../../redux/slices/appConfigSlice';
import axios from 'axios';
import { axiosClient } from '../../utils/axiosClient';
import { KEY_ACCESS_TOKEN, removeItem } from '../../utils/localStorageManager';



function Navbar() {
    const navigate = useNavigate();
    
    const myProfile  = useSelector(state => state.appConfigReducer.myProfile);
    const dispatch = useDispatch();
    
    async function handleLogout(){
      try {
        dispatch(setLoading(true));
        await axiosClient.post('/auth/logout')
        removeItem(KEY_ACCESS_TOKEN);
        navigate('/login');
        dispatch(setLoading(false));
      } catch (error) {
        
      }
    }

   

  return (
    <div className='Navbar'>
      <div className="container">
       <h2 className="banner hover-link" onClick={()=> navigate('/')}>ZocialMedia</h2>
       <div className="right-side">
        <div className="profile hover-link" onClick={()=> navigate(`/profile/${myProfile?._id}`)}>
           <Avatar src={myProfile?.avatar?.url} />
        </div>
        <div className="logout hover-link" onClick={handleLogout}>
          <GrLogout className='logout-icon'/>
        </div>
       </div>
      </div>

    </div>
  )
}

export default Navbar;