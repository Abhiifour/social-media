import axios from "axios";
import { KEY_ACCESS_TOKEN, getItem, removeItem, setItem } from "./localStorageManager";
//import store from "../redux/store";
import { showToast } from "../redux/slices/appConfigSlice";
import { TOAST_FAILURE } from "../App";

export const axiosClient = axios.create({
  baseURL:'https://social-media-g62d.onrender.com',
  withCredentials: true,
});



axiosClient.interceptors.request.use((request) => {
  const accessToken = getItem(KEY_ACCESS_TOKEN);
  request.headers["Authorization"] = `Bearer ${accessToken}`;

  return request;
});

axiosClient.interceptors.response.use(async (response) => {
  const data = response.data;
  if (data.status === "ok") {
    return data;
  }
  const originalRequest = response.config;
  const statusCode = data.statusCode;
  const error = data.error;

  /*store.dispatch(showToast({
    type:TOAST_FAILURE,
    message:error
  }));
*/
  if (statusCode === 401 && !originalRequest._retry) { //access token is expired.
   originalRequest._retry = true;
   
   
   const response = await axios.create({
      withCredentials:true,
   }).get('https://social-media-g62d.onrender.com/auth/refresh');
   
    if (response.status === "ok") {
      setItem(KEY_ACCESS_TOKEN, response.result.accessToken);
      originalRequest.headers[
        "Authorization"
      ] = `Bearer ${response.result.accessToken}`;
      return axios(originalRequest);
    }
    else{
      removeItem(KEY_ACCESS_TOKEN);
      window.location.replace('/login','_self');
      return Promise.reject(error);
    }
    //console.log('axios error',error);

    //return Promise.reject(error);
  }
},async(error)=>{
 /* store.dispatch(showToast({
    type:TOAST_FAILURE,
    message:error
  }));
  */
  return Promise.reject(error);
});
