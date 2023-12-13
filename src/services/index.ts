import {getAsyncData, removeAsyncData, setAsyncData} from './asyncServices';
import {fcmAddApi, fcmRemoveApi, loginAPI} from './authServices';
import {
  findAllOrdersApi,
  getLocationStatsApi,
  getOrderStatsApi,
  setLocationPrepTimeApi,
  setLocationStatusApi,
} from './dashboardServices';
import {
  allMenuCategoriesApi,
  menuItemsApi,
  updateMenuItemStatusApi,
} from './menuServices';
import {notificationService} from './notificationService';
import {
  findSingleOrdersApi,
  orderHistoryApi,
  orderReadApi,
  updateOrderStatusApi,
} from './orderServices';

export {
  // Async functions
  setAsyncData,
  getAsyncData,
  removeAsyncData,

  //Auth APIs
  loginAPI,
  fcmRemoveApi,
  fcmAddApi,

  // Dashboard APIs
  findAllOrdersApi,
  getLocationStatsApi,
  setLocationPrepTimeApi,
  setLocationStatusApi,
  getOrderStatsApi,

  // Orders APIs
  findSingleOrdersApi,
  orderHistoryApi,
  updateOrderStatusApi,
  orderReadApi,

  // Menu APIs
  allMenuCategoriesApi,
  menuItemsApi,
  updateMenuItemStatusApi,

  // Notification Service
  notificationService,
};
