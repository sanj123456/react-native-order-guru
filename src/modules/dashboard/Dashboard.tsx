import {useFocusEffect} from '@react-navigation/native';
import React, {
  FC,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  RefreshControl,
  ActivityIndicator,
  Animated,
} from 'react-native';
import {useSelector} from 'react-redux';
import {
  NoDataFound,
  OrderItem,
  PrimaryHeader,
  PrimaryText,
} from '../../components';
import {compareScreenWidth, successToast, images} from '../../core';
import {strings} from '../../i18n';
import {RootState} from '../../redux';
import {
  findAllOrdersApi,
  getLocationStatsApi,
  getOrderStatsApi,
  notificationService,
  setLocationPrepTimeApi,
} from '../../services';
import {colors, commonStyles, fonts} from '../../styles';
import {FindAllOrderParams} from '../../types/apiDataTypes';
import {CommonNavigationProps} from '../../types/navigationTypes';
import {showMessage} from 'react-native-flash-message';

const Dashboard: FC<CommonNavigationProps> = ({}) => {
  /********* Props & data structuring *********/
  const timeData = [10, 15, 20, 30, 45, 60];
  const tabsData = [
    {label: 'Prepare TODAY', value: 'prepare'},
    {label: 'Ordered TODAY', value: 'ordered'},
    {label: 'Upcoming', value: 'upcoming'},
  ];

  /********* Hooks Functions *********/
  const {
    allOrderData,
    isRefreshing,
    isLoadingMore,
    prepTime,
    orderStats,
    noInternet,
    newNotifiedOrder,
    appStateVisible,
  } = useSelector((state: RootState) => ({
    allOrderData: state.dashboard.allOrderData,
    isRefreshing: state.dashboard.isRefreshing,
    isLoadingMore: state.dashboard.isLoadingMore,
    prepTime: state.dashboard.prepTime,
    orderStats: state.dashboard.orderStats,
    noInternet: state.generic.noInternet,
    appStateVisible: state.generic.appStateVisible,
    newNotifiedOrder: state.dashboard.newNotifiedOrder,
  }));

  const [screenParamData, setScreenParamData] = useState<FindAllOrderParams>({
    tab: 'prepare',
    limit: 20,
    page: 0,
    sort: 'desc',
  });
  const [activePrepTimeFor, setActivePrepTimeFor] = useState<
    'delivery' | 'pickup'
  >('pickup');
  const [statusData, setStatusData] = useState([
    {
      label: 'Pending',
      value: true,
      statusValue: 'pending',
    },
    {
      label: 'Prepared',
      value: true,
      statusValue: 'prepared',
    },
    {
      label: 'Delivered',
      value: true,
      statusValue: 'delivered',
    },
  ]);
  // This array depend on statusData state array
  const statusCountData = [
    allOrderData?.stats?.pending,
    allOrderData?.stats?.prepared,
    allOrderData?.stats?.delivered,
  ];

  const convertData = (payload: any[]) => {
    const newArray = payload.filter(item => item?.value);
    return newArray.map(item => `${item?.statusValue}`);
  };
  const flashAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(flashAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false,
        }),
        Animated.timing(flashAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: false,
        }),
      ]),
    ).start();
    notificationService.heartbeatAPI();
    const refInterval = setInterval(
      notificationService.heartbeatAPI,
      10 * 60 * 1000,
    );
    return () => {
      clearInterval(refInterval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFocusEffect(
    useCallback(() => {
      setStatusData(prev => {
        return [...prev];
      });
      const refInterval = setInterval(handleRefresh, 5 * 60 * 1000);
      return () => {
        clearInterval(refInterval);
      };
    }, []),
  );

  useEffect(() => {
    handleRefresh();
  }, [statusData]);

  useEffect(() => {
    if (screenParamData?.tab === 'prepare') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(flashAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: false,
          }),
          Animated.timing(flashAnim, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: false,
          }),
        ]),
      ).start();
    } else {
      flashAnim.stopAnimation();
    }
    if (!noInternet && appStateVisible == 'active') {
      getLocationStatsApi();
      getOrderStatsApi();
      findAllOrdersApi({
        ...screenParamData,
        page: 0,
        statuses: convertData(statusData),
      });
      setScreenParamData({
        ...screenParamData,
        page: 0,
      });
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screenParamData?.tab, noInternet, appStateVisible]);

  useEffect(() => {
    const newString =
      newNotifiedOrder?.orderTiming === 'now'
        ? 'prepare'
        : newNotifiedOrder?.orderTiming === 'later'
        ? 'upcoming'
        : '';
    if (
      newNotifiedOrder?.orderId &&
      !noInternet &&
      (screenParamData?.tab === newString || screenParamData.tab === 'ordered')
    ) {
      findAllOrdersApi(
        {
          ...screenParamData,
          page: 0,
          statuses: convertData(statusData),
        },
        newNotifiedOrder?.orderId ? 'notification' : undefined,
      );
      setScreenParamData({
        ...screenParamData,
        page: 0,
      });
    }
    getOrderStatsApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newNotifiedOrder?.orderId]);

  /********* Main Functions *********/
  const isCloseToBottom = ({
    layoutMeasurement,
    contentOffset,
    contentSize,
  }: any) => {
    const paddingToBottom = 20;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };

  const handleRefresh = () => {
    getOrderStatsApi();
    getLocationStatsApi();
    findAllOrdersApi(
      {
        ...screenParamData,
        page: 0,
        statuses: convertData(statusData),
      },
      'refreshing',
    );
    setScreenParamData({
      ...screenParamData,
      page: 0,
    });
  };

  const handleLoadMore = () => {
    findAllOrdersApi(
      {
        ...screenParamData,
        page: screenParamData?.page + 1,
        statuses: convertData(statusData),
      },
      'load_more',
    );
    setScreenParamData({
      ...screenParamData,
      page: screenParamData?.page + 1,
    });
  };

  const handleStatusSelect = (payload: any) => () => {
    const newArray = statusData.map(item =>
      item?.statusValue == payload?.statusValue
        ? {
            ...item,
            value: !payload?.value,
          }
        : item,
    );
    findAllOrdersApi({
      ...screenParamData,
      page: 0,
      statuses: convertData(newArray),
    });
    setScreenParamData({
      ...screenParamData,
      page: 0,
    });
    setStatusData(newArray);
  };

  return (
    <View style={commonStyles.mainView}>
      <PrimaryHeader title={strings.ctDashboard} left="menu" />
      {prepTime?.status === false && (
        <View style={styles.disabledBanner}>
          <PrimaryText
            style={{
              ...fonts.regular24,
              color: colors.white,
            }}>
            {strings.btDisabled}
          </PrimaryText>
        </View>
      )}
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
        scrollEventThrottle={1000}
        onScroll={({nativeEvent}) => {
          if (
            isCloseToBottom(nativeEvent) &&
            allOrderData?.results?.length < allOrderData?.total &&
            !isLoadingMore
          ) {
            console.log('you can scroll more');
            handleLoadMore();
          }
        }}
        contentContainerStyle={styles.contentContainerStyle}>
        {/* Render Dashboard Banner */}
        <View style={styles.mainBannerStyles}>
          <View style={styles.bannerLeftSide}>
            <PrimaryText style={styles.orderText}>
              {strings.ctOrders}
            </PrimaryText>
            <PrimaryText style={styles.orderCount}>
              {orderStats?.totalOrders}
            </PrimaryText>
            <PrimaryText style={styles.orderText}>
              {strings.ctTodayTip}
            </PrimaryText>
            <PrimaryText style={styles.tipText}>
              {strings.currency} {orderStats?.totalTip?.toFixed(2)}
            </PrimaryText>
          </View>

          <View style={styles.bannerRightSide}>
            <View
              style={{
                ...commonStyles.horizontalCenterStyles,
                width: '100%',
                alignSelf: 'center',
                justifyContent: 'center',
              }}>
              <View style={styles.barLineStyles} />
              <PrimaryText style={styles.setReadyText}>
                {strings.ctSetReadyTime.toUpperCase()}
              </PrimaryText>
              <View style={styles.barLineStyles} />
            </View>

            <View
              style={{
                ...commonStyles.horizontalCenterStyles,
                marginTop: 15,
                alignSelf: 'center',
              }}>
              <View
                style={{
                  ...styles.statusButtonWrapper,
                  width: compareScreenWidth() ? 120 : 100,
                }}>
                <TouchableOpacity
                  onPress={() => setActivePrepTimeFor('pickup')}
                  style={{
                    ...styles.statusButton,
                    backgroundColor:
                      activePrepTimeFor == 'pickup'
                        ? colors.white
                        : colors.transparent,
                  }}>
                  <PrimaryText
                    style={{
                      ...fonts.medium36,
                      color:
                        activePrepTimeFor == 'pickup'
                          ? colors.blackText
                          : colors.white,
                    }}>
                    {strings.ctPickUp}
                  </PrimaryText>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setActivePrepTimeFor('delivery')}
                  disabled={!prepTime?.prepTime?.delivery}
                  style={{
                    ...styles.statusButton,
                    backgroundColor:
                      activePrepTimeFor == 'delivery'
                        ? colors.white
                        : colors.transparent,
                  }}>
                  <PrimaryText
                    style={{
                      ...fonts.medium36,
                      color:
                        activePrepTimeFor == 'delivery'
                          ? colors.blackText
                          : colors.white,
                    }}>
                    {strings.ctDelivery}
                  </PrimaryText>
                </TouchableOpacity>
              </View>

              <Image
                style={{
                  ...styles.dividerStyles,
                  marginHorizontal: compareScreenWidth() ? 18 : 10,
                }}
                source={images.icDivider}
              />

              <View
                style={{
                  ...styles.currentWrapper,
                  width: compareScreenWidth() ? 140 : 120,
                }}>
                <PrimaryText style={{...fonts.heading112, color: colors.white}}>
                  {activePrepTimeFor == 'delivery'
                    ? prepTime?.prepTime?.delivery
                    : prepTime?.prepTime?.pickup}
                </PrimaryText>
                <PrimaryText style={{...fonts.regular30, color: colors.white}}>
                  {strings.ctCurrent.toUpperCase()}
                </PrimaryText>
              </View>

              <View style={styles.timeWrapper}>
                {timeData.map((item, index) => (
                  <TouchableOpacity
                    onPress={() => {
                      if (
                        !(
                          activePrepTimeFor == 'pickup' ||
                          (activePrepTimeFor == 'delivery' &&
                            !prepTime?.prepTime?.hasMultipleZones)
                        )
                      ) {
                        showMessage({
                          message: strings.msgNoMultipleDeliverySonesEnabled,
                          // description:
                          // strings.msgNoMultipleDeliverySonesEnabled,
                          type: 'info',
                          position: 'bottom',
                          icon: 'auto',
                        });
                      } else {
                        setLocationPrepTimeApi({
                          method: activePrepTimeFor,
                          time: item,
                        });
                      }
                    }}
                    style={[
                      styles.timeItem,
                      !(
                        activePrepTimeFor == 'pickup' ||
                        (activePrepTimeFor == 'delivery' &&
                          !prepTime?.prepTime?.hasMultipleZones)
                      )
                        ? styles.disabled
                        : null,
                    ]}
                    key={`${index}_timeItemKey`}>
                    <PrimaryText
                      style={{
                        ...fonts.medium51,
                        color: colors.blackText,
                      }}>
                      {item}
                    </PrimaryText>
                    <PrimaryText
                      style={{
                        ...fonts.regular20,
                        color: colors.bannerHeadingText,
                      }}>
                      {strings.ctMinutes}
                    </PrimaryText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* Render Tabs */}
        <View
          style={{
            marginTop: 30,
          }}>
          <View style={styles.tabsWrapper}>
            {tabsData.map((item, index) => (
              <TouchableOpacity
                onPress={() =>
                  setScreenParamData({
                    ...screenParamData,
                    tab: item?.value,
                  })
                }
                style={{
                  ...styles.tabsItems,
                  backgroundColor:
                    screenParamData?.tab == item?.value
                      ? colors.secondary
                      : colors.transparent,
                }}
                key={`${index}TabsKey`}>
                <PrimaryText
                  style={{
                    ...fonts.medium36,
                    color:
                      screenParamData?.tab == item?.value
                        ? colors.white
                        : colors.blackText,
                  }}>
                  {item?.label}
                </PrimaryText>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.borderTopLine} />

          <View style={styles.tabBottomWrapper}>
            <View style={commonStyles.horizontalCenterStyles}>
              {statusData.map((item, index) => (
                <View
                  key={`${index}_checksKeys`}
                  style={{
                    ...commonStyles.horizontalCenterStyles,
                    marginRight: 20,
                  }}>
                  <TouchableOpacity
                    onPress={handleStatusSelect(item)}
                    style={styles.checkWrapper}>
                    {item?.value && (
                      <Image style={styles.checkIcon} source={images.icCheck} />
                    )}
                  </TouchableOpacity>

                  <PrimaryText
                    style={{
                      ...fonts.regular28,
                      color: colors.bannerHeadingText,
                    }}>
                    {item?.label}: {statusCountData?.[index]}
                  </PrimaryText>
                </View>
              ))}
            </View>

            <View style={{...commonStyles.horizontalCenterStyles}}>
              <View style={styles.lineStyle} />

              <TouchableOpacity
                onPress={handleStatusSelect(statusData?.[2])}
                style={{
                  ...styles.hideSwitchButton,
                  alignItems: !statusData?.[2]?.value
                    ? 'flex-end'
                    : 'flex-start',
                }}>
                <View
                  style={{
                    ...styles.hideSwitchBar,
                    backgroundColor: !statusData?.[2]?.value
                      ? colors.primary
                      : colors.white,
                  }}
                />
              </TouchableOpacity>

              <PrimaryText
                style={{
                  ...fonts.regular28,
                  color: colors.bannerHeadingText,
                }}>
                {strings.ctHideDelivered}
              </PrimaryText>
            </View>
          </View>
        </View>

        {/* Render Main Content */}
        {allOrderData?.results?.length > 0 && (
          <View
            style={{
              ...commonStyles.horizontalCenterStyles,
              width: '100%',
              marginTop: 30,
              paddingHorizontal: 20,
            }}>
            {['Order No.', 'Customer', 'Ready @', 'Payment', 'Status'].map(
              (item, index) => (
                <PrimaryText
                  key={`${index}_listHeadings`}
                  style={{
                    ...fonts.regular24,
                    color: colors.primaryText,
                    width:
                      index === 0
                        ? '13%'
                        : index === 1 || index === 2
                        ? '25%'
                        : '19%',
                  }}>
                  {item.toUpperCase()}
                </PrimaryText>
              ),
            )}
          </View>
        )}

        {allOrderData?.results?.length > 0 ? (
          allOrderData.results.map((item, index) => (
            <OrderItem
              animatedValue={flashAnim}
              showAnimation={screenParamData?.tab === 'prepare'}
              data={item}
              index={index}
              key={`${index}_order_item_key`}
              dashboardTab={screenParamData?.tab}
            />
          ))
        ) : (
          <NoDataFound />
        )}

        <View style={styles.bottomView}>
          {isLoadingMore && (
            <ActivityIndicator size={'large'} color={colors.secondary} />
          )}

          <View style={commonStyles.horizontalCenterStyles}>
            <View style={styles.bottomViewLine} />
            <PrimaryText
              style={{
                ...fonts.regular28,
                color: colors.bannerHeadingText,
                marginHorizontal: 10,
              }}>
              {strings.ctProvidedBy.toUpperCase()}
            </PrimaryText>
            <View style={styles.bottomViewLine} />
          </View>

          <View style={styles.cnWrapper}>
            <Image
              style={styles.cnImg}
              source={
                prepTime?.partnerLogo ? {uri: prepTime?.partnerLogo} : undefined
              }
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  disabledBanner: {
    width: '100%',
    paddingVertical: '2%',
    alignItems: 'center',
    backgroundColor: colors.statusRed,
  },
  contentContainerStyle: {
    paddingHorizontal: 30,
    paddingVertical: 40,
  },
  mainBannerStyles: {
    width: '100%',
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: 10,
    // overflow: 'hidden',
    backgroundColor: colors.white,
  },
  bannerLeftSide: {
    backgroundColor: colors.primary,
    width: '25%',
    paddingVertical: 30,
    alignItems: 'center',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  orderText: {
    ...fonts.regular36,
    color: colors.bannerHeadingText,
  },
  orderCount: {
    ...fonts.heading112,
    color: colors.white,
    marginTop: 5,
    marginBottom: 5,
  },
  tipText: {
    ...fonts.medium48,
    color: colors.white,
    marginTop: 5,
  },
  bannerRightSide: {
    paddingHorizontal: 20,
    width: '75%',
    paddingVertical: 20,
  },
  barLineStyles: {
    width: '30%',
    height: 1,
    backgroundColor: colors.placeholderText,
  },
  setReadyText: {
    ...fonts.regular36,
    color: colors.bannerHeadingText,
    paddingHorizontal: 10,
  },
  statusButtonWrapper: {
    paddingHorizontal: 5,
    paddingVertical: 5,
    borderRadius: 10,
    backgroundColor: colors.secondary,
  },
  statusButton: {
    width: '100%',
    borderRadius: 8,
    paddingVertical: 22,
    alignItems: 'center',
  },
  dividerStyles: {
    height: 140,
    width: 10,
    resizeMode: 'contain',
  },
  currentWrapper: {
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
  },
  timeWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 200,
    height: 140,
    justifyContent: 'space-between',
    marginLeft: 10,
    alignContent: 'space-between',
  },
  timeItem: {
    height: 65,
    width: 60,
    borderWidth: 1,
    borderColor: colors.placeholderText,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabled: {
    backgroundColor: '#DCDCDC',
  },
  tabsWrapper: {
    ...commonStyles.horizontalCenterStyles,
    alignSelf: 'center',
  },
  tabsItems: {
    paddingHorizontal: 25,
    paddingVertical: 13,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  borderTopLine: {
    height: 13,
    width: '100%',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: colors.secondary,
  },
  tabBottomWrapper: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    backgroundColor: colors.white,
    elevation: 5,
    width: '99.2%',
    height: 55,
    alignSelf: 'center',
    marginTop: -11,
    borderRadius: 8,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  checkWrapper: {
    height: 26,
    width: 26,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: colors.checkBorder,
    backgroundColor: colors.backgroundGrey,
    borderRadius: 4,
    marginRight: 10,
  },
  checkIcon: {
    height: 13,
    width: 13,
    resizeMode: 'contain',
  },
  lineStyle: {
    width: 1,
    height: 35,
    backgroundColor: colors.lineColor,
    marginRight: 25,
  },
  hideSwitchButton: {
    height: 26,
    width: 50,
    backgroundColor: colors.switchButtonBg,
    borderWidth: 1,
    borderColor: colors.switchButtonBorder,
    borderRadius: 3,
    paddingHorizontal: 5,
    marginRight: 15,
    justifyContent: 'center',
  },
  hideSwitchBar: {
    width: 22,
    height: 18,
    borderRadius: 3,
  },
  bottomView: {
    alignSelf: 'center',
    marginTop: 20,
    alignItems: 'center',
  },
  bottomViewLine: {
    width: 80,
    height: 1,
    backgroundColor: colors.bannerHeadingText,
  },
  cnWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  cnImg: {
    height: 70,
    width: 150,
    resizeMode: 'contain',
  },
});
