import {createDrawerNavigator} from '@react-navigation/drawer';
import {FC} from 'react';
import {AppDrawer} from '../components';
import {screenName} from '../core';
import {DashboardStack} from '../modules/dashboard';
import {MenuStack} from '../modules/menu';
import {OrderHistoryStack} from '../modules/orderHistory';
import {SettingsStack} from '../modules/settings';

const Drawer = createDrawerNavigator();

export const AppNavigator: FC = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerStyle: {width: '55%'},
        drawerType: 'front',
        headerShown: false,
      }}
      drawerContent={() => <AppDrawer />}>
      <Drawer.Screen
        name={screenName.dashboardStack}
        component={DashboardStack}
      />
      <Drawer.Screen
        name={screenName.orderHistoryStack}
        component={OrderHistoryStack}
      />
      <Drawer.Screen name={screenName.menuStack} component={MenuStack} />
      <Drawer.Screen
        name={screenName.settingsStack}
        component={SettingsStack}
      />
    </Drawer.Navigator>
  );
};
