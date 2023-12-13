import {constants, errorToast, successToast} from '../core';
import {dispatch, getStore} from '../redux';
import {setIsLoading} from '../redux/modules/genericSlice';
import {
  setAllMenuCategoriesData,
  setIsLoadingMoreMenu,
  setIsMenuRefreshing,
  setIsRefreshingMenuCategories,
  setMenuItemsData,
} from '../redux/modules/menuSlice';
import {menuItemDataTypes} from '../types/storeTypes';
import {get, put} from './request';

export const allMenuCategoriesApi = (type?: 'refreshing') => {
  dispatch(
    type == 'refreshing'
      ? setIsRefreshingMenuCategories(true)
      : setIsLoading(true),
  );
  get(constants.endPtMenuCategoriesApi)
    .then(res => {
      if (res?.status == constants.apiSuccess) {
        dispatch(setAllMenuCategoriesData(res?.data?.result));
      } else {
        errorToast(res?.message);
      }
      dispatch(
        type == 'refreshing'
          ? setIsRefreshingMenuCategories(false)
          : setIsLoading(false),
      );
    })
    .catch(e => {
      console.log('API ERROR', e);
      dispatch(
        type == 'refreshing'
          ? setIsRefreshingMenuCategories(false)
          : setIsLoading(false),
      );
    });
};

export const menuItemsApi = (
  id: string,
  params: any,
  type?: 'refreshing' | 'load_more' | 'search',
) => {
  type == 'search'
    ? null
    : dispatch(
        type == 'refreshing'
          ? setIsMenuRefreshing(true)
          : type == 'load_more'
          ? setIsLoadingMoreMenu(true)
          : setIsLoading(true),
      );
  get(constants.endPtMenuItemsApi(id), params)
    .then(res => {
      if (res?.status == constants.apiSuccess) {
        const menuItemsData = getStore().menu.menuItemsData;
        dispatch(
          type == 'load_more'
            ? setMenuItemsData({
                ...res?.data,
                results: [...menuItemsData?.results, ...res?.data?.results],
              })
            : setMenuItemsData(res?.data),
        );
      } else {
        errorToast(res?.message);
      }
      type == 'search'
        ? null
        : dispatch(
            type == 'refreshing'
              ? setIsMenuRefreshing(false)
              : type == 'load_more'
              ? setIsLoadingMoreMenu(false)
              : setIsLoading(false),
          );
    })
    .catch(e => {
      console.log('API ERROR', e);
      type == 'search'
        ? null
        : dispatch(
            type == 'refreshing'
              ? setIsMenuRefreshing(false)
              : type == 'load_more'
              ? setIsLoadingMoreMenu(false)
              : setIsLoading(false),
          );
    });
};

export const updateMenuItemStatusApi = (
  id: string,
  data: any,
  type: 'snooze' | 'status',
) => {
  dispatch(setIsLoading(true));
  put(constants.endPtUpdateMenuItemStatusApi(id), data)
    .then(res => {
      if (res?.status == constants.apiSuccess) {
        const menuItemsData = getStore().menu.menuItemsData;
        dispatch(
          setMenuItemsData({
            ...menuItemsData,
            results: menuItemsData?.results?.map(
              (item: menuItemDataTypes, index: number) =>
                item?._id == id
                  ? {
                      ...item,
                      ...(type == 'snooze'
                        ? {
                            status: false,
                            snoozedTill: data?.snoozeType,
                          }
                        : data),
                    }
                  : item,
            ),
          }),
        );
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
