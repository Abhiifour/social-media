import React from 'react';
import userImage from '../../assests/user.png';
import './Avatar.scss';

function Avatar({src}) {
  return (
    <div className='Avatar'>
     <img src={src?src:userImage} alt="avatar" />
    </div>
  )
}

export default Avatar;