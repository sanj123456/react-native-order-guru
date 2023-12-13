import {screenName} from '../core';
import {Login} from '../modules/auth';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {FC} from 'react';

const Stack = createNativeStackNavigator();

export const AuthNavigator: FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name={screenName.login} component={Login} />
    </Stack.Navigator>
  );
};
