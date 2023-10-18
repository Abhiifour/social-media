import React from 'react'
import { KEY_ACCESS_TOKEN, getItem } from '../utils/localStorageManager'
import { Navigate, Outlet } from 'react-router';

function isUserLoggedIn() {
    const user = getItem(KEY_ACCESS_TOKEN);
    console.log(user)
  return (
    user? <Navigate to="/"/> :<Outlet/>
  )
}

export default isUserLoggedIn