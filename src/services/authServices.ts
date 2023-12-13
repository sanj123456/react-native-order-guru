import {errorToast, successToast} from './../core/genericUtils';
import {constants} from '../core';
import {post, put} from './request';
import {strings} from '../i18n';
import {getAsyncData, removeAsyncData, setAsyncData} from './asyncServices';
import {dispatch} from '../redux';
import {setProfileData} from '../redux/modules/profileSlice';
import {setIsLoading} from '../redux/modules/genericSlice';
import {deleteRequest} from './request';
// import messaging from '@react-native-firebase/messaging';

export const loginAPI = async (payload: any) => {
  dispatch(setIsLoading(true));
  post(constants.endPtLogin, payload)
    .then(async res => {
      if (res?.status === constants.apiSuccess) {
        successToast(strings.msgLoginSuccess, '', 'bottom');
        dispatch(setProfileData(res?.data));
        setAsyncData(constants.asyncUserData, res?.data);
        if (res?.data?.user?.ipadDevice?.location) {
          let fcmToken = await getAsyncData(constants.asyncFcmToken);
          console.log('login API fcmToken check', fcmToken);
          if (fcmToken) {
            fcmAddApi({fcmToken});
          }

          // messaging()
          //   .subscribeToTopic(
          //     `${constants.notifyOrderTopic}${res?.data?.user?.ipadDevice?.location}`,
          //   )
          //   .then(() =>
          //     console.log(
          //       'Subscribed to topic!',
          //       `${constants.notifyOrderTopic}${res?.data?.user?.ipadDevice?.location}`,
          //     ),
          //   )
          //   .catch(e => {
          //     console.log('subscribeToTopic Error', e);
          //     errorToast(strings.msgTopicError, '', 'bottom');
          //   });
        }
      } else {
        errorToast(res?.message, '', 'bottom');
      }
      dispatch(setIsLoading(false));
    })
    .catch(e => {
      console.log('API ERROR', e);
      dispatch(setIsLoading(false));
    });
};

export const fcmAddApi = async (payload: any) => {
  dispatch(setIsLoading(true));
  console.log(constants.endPtFcm, payload);
  put(constants.endPtFcm, payload)
    .then(res => {
      if (res?.status === constants.apiSuccess) {
      } else {
        errorToast(res?.message, '', 'bottom');
      }
      dispatch(setIsLoading(false));
    })
    .catch(e => {
      console.log('API ERROR', e);
      dispatch(setIsLoading(false));
    });
};

export const fcmRemoveApi = async (payload: any) => {
  dispatch(setIsLoading(true));
  deleteRequest(constants.endPtFcm, payload)
    .then(res => {
      if (res?.status === constants.apiSuccess) {
        removeAsyncData(constants.asyncUserData);
        dispatch(setProfileData(null));
      } else {
        errorToast(res?.message, '', 'bottom');
      }
      dispatch(setIsLoading(false));
    })
    .catch(e => {
      console.log('API ERROR', e);
      dispatch(setIsLoading(false));
    });
};
