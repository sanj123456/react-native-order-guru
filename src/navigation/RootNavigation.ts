// RootNavigation.js

import {
  CommonActions,
  createNavigationContainerRef,
  StackActions,
} from '@react-navigation/native';

export const navigationRef: any = createNavigationContainerRef();

export function navigate(name: string, params?: any) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
}

// add other navigation functions that you need and export them

export function getCurrentRoute() {
  if (navigationRef.isReady()) {
    return navigationRef.getCurrentRoute()?.name;
  }
}

export function resetNavigation(name: string, params?: any) {
  navigationRef.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [{name, params}],
    }),
  );
}

export function resetNavigationRoute(
  routes: {name: string; params?: any}[],
  index?: number,
) {
  navigationRef.dispatch(
    CommonActions.reset({
      /**
       * if @param index is not provided then the last pushed route will appear as current screen
       **/
      index: index ?? routes.length - 1,

      /**
       * New route array that will replace the old stacked routes
       **/
      routes,
    }),
  );
}

// Replace current route with provided one
export function replaceCurrentRoute(name: string, params?: any) {
  navigationRef?.dispatch(StackActions.replace(name, params));
}
