import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {FC} from 'react';
import {screenName} from '../../core';
import OrderDetails from '../orderHistory/OrderDetails';
import PrinterSettings from './PrinterSettings';

const Stack = createNativeStackNavigator();

export const SettingsStack: FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name={screenName.printerSettings}
        component={PrinterSettings}
      />
      <Stack.Screen name={screenName.orderDetails} component={OrderDetails} />
    </Stack.Navigator>
  );
};
