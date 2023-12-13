import {errorToast} from './../core';
import {constants} from '../core';
import axios from 'axios';
import {getStore} from '../redux';
import crashlytics from '@react-native-firebase/crashlytics';

// Create Instance
const AxiosInstance = axios.create({
  baseURL: constants.baseUrl,
  timeout: 20000,
  transformRequest: [
    function (data, headers) {
      const profileData = getStore().profile.profileData;
      if (profileData && profileData?.accessToken) {
        headers['Authorization'] = `Bearer ${profileData?.accessToken}`;
      }
      if (data && data._parts) {
        return data;
      } else {
        return JSON.stringify(data);
      }
    },
  ],
  headers: {'Content-Type': 'application/json'},
});

// Response Interceptor
AxiosInstance.interceptors.response.use(
  response => {
    crashlytics().log(JSON.stringify(response));
    // console.log('API RESPONSE', response);
    if (response?.data?.error_code === 5004) {
      console.log('inside un-auth');
      errorToast(response.data.data?.message);
      return response;
    } else {
      return response;
    }
  },
  error => {
    crashlytics().recordError(error);
    console.log('ERROR CONFIG', error.config);
    console.log('ERROR RESPONSE', error.response);
    if (!error.response) {
      return Promise.reject({
        status: constants.apiFailure,
        message: 'Please check your internet connection',
      });
    } else {
      return error.response;
    }
  },
);

export default AxiosInstance;
