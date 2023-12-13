/* eslint-disable react-native/no-inline-styles */
import moment from 'moment';
import React, {FC, Fragment, useEffect, useState} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSelector} from 'react-redux';
import {NoDataFound, PrimaryHeader, PrimaryText} from '../../components';
import {
  compareScreenWidth,
  convertToBluetoothPrintData,
  errorToast,
  images,
} from '../../core';
import {capitalize} from '../../core/genericUtils';
import {strings} from '../../i18n';
import {dispatch, RootState} from '../../redux';
import {setSingleOrderData} from '../../redux/modules/orderSlice';
import {findSingleOrdersApi, updateOrderStatusApi} from '../../services';
import {printOrderApi, sendSmsApi} from '../../services/orderServices';
import {printerServices} from '../../services/printerServices';
import {colors, commonStyles, fonts} from '../../styles';
import {CommonNavigationProps} from '../../types/navigationTypes';
import GroupedPizzaToppings from './GroupedPizzaToppings';

const OrderDetails: FC<CommonNavigationProps> = ({navigation, route}) => {
  /************ Props and Data Destructuring ************/
  const {
    params: {orderId, dashboardTab},
  } = route;
  /************ Hooks Functions ************/
  const {
    singleOrderData,
    noInternet,
    isLoadingSingleOrder,
    settings,
    orderingItems,
  } = useSelector((state: RootState) => ({
    singleOrderData: state.order.singleOrderData,
    isLoadingSingleOrder: state.order.isLoadingSingleOrder,
    noInternet: state.generic.noInternet,
    settings: state.settings.settings,
    orderingItems: state.order.orderingItems,
  }));
  const {printingType, enablePrinting} = settings;
  const [showMoreOrderNotes, setShowMoreOrderNotes] = useState(false);
  const [showMoreTaxFee, setShowMoreTaxFee] = useState(false);
  useEffect(() => {
    dispatch(setSingleOrderData(null));
    !noInternet ? findSingleOrdersApi(orderId) : null;
    return () => {};
  }, [noInternet, orderId]);

  const totalData = [
    {
      label: 'Sub Total',
      value: singleOrderData?.payment?.subTotal,
      moreInfo: [],
    },
    {
      label: 'Coupon',
      value: singleOrderData?.payment?.discount,
      moreInfo: [],
    },
    {
      label: 'Tip',
      value: singleOrderData?.payment?.tip,
      moreInfo: [],
    },
    {
      label: 'Tax & fees',
      value: singleOrderData?.payment?.tax,
      moreInfo: [
        singleOrderData?.method !== 'pickup'
          ? {
              name: 'Delivery Fee',
              amount: singleOrderData?.payment?.deliveryFee,
            }
          : null,
        singleOrderData?.payment?.orderFee
          ? {
              name: 'Order Fees',
              amount: singleOrderData?.payment?.orderFee,
            }
          : null,
        ...(singleOrderData?.payment?.taxDetails ?? []),
      ],
    },
    {
      label: 'Total',
      value: singleOrderData?.payment?.total,
      moreInfo: [],
    },
  ];

  const statusData = [
    {
      label: 'Pending',
      value: singleOrderData?.status === 'pending',
      event: 'updateStatus',
    },
    {
      label: 'Prepared',
      value: singleOrderData?.status === 'prepared',
      event: 'updateStatus',
    },
    {
      label: 'Delivered',
      value: singleOrderData?.status === 'delivered',
      event: 'updateStatus',
    },
    {
      label: 'Send SMS',
      value: true,
      event: 'sendSMS',
    },
    {
      label: 'Print Order',
      value: true,
      event: 'print',
    },
  ];

  /************ Main Functions ************/
  const handleChangeStatus = (item: any) => () => {
    if (item?.event === 'updateStatus') {
      updateOrderStatusApi(
        orderId,
        {
          status: item?.label.toLowerCase(),
        },
        dashboardTab,
      );
    } else if (item?.event === 'sendSMS') {
      sendSmsApi(orderId);
    } else if (item?.event === 'print') {
      if (enablePrinting) {
        if (printingType === 'Cloud Print') {
          printOrderApi(orderId);
        } else if (printingType === 'Bluetooth') {
          printerServices.handleBluetoothPrint(singleOrderData);
        }
      } else {
        errorToast(strings.msgPrintingDisabled, strings.msgFailure);
      }
    }
  };

  return (
    <View style={commonStyles.mainView}>
      <PrimaryHeader
        title={`Order ${
          singleOrderData?.orderNum && !singleOrderData?.provider?.id
            ? `#${singleOrderData?.orderNum}`
            : ''
        }`}
        left="back"
      />
      {isLoadingSingleOrder ? null : singleOrderData ? (
        <ScrollView contentContainerStyle={styles.contentContainerStyle}>
          <View style={styles.contentWrapper}>
            {/* Render Receipt View */}
            <View style={styles.billViewStyles}>
              <View style={styles.billTopView}>
                <View>
                  <PrimaryText
                    style={{
                      ...fonts.medium36,
                      color: colors.secondary,
                    }}>
                    {singleOrderData?.method === 'pickup'
                      ? strings.ctPickUp
                      : singleOrderData?.method === 'walkup'
                      ? strings.ctWalkUp
                      : strings.ctDelivery}
                    <PrimaryText
                      style={{
                        ...fonts.regular36,
                        color: colors.blackText,
                      }}>
                      {' for '}
                    </PrimaryText>
                    {singleOrderData?.customer?.name}
                  </PrimaryText>

                  <View
                    style={{
                      ...commonStyles.horizontalCenterStyles,
                      marginTop: 10,
                    }}>
                    <Image
                      style={commonStyles.extraSmallIcon}
                      source={images.icClock}
                    />
                    <PrimaryText
                      style={{
                        ...fonts.regular40,
                        marginLeft: 10,
                        color: colors.bannerHeadingText,
                      }}>
                      {`${strings.ctPromised} ... `}
                      {singleOrderData?.orderTiming === 'later'
                        ? moment(singleOrderData?.scheduledOn).format(
                            'MM/DD/YYYY [...] hh:mm A',
                          )
                        : singleOrderData?.orderTiming === 'now'
                        ? `${strings.ctNow} ... ${moment(
                            singleOrderData?.orderNowPickupDate,
                          ).format('hh:mm A')}`
                        : null}
                    </PrimaryText>
                  </View>

                  <View
                    style={{
                      ...commonStyles.horizontalCenterStyles,
                      marginTop: 10,
                    }}>
                    <Image
                      style={commonStyles.extraSmallIcon}
                      source={images.icClock}
                    />
                    <PrimaryText
                      style={{
                        ...fonts.regular40,
                        marginLeft: 10,
                        color: colors.bannerHeadingText,
                      }}>
                      Placed:{' '}
                      {moment(singleOrderData?.createdAt).format('hh:mm A')}
                    </PrimaryText>
                  </View>

                  <View
                    style={{
                      ...commonStyles.horizontalCenterStyles,
                      marginTop: 10,
                    }}>
                    <Image
                      style={commonStyles.extraSmallIcon}
                      source={images.icClock}
                    />
                    <PrimaryText
                      style={{
                        ...fonts.regular40,
                        marginLeft: 10,
                        color: colors.bannerHeadingText,
                      }}>
                      {strings.ctPaymentStatus}
                      {': '}
                      {capitalize(
                        singleOrderData?.paymentStatus === 'paid'
                          ? strings.ctPaid
                          : strings.ctNotPaid,
                      )}
                    </PrimaryText>
                  </View>
                  <View
                    style={{
                      ...commonStyles.horizontalCenterStyles,
                      marginTop: 10,
                    }}>
                    <Image
                      style={commonStyles.extraSmallIcon}
                      source={images.icCall}
                    />
                    <PrimaryText
                      style={{
                        ...fonts.regular40,
                        marginLeft: 10,
                        color: colors.bannerHeadingText,
                      }}>
                      {singleOrderData?.customer?.phone}
                    </PrimaryText>
                  </View>

                  {singleOrderData?.method === 'delivery' &&
                    singleOrderData?.deliveryAddress?.formatted_address && (
                      <View
                        style={{
                          ...commonStyles.horizontalCenterStyles,
                          marginTop: 10,
                        }}>
                        <Image
                          style={{
                            ...commonStyles.extraSmallIcon,
                            tintColor: colors.orderIcon,
                          }}
                          source={images.icLocation}
                        />
                        <PrimaryText
                          style={{
                            ...fonts.regular40,
                            marginLeft: 10,
                            color: colors.bannerHeadingText,
                          }}>
                          {singleOrderData?.deliveryAddress?.formatted_address}
                        </PrimaryText>
                      </View>
                    )}
                </View>
                {singleOrderData?.provider?.id ? (
                  <Image
                    style={styles.providerLogo}
                    source={images[singleOrderData?.provider?.id]}
                    resizeMode="contain"
                  />
                ) : null}
              </View>
              <View style={styles.separateBarTop} />

              {singleOrderData?.note && singleOrderData?.note !== '' && (
                <View style={styles.orderNotesWrapper}>
                  <View style={commonStyles.horizontalBetweenStyles}>
                    <PrimaryText
                      style={{
                        ...fonts.regular36,
                        color: colors.blackText,
                      }}>
                      {strings.ctOrderNotes}
                    </PrimaryText>
                    <TouchableOpacity
                      style={{marginRight: 10}}
                      onPress={() =>
                        setShowMoreOrderNotes(!showMoreOrderNotes)
                      }>
                      <Image
                        style={{
                          ...commonStyles.smallIcon,
                          transform: [
                            {rotate: showMoreOrderNotes ? '0deg' : '180deg'},
                          ],
                        }}
                        source={images.icUpArrow}
                      />
                    </TouchableOpacity>
                  </View>

                  <PrimaryText
                    props={{numberOfLines: showMoreOrderNotes ? undefined : 2}}
                    style={{
                      ...fonts.regular32,
                      color: colors.bannerHeadingText,
                      marginTop: 10,
                      textAlign: 'justify',
                      width: '98%',
                    }}>
                    {singleOrderData?.note}
                  </PrimaryText>
                  <View style={styles.orderNotesSeparator} />
                </View>
              )}

              <View style={styles.listView}>
                {singleOrderData?.items?.map((item: any, index: number) => {
                  let o = orderingItems.find(itm => itm._id === item.itemId);
                  const allSubprods = Object.values(o?.modifiers || {}).flatMap(
                    (modif: any) => modif?.subProducts,
                  );

                  const allSelectedModifiers = allSubprods.filter(
                    subProd => subProd?.defaultSelected,
                  );

                  console.log(allSelectedModifiers, item?.modifiers);

                  const missingSelected = allSelectedModifiers.filter(
                    a =>
                      !item?.modifiers.some(
                        (m: any) => a.product_id === m.product_id,
                      ),
                  );

                  return (
                    <View
                      key={`${index}_item_keys`}
                      style={styles.mainItemWrapper}>
                      <View style={commonStyles.horizontalBetweenStyles}>
                        <PrimaryText
                          style={{
                            ...fonts.regular36,
                            color: colors.primaryText,
                            width: '75%',
                          }}>
                          {`${item?.qty} `}
                          {item?.name}
                        </PrimaryText>
                        <PrimaryText
                          style={{
                            ...fonts.regular36,
                            color: colors.blackText,
                          }}>
                          {Number(item?.price) > 0
                            ? `${strings.currency}${Number(
                                item?.price * item?.qty,
                              ).toFixed(2)}`
                            : ''}
                        </PrimaryText>
                      </View>

                      <View style={styles.otherItemsView}>
                        <GroupedPizzaToppings
                          it={item}
                          data={item?.modifiers}
                        />
                        {missingSelected?.map((selected, inx) => (
                          <View
                            style={styles.otherItemsWrapper}
                            key={`${inx}_missing_item_keys`}>
                            <View style={commonStyles.horizontalBetweenStyles}>
                              <PrimaryText
                                style={{
                                  ...fonts.medium36,
                                  color: colors.bannerHeadingText,
                                }}>
                                No {selected?.product_name}
                              </PrimaryText>
                            </View>
                          </View>
                        ))}
                        {item?.modifiers
                          ?.filter((item: any) => !item?.defaultSelected)
                          ?.map((it: any, ind: number) => {
                            let newPrice;
                            if (it?.qty && it?.qty > 1) {
                              newPrice = it?.price * it?.qty;
                            } else {
                              newPrice = it?.price * 1;
                            }

                            const modifierSelectdPrice =
                              it?.selectedModifier?.label?.split('$')[1] ===
                              undefined
                                ? 0
                                : it?.selectedModifier?.label?.split('$')[1];
                            return (
                              !it?.advancedPizzaOptions && (
                                <View
                                  style={styles.otherItemsWrapper}
                                  key={`${ind}_mod_item_keys`}>
                                  <View
                                    style={
                                      commonStyles.horizontalBetweenStyles
                                    }>
                                    <PrimaryText
                                      style={{
                                        ...fonts.medium36,
                                        color: colors.bannerHeadingText,
                                      }}>
                                      {it?.qty ? `${it?.qty} x ` : ''}
                                      {it?.product_name}
                                    </PrimaryText>
                                    {newPrice > 0 && (
                                      <PrimaryText
                                        style={{
                                          ...fonts.medium36,
                                          color: colors.blackText,
                                        }}>
                                        {`${strings.currency}${Number(
                                          Number(
                                            Number(newPrice) -
                                              Number(
                                                it?.selectedModifier?.label.split(
                                                  '$',
                                                )[1] || 0,
                                              ),
                                          ) * (item?.qty || 1),
                                        ).toFixed(2)}`}
                                      </PrimaryText>
                                    )}
                                  </View>
                                  {it?.selectedModifier?.label && (
                                    <View
                                      style={
                                        commonStyles.horizontalBetweenStyles
                                      }>
                                      <PrimaryText
                                        style={{
                                          ...fonts.medium28,
                                          color: colors.bannerHeadingText,
                                        }}>
                                        {
                                          it?.selectedModifier?.label
                                            .split('$')[0]
                                            .split(' -')[0]
                                        }
                                      </PrimaryText>
                                      <PrimaryText
                                        style={{
                                          ...fonts.medium28,
                                          color: colors.bannerHeadingText,
                                        }}>
                                        {modifierSelectdPrice > 0 &&
                                          `${strings.currency}${Number(
                                            modifierSelectdPrice *
                                              (item?.qty || 1),
                                          ).toFixed(2)}`}
                                      </PrimaryText>
                                    </View>
                                  )}
                                </View>
                              )
                            );
                          })}
                      </View>

                      {item?.instruction != '' && (
                        <PrimaryText
                          style={{
                            ...fonts.medium32,
                            color: colors.primaryText,
                            paddingLeft: 10,
                            marginTop: 10,
                            textAlign: 'justify',
                          }}>
                          Instructions: {item?.instruction}
                        </PrimaryText>
                      )}
                    </View>
                  );
                })}
              </View>

              {/* Render Total view */}
              <View style={styles.totalViewWrapper}>
                {totalData.map(
                  (item, index) =>
                    item?.value > 0 && (
                      <Fragment key={`${index}_total_keys`}>
                        <View
                          style={{
                            ...commonStyles.horizontalBetweenStyles,
                            marginBottom: 16,
                          }}>
                          <TouchableOpacity
                            onPress={() => setShowMoreTaxFee(!showMoreTaxFee)}
                            disabled={item?.label != 'Tax & fees'}
                            style={commonStyles.horizontalCenterStyles}>
                            <PrimaryText
                              style={{
                                ...(index == 3
                                  ? fonts.medium43
                                  : fonts.regular36),
                                color: colors.blackText,
                                marginRight: 5,
                              }}>
                              {item?.label}
                            </PrimaryText>
                            {item?.label == 'Tax & fees' &&
                              item?.moreInfo.filter(m => m).length > 0 && (
                                <Image
                                  style={{
                                    ...commonStyles.verySmallIcon,
                                    transform: [
                                      {
                                        rotateX: showMoreTaxFee
                                          ? '180deg'
                                          : '0deg',
                                      },
                                    ],
                                  }}
                                  source={images.icDropDown}
                                />
                              )}
                          </TouchableOpacity>
                          <PrimaryText
                            style={{
                              ...(index == 3
                                ? fonts.medium43
                                : fonts.regular36),
                              color: colors.blackText,
                            }}>
                            {strings.currency}
                            {item?.value?.toFixed(2)}
                          </PrimaryText>
                        </View>

                        {showMoreTaxFee &&
                          item?.moreInfo.map(
                            (moreItem: any, moreIndex: number) =>
                              moreItem && (
                                <View
                                  key={`${moreIndex}_more_fee_keys`}
                                  style={{
                                    ...commonStyles.horizontalBetweenStyles,
                                    marginBottom: 12,
                                    paddingLeft: 20,
                                  }}>
                                  <PrimaryText
                                    style={{
                                      ...fonts.regular30,
                                      color: colors.bannerHeadingText,
                                    }}>
                                    {moreItem?.name}
                                  </PrimaryText>
                                  <PrimaryText
                                    style={{
                                      ...fonts.regular30,
                                      color: colors.bannerHeadingText,
                                    }}>
                                    {strings.currency}
                                    {moreItem?.amount?.toFixed(2)}
                                  </PrimaryText>
                                </View>
                              ),
                          )}
                      </Fragment>
                    ),
                )}
              </View>
            </View>
            {/* Render Status View */}
            <View>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{
                  ...commonStyles.horizontalCenterStyles,
                  marginVertical: 30,
                  marginLeft: 27,
                }}>
                <Image
                  style={{
                    ...commonStyles.extraSmallIcon,
                    tintColor: colors.secondary,
                  }}
                  source={images.icBack}
                />
                <PrimaryText
                  style={{
                    ...fonts.heading36,
                    color: colors.secondary,
                    paddingLeft: 10,
                  }}>
                  Back
                </PrimaryText>
              </TouchableOpacity>

              <View style={styles.statusOuterWrapper}>
                <View style={styles.statusInnerWrapper}>
                  <PrimaryText
                    style={{
                      ...fonts.heading36,
                      color: colors.blackText,
                      marginVertical: 15,
                      alignSelf: 'center',
                    }}>
                    Change Status
                  </PrimaryText>
                  {statusData.map((item: any, index: number) => (
                    <TouchableOpacity
                      onPress={handleChangeStatus(item)}
                      key={`${index}_status_keys`}
                      style={{
                        ...styles.statusButtonWrapper,
                        width: compareScreenWidth() ? 130 : 120,
                        backgroundColor: item.value
                          ? colors.secondary
                          : colors.transparent,
                      }}>
                      <PrimaryText
                        style={{
                          ...fonts.medium32,
                          color: item.value ? colors.white : colors.blackText,
                        }}>
                        {item.label}
                      </PrimaryText>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      ) : (
        <NoDataFound />
      )}
    </View>
  );
};

export default OrderDetails;

const styles = StyleSheet.create({
  contentContainerStyle: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  contentWrapper: {
    flexDirection: 'row',
  },
  billViewStyles: {
    width: '75%',
    borderRadius: 20,
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    paddingTop: 35,
    minHeight: 520,
    overflow: 'hidden',
  },
  billTopView: {
    flexDirection: 'row',
    paddingHorizontal: '3%',
    justifyContent: 'space-between',
  },
  separateBarTop: {
    width: '94%',
    height: 1,
    backgroundColor: colors.placeholderText,
    marginTop: 25,
  },
  orderNotesWrapper: {
    paddingHorizontal: '5%',
    marginTop: 20,
  },
  orderNotesSeparator: {
    width: '90%',
    height: 1,
    backgroundColor: colors.placeholderText,
    marginTop: 10,
  },
  listView: {
    paddingHorizontal: 30,
  },
  mainItemWrapper: {
    width: '90%',
    paddingVertical: 25,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderColor: colors.placeholderText,
  },
  otherItemsView: {
    paddingLeft: 10,
  },
  otherItemsWrapper: {
    marginTop: 18,
  },
  totalViewWrapper: {
    width: '100%',
    backgroundColor: colors.billBG,
    paddingLeft: 30,
    paddingRight: 90,
    marginTop: 30,
    paddingVertical: 20,
    minHeight: 235,
  },

  statusOuterWrapper: {
    width: '100%',
    backgroundColor: colors.white,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    padding: 5,
  },
  statusInnerWrapper: {
    width: '100%',
    backgroundColor: colors.billBG,
    borderTopRightRadius: 7,
    borderBottomRightRadius: 7,
    paddingHorizontal: 25,
    paddingVertical: 15,
  },
  statusButtonWrapper: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 15,
  },
  providerLogo: {
    height: 54,
  },
});
