import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {FC} from 'react';
import {screenName} from '../../core';
import OrderDetails from '../orderHistory/OrderDetails';
import MenuScreen from './MenuScreen';

const Stack = createNativeStackNavigator();

export const MenuStack: FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name={screenName.menu} component={MenuScreen} />
      <Stack.Screen name={screenName.orderDetails} component={OrderDetails} />
    </Stack.Navigator>
  );
};
