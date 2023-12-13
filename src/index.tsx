import React, {FC, useEffect} from 'react';
import {View} from 'react-native';
import MainNavigator from './navigation/MainNavigator';
import {commonStyles} from './styles';
import FlashMessage from 'react-native-flash-message';
import {
  DeviceNotSupported,
  Loader,
  NoInternet,
  NotificationHandler,
} from './components';
import SplashScreen from 'react-native-splash-screen';
import {Provider} from 'react-redux';
import store from './redux';

const App: FC = ({}) => {
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <Provider store={store}>
      <View style={commonStyles.mainView}>
        <MainNavigator />
        <NoInternet />
        <Loader />
        <DeviceNotSupported />
        <NotificationHandler />
        <FlashMessage duration={4000} color={'#ffffff'} />
      </View>
    </Provider>
  );
};

export default App;
