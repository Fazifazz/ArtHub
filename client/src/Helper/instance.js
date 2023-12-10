// to make HTTP requests
// keep  request and response handling logic clean and centralized.

import URL from '../config/api'
import axios from 'axios'
const user = axios.create({baseURL:URL.BASE_URL})

export const userRequest = async({ ...options }) => {
    // the Authorization header 
    user.defaults.headers.common.Authorization = `Bearer ${localStorage.getItem(
      "token"
    )}`;
    // callback functions for handling responses and errors.
    const onSuccess = (response) => response;
    const onError = (error) => {
      console.log("axios interceptor", error);
      return error;
    };
    return user(options).then(onSuccess).catch(onError);
  };

  export const adminRequest = async ({ ...options }) => {
    user.defaults.headers.common.Authorization = `Bearer ${localStorage.getItem(
      "admintoken"
    )}`;
    const onSuccess = (response) => response;
    const onError = (error) => {
      console.log("axios interceptor", error);
      return error;
    };
    try {
      const response = await user(options);
      return onSuccess(response);
    } catch (error) {
      return onError(error);
    }
  };

  export const ArtistRequest = async({ ...options }) => {
    user.defaults.headers.common.Authorization = `Bearer ${localStorage.getItem(
      "artistToken"
    )}`;
    const onSuccess = (response) => response;
    const onError = (error) => {
      console.log("axios interceptor", error);
      return error;
    };
    return user(options).then(onSuccess).catch(onError);
  };