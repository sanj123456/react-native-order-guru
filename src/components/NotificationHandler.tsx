import React, {FC, Fragment, useEffect, useRef, useState} from 'react';
import messaging from '@react-native-firebase/messaging';
import {constants, errorToast, screenName} from '../core';
import {
  fcmAddApi,
  findSingleOrdersApi,
  getAsyncData,
  notificationService,
  setAsyncData,
} from '../services';
import {navigate} from '../navigation/RootNavigation';
import {dispatch, getStore, RootState} from '../redux';
import {setNewNotifiedOrder} from '../redux/modules/dashboardSlice';
import {Platform} from 'react-native';
import {useSelector} from 'react-redux';
import {
  setIsLoading,
  setIsNotificationModal,
  setIsOpenDatePicker,
  setNotificationAttention,
} from '../redux/modules/genericSlice';
import {setIsSnoozeModalVisible} from '../redux/modules/menuSlice';
import PrimaryModal from './PrimaryModal';
import {setShowDateModal} from '../redux/modules/orderSlice';
import {strings} from '../i18n';
import {orderReadApi, printOrderApi} from '../services/orderServices';
import {setShowPrinterModal} from '../redux/modules/settingsSlice';
import PushNotificationIOS from '@react-native-community/push-notification-ios';

const NotificationHandler: FC = ({}) => {
  // ******************** Hooks Functions ************************ //
  const delayTimeout = useRef<any>(null);
  const popupTimeout = useRef<any>(null);

  // updating fcm token in server side
  const {profileData} = useSelector((state: RootState) => ({
    profileData: state.profile.profileData,
  }));

  const [fcmToken, setFcmToken] = useState('');

  useEffect(() => {
    if (profileData && profileData?.accessToken) {
      if (fcmToken) {
        (async () => {
          let fcmToken = await getAsyncData(constants.asyncFcmToken);
          if (fcmToken) {
            console.log('updated fcm token', fcmToken);
            fcmAddApi({fcmToken});
          }
        })();
      } else {
        onComponentMount();
      }
    }
  }, [profileData, fcmToken]);

  useEffect(() => {
    notificationService.configure(onOpenNotification, onShowNotification);
    return () => {
      notificationService.unRegister();
      clearTimeout(delayTimeout.current);
      clearTimeout(popupTimeout.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {isNotificationModal, notificationAttention} = useSelector(
    (state: RootState) => ({
      isNotificationModal: state?.generic?.isNotificationModal,
      notificationAttention: state?.generic?.notificationAttention,
    }),
  );

  // ******************** Main Functions ************************ //

  const onShowNotification = (payload: any) => {
    dispatch(setNewNotifiedOrder(payload));
  };

  const onOpenNotification = (notify: any) => {
    console.log('App onOpenNotification:', notify);
    if (notify) {
      dispatch(setIsNotificationModal(false));
      orderReadApi(notify?.orderId);
      if (notify?.orderId) {
        delayTimeout.current = setTimeout(
          () => handleNotificationRoute(notify),
          800,
        );
      }
    }
  };

  const handleNotificationRoute = (notify: any) => {
    // if (getCurrentRoute() == screenName.orderDetails) {
    //   findSingleOrdersApi(notify?.orderId);
    // } else {
    navigate(screenName.orderDetails, {orderId: notify?.orderId});
    // }
  };

  const onComponentMount = async () => {
    await messaging().registerDeviceForRemoteMessages();
    await checkPermission();
    await createNotificationListeners(); //add this line

    if (Platform.OS === 'ios') {
      PushNotificationIOS.getInitialNotification()
        .then(res => {
          console.log('notification handler compount mount', res);
          if (res) {
            // @ts-ignore
            onOpenNotification(res?._data?.item);
          }
        })
        .catch(e => console.log('iOS getInitialNotification ERROR', e));
    }

    messaging().onMessage(async remoteMessage => {
      const {notification, data} = remoteMessage;
      console.log('notification from component did mount', remoteMessage);
      dispatch(setIsOpenDatePicker(true));
      const notificationId = Math.trunc(Math.random() * 10000);
      notificationService.showNotification(
        // @ts-ignore
        notificationId,
        // @ts-ignore
        notification.title,
        // @ts-ignore
        notification.body,
        data,
        {},
      );
      // notificationService.heartbeatAPI();
      if (Platform.OS === 'ios' && data?.orderId) {
        onShowNotification(data);
      }
      if (data?.orderId) {
        if (notificationAttention?.notificationId) {
          notificationService.cancelLocalNotification(
            notificationAttention?.notificationId,
          );
        }
        dispatch(setShowPrinterModal(false));
        dispatch(setShowDateModal(false));
        dispatch(setIsSnoozeModalVisible(false));
        dispatch(setIsLoading(false));
        popupTimeout.current = setTimeout(() => {
          dispatch(setIsOpenDatePicker(false));
          dispatch(setIsNotificationModal(true));
          dispatch(
            setNotificationAttention({
              message: notification?.title,
              orderId: data?.orderId,
              notificationId: `${notificationId}`,
            }),
          );
        }, 800);
      }
      const {
        isPrinterConnected,
        settings: {enablePrinting, autoPrint, printingType, printerMacAddress},
      } = getStore().settings;
      if (autoPrint) {
        if (enablePrinting) {
          if (
            printingType === 'Bluetooth' &&
            isPrinterConnected &&
            printerMacAddress
          ) {
            // @ts-ignore
            findSingleOrdersApi(data?.orderId, 'auto_print');
          } else if (printingType === 'Cloud Print') {
            // @ts-ignore
            printOrderApi(data?.orderId, 'auto_print');
          }
        } else {
          errorToast(strings.msgPrintingDisabled, strings.msgFailure);
        }
      }
    });
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage,
      );
      const {data} = remoteMessage;
      onOpenNotification(data);
    });
  };

  const checkPermission = async () => {
    // authorizationStatus: 1=Authorized, 0=Denied, -1=Not Determined, 2=Provisional
    const authorizationStatus = await messaging().requestPermission({
      sound: true,
      alert: true,
      badge: true,
    });
    console.log('Permission status:', authorizationStatus);
    if (authorizationStatus === 1) {
      console.log('Permission status:-------------------', authorizationStatus);
      await getToken();
    } else if (authorizationStatus === 0) {
      console.log('User denied permissions request');
      errorToast(
        'Notification permissions are not allowed. Please update App notification permissions from settings',
      );
    }
  };

  const getToken = async () => {
    try {
      let fcmToken = await getAsyncData(constants.asyncFcmToken);
      // await messaging().deleteToken();

      const fcmTokenNew = await messaging().getToken();
      console.log('FCM TOKEN async----', fcmToken);
      console.log('FCM TOKEN NEW async----', fcmTokenNew);
      if (fcmToken != fcmTokenNew) {
        console.log('FCM TOKEN null 1');
        fcmToken = fcmTokenNew;
        console.log('FCM TOKEN null 2');
        console.log('FCM TOKEN firebase ----', fcmToken);
        if (fcmToken) {
          // user has a device token
          await setAsyncData(constants.asyncFcmToken, fcmToken);
          console.log('FCM TOKEN AsyncStorageFirebase ----', fcmToken);
        }
      }
      setFcmToken(fcmToken);
    } catch (err) {
      console.log(err);
    }
  };

  const createNotificationListeners = async () => {
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
      // notificationService.heartbeatAPI();
    });
    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage,
          );
          const {data} = remoteMessage;
          onOpenNotification(data);
        }
      })
      .catch(e =>
        console.log(
          'Notification caused app to open from quit state Error:',
          e,
        ),
      );
  };

  return (
    <Fragment>
      <PrimaryModal
        type="notification"
        isVisible={isNotificationModal}
        onClosePress={() => null}
        data={notificationAttention}
      />
    </Fragment>
  );
};

export default NotificationHandler;
