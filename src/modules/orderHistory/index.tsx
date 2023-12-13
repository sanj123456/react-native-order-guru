import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {FC} from 'react';
import {screenName} from '../../core';
import OrderDetails from './OrderDetails';
import OrderHistory from './OrderHistory';

const Stack = createNativeStackNavigator();

export const OrderHistoryStack: FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name={screenName.orderHistory} component={OrderHistory} />
      <Stack.Screen name={screenName.orderDetails} component={OrderDetails} />
    </Stack.Navigator>
  );
};
