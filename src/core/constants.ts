export const constants = {
  // API Constants
  // baseUrl: 'https://thebitedev.com/api/',
  // baseUrl: 'https://stagingmyordering.com/api/',
  // baseUrl: 'https://feedbacks.stagingmyordering.com/api/',
  // baseUrl: 'https://multiple-ipad.stagingmyordering.com/api/',
  baseUrl: 'https://app.myordering.online/api/',

  endPtLogin: 'ipad/login',
  endPtFindAllOrders: 'ipad/orders',
  endPtFindOneOrdersApi: 'ipad/orders/',
  endPtOrderHistoryApi: 'ipad/orders/history',
  endPtUpdateOrderStatusApi: (id: string) => `ipad/orders/${id}/status`,
  endPtMenuCategoriesApi: 'ipad/categories',
  endPtMenuItemsApi: (id: string) => `ipad/category/${id}/items`,
  endPtUpdateMenuItemStatusApi: (id: string) => `ipad/item/${id}/status`,
  endPtSendSmsApi: (id: string) => `ipad/orders/${id}/send-sms`,
  endPtPrintOrderApi: (id: string) => `ipad/orders/${id}/print`,
  endPtGetLocationStats: 'ipad/location/stats',
  endPtGetOrderStats: 'ipad/orders/stats',
  endPtSetLocationPrepTime: 'ipad/location/prep-time',
  endPtSetLocationStatus: 'ipad/location/status',
  endPtHeartbeat: 'ipad/heartbeat',
  endPtFcm: 'ipad/fcm',
  endPtOrderRead: (id: string) => `ipad/orders/${id}/mark-read`,
  endPtOrderingItems: 'eat/ordering/items',

  apiSuccess: 'success',
  apiFailure: 'failure',

  // Async Constants
  asyncUserData: 'async/user_data',
  asyncFcmToken: 'async/FCM_token',
  asyncSettings: 'async/app_settings',

  // Notification Constants
  notifyOrderTopic: 'orders_',
};
