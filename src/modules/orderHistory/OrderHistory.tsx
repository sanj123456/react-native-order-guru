/* eslint-disable react-native/no-inline-styles */
import React, {FC, useCallback, useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {
  FieldInputDate,
  NoDataFound,
  OrderItem,
  PrimaryText,
  SecondaryHeader,
} from '../../components';
import {strings} from '../../i18n';
import {colors, commonStyles, fonts} from '../../styles';
import moment from 'moment';
import {OrderHistoryParams} from '../../types/apiDataTypes';
import {orderHistoryApi} from '../../services';
import {CommonNavigationProps} from '../../types/navigationTypes';
import {compareScreenWidth, dateTimeComparison, errorToast} from '../../core';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux';
import {is} from 'immer/dist/internal';
import { useFocusEffect } from '@react-navigation/native';

const OrderHistory: FC<CommonNavigationProps> = ({navigation, route}) => {
  /********* Hooks Functions **********/
  const {
    orderHistoryData,
    isRefreshingOrderHistory,
    isLoadingMoreOrderHistory,
    newNotifiedOrder,
  } = useSelector((state: RootState) => ({
    orderHistoryData: state.order.orderHistoryData,
    isRefreshingOrderHistory: state.order.isRefreshingOrderHistory,
    isLoadingMoreOrderHistory: state.order.isLoadingMoreOrderHistory,
    newNotifiedOrder: state.dashboard.newNotifiedOrder,
  }));
  const [showDateOption, setShowDateOption] = useState(false);

  const [screenParamData, setScreenParamData] = useState<OrderHistoryParams>({
    limit: 20,
    page: 0,
    sort: 'desc',
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    orderHistoryApi(
      {
        ...screenParamData,
        page: 0,
      },
      newNotifiedOrder?.orderId ? 'notification' : undefined,
    );
    setScreenParamData({
      ...screenParamData,
      page: 0,
    });
    return () => {};
  }, [newNotifiedOrder?.orderId]);

  useFocusEffect(
    useCallback(() => {
      const refInterval = setInterval(handleRefresh, 5 * 60 * 1000);
      return () => {
        clearInterval(refInterval);
      };
    }, []),
  );

  /********* Main Functions *********/

  const handleRefresh = () => {
    orderHistoryApi(
      {
        ...screenParamData,
        page: 0,
      },
      'refreshing',
    );
    setScreenParamData({
      ...screenParamData,
      page: 0,
    });
  };

  const getMoreOrder = () => {
    if (
      orderHistoryData?.results?.length < orderHistoryData?.total &&
      !isLoadingMoreOrderHistory
    ) {
      orderHistoryApi(
        {
          ...screenParamData,
          page: screenParamData?.page + 1,
        },
        'load_more',
      );
      setScreenParamData({
        ...screenParamData,
        page: screenParamData?.page + 1,
      });
    }
  };

  const handleApplyDateFilter = () => {
    orderHistoryApi({
      ...screenParamData,
      page: 0,
    });
    setScreenParamData({
      ...screenParamData,
      page: 0,
    });
  };

  const handleClearDateFilter = () => {
    orderHistoryApi({
      ...screenParamData,
      page: 0,
      startDate: '',
      endDate: '',
    });
    setScreenParamData({
      ...screenParamData,
      page: 0,
      startDate: '',
      endDate: '',
    });
    // setShowDateOption(false);
  };

  return (
    <View
      style={{
        ...commonStyles.mainView,
        backgroundColor: colors.white,
      }}>
      <SecondaryHeader title={strings.ctOrderHistory} />

      <PrimaryText
        style={{
          ...fonts.regular48,
          color: colors.historyText,
          alignSelf: 'center',
        }}>
        {strings.ctLastWeekOrders}
      </PrimaryText>

      {/* Render Select Date View */}
      <View style={styles.selectDateMainWrapper}>
        <TouchableOpacity
          onPress={() => setShowDateOption(true)}
          style={{
            ...styles.selectDateButton,
            width: showDateOption
              ? compareScreenWidth()
                ? '80%'
                : '75%'
              : '100%',
          }}>
          <PrimaryText style={{...fonts.regular36, color: colors.white}}>
            {strings.ctSelectDate}
          </PrimaryText>
        </TouchableOpacity>

        {showDateOption && (
          <TouchableOpacity
            onPress={handleApplyDateFilter}
            style={styles.applyButton}>
            <PrimaryText style={styles.applyText}>
              {strings.ctApply}
            </PrimaryText>
          </TouchableOpacity>
        )}

        {showDateOption && (
          <TouchableOpacity
            onPress={handleClearDateFilter}
            style={styles.applyButton}>
            <PrimaryText style={styles.applyText}>
              {strings.ctClear}
            </PrimaryText>
          </TouchableOpacity>
        )}
      </View>

      {showDateOption && (
        <View
          style={{
            ...commonStyles.horizontalCenterStyles,
            justifyContent: 'space-between',
            width: '100%',
            marginBottom: 10,
            paddingHorizontal: 15,
          }}>
          <View
            style={{
              ...commonStyles.horizontalCenterStyles,
            }}>
            <PrimaryText
              style={{
                ...fonts.medium36,
                color: colors.selectDateButton,
                marginRight: 5,
              }}>
              {strings.ctFromDate}:
            </PrimaryText>
            <FieldInputDate
              inputStyles={{
                color:
                  screenParamData?.startDate === ''
                    ? colors.placeholderText
                    : colors.primaryText,
              }}
              maximumDate={new Date()}
              value={
                screenParamData?.startDate === ''
                  ? strings.ctFromDate
                  : moment(screenParamData?.startDate).format(
                      'DD MMM YYYY hh:mm A',
                    )
              }
              onChange={(date: Date) =>
                dateTimeComparison(new Date(), date)
                  ? setScreenParamData({
                      ...screenParamData,
                      startDate: date.toISOString(),
                    })
                  : errorToast(
                      strings.msgFromDateMore,
                      strings.msgDateSelection,
                    )
              }
            />
          </View>

          <View
            style={{
              ...commonStyles.horizontalCenterStyles,
            }}>
            <PrimaryText
              style={{
                ...fonts.medium36,
                color: colors.selectDateButton,
                marginRight: 5,
              }}>
              {strings.ctToDate}:
            </PrimaryText>
            <FieldInputDate
              inputStyles={{
                color:
                  screenParamData?.endDate == ''
                    ? colors.placeholderText
                    : colors.primaryText,
              }}
              maximumDate={new Date()}
              value={
                screenParamData?.endDate == ''
                  ? strings.ctToDate
                  : moment(screenParamData?.endDate).format(
                      'DD MMM YYYY hh:mm A',
                    )
              }
              onChange={(date: Date) =>
                !dateTimeComparison(new Date(), date) &&
                screenParamData?.startDate == ''
                  ? errorToast(strings.msgToDateMore, strings.msgDateSelection)
                  : !dateTimeComparison(new Date(), date) &&
                    !dateTimeComparison(date, screenParamData?.startDate)
                  ? errorToast(
                      strings.msgToDateBetween,
                      strings.msgDateSelection,
                    )
                  : setScreenParamData({
                      ...screenParamData,
                      endDate: date.toISOString(),
                    })
              }
            />
          </View>
        </View>
      )}

      {/* Render List data */}

      {orderHistoryData?.results?.length > 0 ? (
        <FlatList
          refreshing={isRefreshingOrderHistory}
          onRefresh={handleRefresh}
          contentContainerStyle={{
            ...styles.contentContainerStyle,
            backgroundColor:
              orderHistoryData?.results?.length > 0
                ? colors.primary
                : colors.white,
          }}
          data={orderHistoryData?.results}
          keyExtractor={(item, index) => `${index}_ListData`}
          renderItem={({item, index}) => (
            <OrderItem data={item} index={index} />
          )}
          onEndReachedThreshold={0.8}
          onEndReached={getMoreOrder}
          ListFooterComponent={() =>
            isLoadingMoreOrderHistory ? (
              <View>
                <ActivityIndicator color={colors.secondary} size="large" />
              </View>
            ) : null
          }
        />
      ) : (
        <NoDataFound />
      )}
    </View>
  );
};

export default OrderHistory;

const styles = StyleSheet.create({
  selectDateMainWrapper: {
    ...commonStyles.horizontalCenterStyles,
    width: '100%',
    alignSelf: 'center',
    marginBottom: 15,
    marginTop: 10,
    paddingHorizontal: 15,
  },
  selectDateButton: {
    height: 35,
    backgroundColor: colors.selectDateButton,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainerStyle: {
    paddingHorizontal: '5%',
    paddingBottom: 30,
    paddingTop: 5,
  },
  applyButton: {
    height: 35,
    paddingHorizontal: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.selectDateButton,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15,
  },
  applyText: {
    ...fonts.regular36,
    color: colors.selectDateButton,
  },
});
