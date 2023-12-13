import {constants, errorToast, successToast} from '../core';
import {strings} from '../i18n';
import {dispatch, getStore} from '../redux';
import {setAllOrderData} from '../redux/modules/dashboardSlice';
import {setIsLoading} from '../redux/modules/genericSlice';
import {
  setIsLoadingMoreOrderHistory,
  setIsLoadingSingleOrder,
  setIsRefreshingOrderHistory,
  setOrderHistoryData,
  setOrderingItems,
  setSingleOrderData,
} from '../redux/modules/orderSlice';
import {findAllOrdersApi} from './dashboardServices';
import {printerServices} from './printerServices';
import {get, put} from './request';

export const findSingleOrdersApi = (
  orderId: string,
  type?: 'auto_print' | undefined,
) => {
  if (type != 'auto_print') {
    dispatch(setIsLoadingSingleOrder(true));
    dispatch(setIsLoading(true));
  }
  get(`${constants.endPtFindOneOrdersApi}${orderId}`)
    .then(res => {
      if (res?.status == constants.apiSuccess) {
        if (type != 'auto_print') {
          dispatch(setSingleOrderData(res?.data?.result));
        }
        const location =
          getStore().profile.profileData?.user?.ipadDevice?.location;

        get(constants.endPtOrderingItems, {location}).then(resoi => {
          console.log('OrderingItems', resoi?.data?.data);
          if (resoi?.status == constants.apiSuccess) {
            dispatch(setOrderingItems(resoi?.data?.data));
            if (type == 'auto_print') {
              setTimeout(
                () => printerServices.handleBluetoothPrint(res?.data?.result),
                1000,
              );
            }
          }
        });
      } else {
        errorToast(res?.message);
      }
      dispatch(setIsLoadingSingleOrder(false));
      dispatch(setIsLoading(false));
    })
    .catch(e => {
      console.log('API ERROR', e);
      dispatch(setIsLoadingSingleOrder(false));
      dispatch(setIsLoading(false));
    });
};

export const orderHistoryApi = (
  payload: any,
  type?: 'refreshing' | 'load_more' | 'notification',
) => {
  {
    type != 'notification' &&
      dispatch(
        type == 'refreshing'
          ? setIsRefreshingOrderHistory(true)
          : type == 'load_more'
          ? setIsLoadingMoreOrderHistory(true)
          : setIsLoading(true),
      );
  }
  let newPayload = {
    limit: payload?.limit,
    page: payload?.page,
    sort: payload?.sort,
  };
  if (payload?.startDate != '') {
    Object.assign(newPayload, {startDate: payload?.startDate});
  }
  if (payload?.endDate != '') {
    Object.assign(newPayload, {endDate: payload?.endDate});
  }

  get(constants.endPtOrderHistoryApi, newPayload)
    .then(res => {
      if (res?.status == constants.apiSuccess) {
        const orderHistoryData = getStore().order.orderHistoryData;
        dispatch(
          type == 'load_more'
            ? setOrderHistoryData({
                ...res?.data,
                results: [...orderHistoryData?.results, ...res?.data?.results],
              })
            : setOrderHistoryData(res?.data),
        );
      } else {
        errorToast(res?.message);
      }
      dispatch(
        type == 'refreshing'
          ? setIsRefreshingOrderHistory(false)
          : type == 'load_more'
          ? setIsLoadingMoreOrderHistory(false)
          : setIsLoading(false),
      );
    })
    .catch(e => {
      console.log('API ERROR', e);
      dispatch(
        type == 'refreshing'
          ? setIsRefreshingOrderHistory(false)
          : type == 'load_more'
          ? setIsLoadingMoreOrderHistory(false)
          : setIsLoading(false),
      );
    });
};

export const updateOrderStatusApi = (
  orderId: string,
  data: any,
  dashboardTab?: 'prepare' | 'ordered' | 'upcoming' | undefined,
) => {
  dispatch(setIsLoading(true));
  put(constants.endPtUpdateOrderStatusApi(orderId), data)
    .then(res => {
      if (res?.status == constants.apiSuccess) {
        const allOrderData = getStore().dashboard.allOrderData;
        const orderHistoryData = getStore().order.orderHistoryData;
        successToast(strings.msgChangeOrderStatusSuccess);
        findSingleOrdersApi(orderId);
        const newAllOrderArray = {
          ...allOrderData,
          results: allOrderData.results.map(item =>
            item?._id == orderId ? {...item, ...data} : item,
          ),
        };
        const newOrderHistoryArray = {
          ...orderHistoryData,
          results: orderHistoryData.results.map(item =>
            item?._id == orderId ? {...item, ...data} : item,
          ),
        };
        dispatch(setAllOrderData(newAllOrderArray));
        dispatch(setOrderHistoryData(newOrderHistoryArray));
        {
          dashboardTab &&
            findAllOrdersApi(
              {
                tab: dashboardTab,
                limit: 20,
                page: 0,
                sort: 'desc',
                statuses: ['pending', 'prepared', 'delivered'],
              },
              'stats_only',
            );
        }
      } else {
        errorToast(res?.message);
      }
      dispatch(setIsLoading(false));
    })
    .catch(e => {
      console.log('API ERROR', e);
      dispatch(setIsLoading(false));
    });
};

export const sendSmsApi = (orderId: string) => {
  dispatch(setIsLoading(true));
  put(constants.endPtSendSmsApi(orderId), {})
    .then(res => {
      if (res?.status == constants.apiSuccess) {
        successToast(strings.msgSmsSent);
      } else {
        errorToast(res?.message);
      }
      dispatch(setIsLoading(false));
    })
    .catch(e => {
      console.log('API ERROR', e);
      dispatch(setIsLoading(false));
    });
};

export const printOrderApi = (
  orderId: string,
  type?: 'auto_print' | undefined,
) => {
  type != 'auto_print' && dispatch(setIsLoading(true));
  put(constants.endPtPrintOrderApi(orderId), {})
    .then(res => {
      if (res?.status == constants.apiSuccess) {
        successToast(res?.message);
      } else {
        errorToast(res?.message);
      }
      type != 'auto_print' && dispatch(setIsLoading(false));
    })
    .catch(e => {
      console.log('API ERROR', e);
      type != 'auto_print' && dispatch(setIsLoading(false));
    });
};

export const orderReadApi = (orderId: string) => {
  put(constants.endPtOrderRead(orderId), {})
    .then(res => {
      if (res?.status === constants.apiSuccess) {
        const allOrderData = getStore().dashboard.allOrderData;
        const newAllOrderArray = {
          ...allOrderData,
          results: allOrderData.results.map(item =>
            item?._id === orderId ? {...item, readByTablet: true} : item,
          ),
        };
        dispatch(setAllOrderData(newAllOrderArray));
      } else {
        errorToast(res?.message);
      }
    })
    .catch(e => {
      console.log('API ERROR', e);
    });
};
