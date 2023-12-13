import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {FC} from 'react';
import {screenName} from '../../core';
import OrderDetails from '../orderHistory/OrderDetails';
import Dashboard from './Dashboard';

const Stack = createNativeStackNavigator();

export const DashboardStack: FC = ({}) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name={screenName.dashboard} component={Dashboard} />
      <Stack.Screen name={screenName.orderDetails} component={OrderDetails} />
    </Stack.Navigator>
  );
};
