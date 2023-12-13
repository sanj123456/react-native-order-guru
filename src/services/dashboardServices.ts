import {constants, errorToast, successToast} from '../core';
import {dispatch, getStore} from '../redux';
import {
  setAllOrderData,
  setIsLoadingMore,
  setIsRefreshing,
  setOrderStats,
  setPrepTime,
} from '../redux/modules/dashboardSlice';
import {setIsLoading} from '../redux/modules/genericSlice';
import {FindAllOrderParams} from '../types/apiDataTypes';
import {get, put} from './request';

export const findAllOrdersApi = (
  payload: any,
  type?: 'refreshing' | 'load_more' | 'notification' | 'stats_only',
) => {
  type != 'notification' &&
    dispatch(
      type == 'refreshing'
        ? setIsRefreshing(true)
        : type == 'load_more'
        ? setIsLoadingMore(true)
        : setIsLoading(true),
    );
  get(constants.endPtFindAllOrders, payload)
    .then(res => {
      console.log(res);
      if (res?.status == constants.apiSuccess) {
        const allOrderData = getStore().dashboard.allOrderData;
        dispatch(
          type == 'stats_only'
            ? setAllOrderData({
                ...allOrderData,
                stats: res?.data?.stats,
              })
            : type == 'load_more'
            ? setAllOrderData({
                ...res?.data,
                results: [...allOrderData?.results, ...res?.data?.results],
              })
            : setAllOrderData(res?.data),
        );
      } else {
        errorToast(res?.message);
      }
      type != 'notification' &&
        dispatch(
          type == 'refreshing'
            ? setIsRefreshing(false)
            : type == 'load_more'
            ? setIsLoadingMore(false)
            : setIsLoading(false),
        );
    })
    .catch(e => {
      console.log('API ERROR', e);
      type != 'notification' &&
        dispatch(
          type == 'refreshing'
            ? setIsRefreshing(false)
            : type == 'load_more'
            ? setIsLoadingMore(false)
            : setIsLoading(false),
        );
    });
};

export const getLocationStatsApi = () => {
  dispatch(setIsLoading(true));
  get(constants.endPtGetLocationStats)
    .then(res => {
      if (res?.status == constants.apiSuccess) {
        dispatch(setPrepTime(res?.data));
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

export const setLocationPrepTimeApi = (data: any) => {
  dispatch(setIsLoading(true));
  put(constants.endPtSetLocationPrepTime, data)
    .then(res => {
      if (res?.status == constants.apiSuccess) {
        getLocationStatsApi();
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

export const setLocationStatusApi = (data: any) => {
  dispatch(setIsLoading(true));
  put(constants.endPtSetLocationStatus, data)
    .then(res => {
      if (res?.status == constants.apiSuccess) {
        getLocationStatsApi();
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

export const getOrderStatsApi = () => {
  get(constants.endPtGetOrderStats)
    .then(res => {
      if (res?.status == constants.apiSuccess) {
        dispatch(setOrderStats(res?.data?.result));
      } else {
        errorToast(res?.message);
      }
    })
    .catch(e => {
      console.log('API ERROR', e);
    });
};
