import React, {FC, useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  AppState,
  useWindowDimensions,
  View,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {AuthNavigator} from './AuthNavigator';
import {constants, screenName} from '../core';
import {AppNavigator} from './AppNavigator';
import {getAsyncData} from '../services';
import {colors, commonStyles} from '../styles';
import {useSelector} from 'react-redux';
import {dispatch, RootState} from '../redux';
import {setProfileData} from '../redux/modules/profileSlice';
import {navigationRef} from './RootNavigation';
import {setAppStateVisible} from '../redux/modules/genericSlice';
import {updateSettings} from '../redux/modules/settingsSlice';
import {printerServices} from '../services/printerServices';
import crashlytics from '@react-native-firebase/crashlytics';
import {Bugfender, LogLevel} from '@bugfender/rn-bugfender';

const Stack = createNativeStackNavigator();

const MainNavigator: FC = ({}) => {
  /*********** Props and data destructuring ***********/

  /*********** Hooks Functions ***********/
  const {width} = useWindowDimensions();
  const [showApp, setShowApp] = useState<'App' | 'Auth' | 'none'>('none');
  const [isVisible, setIsVisible] = useState(false);
  const {profileData, printerMacAddress, isPrinterConnected} = useSelector(
    (state: RootState) => ({
      profileData: state.profile.profileData,
      printerMacAddress: state.settings.settings.printerMacAddress,
      isPrinterConnected: state.settings.isPrinterConnected,
    }),
  );

  const appState = useRef(AppState.currentState);
  let checkPrinterStatusTimer = useRef<any>(null).current;

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log('App has come to the foreground!');
      }

      appState.current = nextAppState;
      dispatch(setAppStateVisible(appState.current));
      console.log('AppState', appState.current);
    });
    getSettings();
    toggleCrashlytics();
    Bugfender.init({appKey: 'BZEuqXTJQkQrAYV1By1w35MX2klMEm7W'});

    return () => {
      subscription.remove();
      clearInterval(checkPrinterStatusTimer);
    };
  }, []);

  useEffect(() => {
    if (isVisible) {
      console.log('profileData', profileData);
      if (profileData && profileData?.accessToken) {
        setShowApp('App');
      } else {
        setShowApp('Auth');
      }
    } else {
      getUser();
    }
  }, [profileData]);

  // useEffect(() => {
  //   if (showApp === 'App') {
  //     if (!isPrinterConnected && printerMacAddress) {
  //       printerServices.connectToBluetoothPrinter();
  //     } else if (isPrinterConnected && printerMacAddress) {
  //       printerServices.checkBluetoothPrinterStatus();
  //       checkPrinterStatusTimer = setInterval(() => {
  //         printerServices.checkBluetoothPrinterStatus();
  //       }, 1000 * 60 * 1);
  //     }
  //   }
  // }, [printerMacAddress, isPrinterConnected, showApp]);

  useEffect(() => {
    if (!isPrinterConnected && printerMacAddress) {
      printerServices.connectToBluetoothPrinter();
    }
  }, [printerMacAddress, isPrinterConnected]);

  /*********** Main Functions ***********/

  const toggleCrashlytics = async () => {
    await crashlytics()
      .setCrashlyticsCollectionEnabled(true)
      .then(() => {
        console.log(
          'isCrashlyticsCollectionEnabled',
          crashlytics().isCrashlyticsCollectionEnabled,
        );
      });
  };

  const getSettings = async () => {
    const settings = await getAsyncData(constants.asyncSettings);
    if (settings) {
      dispatch(updateSettings(settings));
    }
  };

  const getUser = async () => {
    const user = await getAsyncData(constants.asyncUserData);
    if (user) {
      dispatch(setProfileData(user));
      setIsVisible(true);
    } else {
      setIsVisible(true);
      setShowApp('Auth');
    }
  };

  const LoadingApp = () => {
    return (
      <View
        style={{
          ...commonStyles.mainView,
          ...commonStyles.containerCenter,
          backgroundColor: colors.primary,
        }}>
        <ActivityIndicator size={'large'} color={colors.secondary} />
      </View>
    );
  };

  return (
    <View style={commonStyles.mainView}>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}>
          {profileData && profileData?.accessToken && showApp == 'App' ? (
            <Stack.Screen name={screenName.app} component={AppNavigator} />
          ) : showApp == 'Auth' ? (
            <Stack.Screen name={screenName.auth} component={AuthNavigator} />
          ) : (
            <Stack.Screen name={screenName.loadingApp} component={LoadingApp} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
};

export default MainNavigator;
