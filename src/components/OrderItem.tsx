/* eslint-disable react-native/no-inline-styles */
import {useNavigation} from '@react-navigation/native';
import moment from 'moment';
import React, {FC} from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Image,
} from 'react-native';
import {images, screenName} from '../core';
import {strings} from '../i18n';
import {colors, fonts} from '../styles';
import {OrderItemProps} from '../types/components';
import PrimaryText from './PrimaryText';
import {orderReadApi} from '../services';

const OrderItem: FC<OrderItemProps> = ({
  data,
  index,
  dashboardTab,
  animatedValue,
  showAnimation,
}) => {
  const navigation = useNavigation();

  const color = animatedValue?.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.transparentRed, colors.white],
  });

  return (
    <TouchableOpacity
      onPress={() => {
        // @ts-ignore
        navigation.navigate(screenName.orderDetails, {
          orderId: data?._id,
          dashboardTab,
        });
        data?.readByTablet ? null : orderReadApi(data?._id);
      }}
      style={styles.itemWrapper}>
      <Animated.View
        style={{
          ...styles.animatedView,
          backgroundColor: data?.readByTablet
            ? colors.white
            : showAnimation
            ? color
            : colors.white,
        }}>
        <View style={{width: '13%'}}>
          {data?.provider?.id !== undefined ? (
            ['doordash', 'grubhub', 'postmates', 'uber'].indexOf(
              data?.provider?.id,
            ) === -1 ? (
              <>
                <PrimaryText
                  style={{
                    ...fonts.medium36,
                    color: colors.bannerHeadingText,
                  }}>
                  {data?.orderNum}
                </PrimaryText>
                <PrimaryText
                  props={{numberOfLines: 1}}
                  style={{
                    ...fonts.regular28,
                    color: colors.bannerHeadingText,
                    marginTop: 8,
                  }}>
                  {data?.provider?.name}
                </PrimaryText>
              </>
            ) : (
              <View style={styles.providerLogoView}>
                <Image
                  style={styles.providerLogo}
                  source={images[data?.provider?.id]}
                  resizeMode="contain"
                />
              </View>
            )
          ) : (
            <>
              <PrimaryText
                style={{
                  ...fonts.medium36,
                  color: colors.bannerHeadingText,
                }}>
                {data?.orderNum}
              </PrimaryText>
              <PrimaryText
                style={{
                  ...fonts.regular28,
                  color: colors.bannerHeadingText,
                  marginTop: 8,
                }}>
                {data?.method === 'pickup'
                  ? strings.ctPick_Up.toUpperCase()
                  : data?.method === 'walkup'
                  ? strings.ctWalkUp.toUpperCase()
                  : strings.ctDelivery.toUpperCase()}
              </PrimaryText>
            </>
          )}
        </View>

        <View style={{width: '25%'}}>
          <PrimaryText
            style={{
              ...fonts.medium36,
              color: colors.blackText,
            }}>
            {data?.customer?.name}
          </PrimaryText>
          <PrimaryText
            style={{
              ...fonts.regular28,
              color: colors.bannerHeadingText,
              marginTop: 8,
            }}>
            {data?.ihdDeliveryId && data?.partner?.partner?.name
              ? data?.partner?.partner?.name
              : data?.orderNum?.toString()?.indexOf('kh') != -1
              ? strings.ctMarketplace
              : data?.customer?.phone}
          </PrimaryText>
        </View>

        <PrimaryText
          style={{
            ...fonts.regular36,
            color: colors.bannerHeadingText,
            width: '25%',
          }}>
          {data?.orderTiming === 'later'
            ? moment(data?.scheduledOn).format('MM/DD/YYYY[\n]hh:mm A')
            : `${strings.ctNow}\n${moment(data?.orderNowPickupDate).format(
                'hh:mm A',
              )}`}
        </PrimaryText>

        <View style={{width: '19%'}}>
          <PrimaryText style={{...fonts.medium36, color: colors.blackText}}>
            {strings.currency}
            {data?.payment?.total?.toFixed(2)}
          </PrimaryText>
          <View
            style={{
              ...styles.statusWrapper,
              backgroundColor:
                data?.paymentStatus === 'paid'
                  ? colors.statusGreen
                  : colors.statusRed,
            }}>
            <PrimaryText style={{...fonts.regular22, color: colors.white}}>
              {data?.paymentStatus === 'paid'
                ? strings.ctPaid.toUpperCase()
                : strings.ctNeedPayments.toUpperCase()}
            </PrimaryText>
          </View>
        </View>

        <PrimaryText
          style={{
            ...fonts.medium36,
            color: colors.statusPending,
            width: '19%',
          }}>
          {data?.status === 'pending'
            ? strings.ctPending
            : data?.status === 'prepared'
            ? strings.ctPrepared
            : data?.status === 'delivered'
            ? strings.ctDelivered
            : ''}
        </PrimaryText>
      </Animated.View>
    </TouchableOpacity>
  );
};

export default OrderItem;

const styles = StyleSheet.create({
  itemWrapper: {
    width: '100%',
    borderRadius: 10,
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginTop: 12,
  },
  animatedView: {
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: 'row',
  },
  statusWrapper: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  providerLogoView: {
    paddingRight: 30,
  },
  providerLogo: {
    width: '100%',
    height: 54,
  },
});
