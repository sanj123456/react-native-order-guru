import React, {FC, useEffect} from 'react';
import {errorToast, successToast} from '../core';
import {strings} from '../i18n';
import NetInfo from '@react-native-community/netinfo';
import {NoInternetProps} from '../types/components';
import {setNoInternet} from '../redux/modules/genericSlice';
import {dispatch} from '../redux';

const NoInternet: FC<NoInternetProps> = () => {
  useEffect(() => {
    // Subscribe
    const unsubscribe = NetInfo.addEventListener(state => {
      console.log('Internet Info', state?.isInternetReachable);
      if (state?.isInternetReachable) {
        dispatch(setNoInternet(false));
        successToast(strings.msgOnline, strings.msgInternetConnection);
      } else if (!state?.isInternetReachable) {
        dispatch(setNoInternet(true));
        errorToast(strings.msgOffline, strings.msgInternetConnection);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return <></>;
};

export default NoInternet;
