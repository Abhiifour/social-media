import React from "react";
import { KEY_ACCESS_TOKEN, getItem } from "../utils/localStorageManager";
import { Navigate, Outlet, useNavigate } from "react-router";

function RequireUser() {
  const user = getItem(KEY_ACCESS_TOKEN);
  console.log(user)

  return(
    user ? <Outlet /> : <Navigate to="/login" />
  ) ;
}

export default RequireUser;
