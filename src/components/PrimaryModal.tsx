import React, {FC, useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  Animated,
} from 'react-native';
import Modal from 'react-native-modal';
import {constants, images, screenName} from '../core';
import {strings} from '../i18n';
import {navigate} from '../navigation/RootNavigation';
import {dispatch, getStore} from '../redux';
import {
  setIsNotificationModal,
  setNotificationAttention,
} from '../redux/modules/genericSlice';
import {updateSettings} from '../redux/modules/settingsSlice';
import {
  notificationService,
  orderReadApi,
  setAsyncData,
  updateMenuItemStatusApi,
} from '../services';
import {colors, commonStyles, fonts} from '../styles';
import {PrimaryModalProps} from '../types/components';
import PrimaryButton from './PrimaryButton';
import PrimaryText from './PrimaryText';

const PrimaryModal: FC<PrimaryModalProps> = ({
  isVisible,
  onClosePress,
  type,
  data,
}) => {
  const snoozeListData = [
    {
      label: 'Disable until tomorrow morning (opening)',
      value: 'UNTIL_TOMORROW_OPENING',
    },
    {
      label: 'Disable until day after tomorrow (opening)',
      value: 'UNTIL_AFTER_TOMORROW_OPENING',
    },
    {
      label: 'Disable now and two full days following',
      value: 'UNTIL_3_DAYS',
    },
    {
      label: 'Disable indefinitely',
      value: 'UNTIL_ETERNITY',
    },
  ];
  /************ Hooks Functions *************/
  const flashAnim = useRef(new Animated.Value(0.4)).current;

  const [buttonDisabled, setButtonDisabled] = useState(false);

  useEffect(() => {
    if (isVisible && type === 'notification') {
      Animated.sequence([
        Animated.timing(flashAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: false,
        }),
        Animated.timing(flashAnim, {
          toValue: 0.4,
          duration: 250,
          useNativeDriver: false,
        }),
      ]).start();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible, data]);

  const colorInterpolation = flashAnim.interpolate({
    inputRange: [0.5, 1],
    outputRange: [colors.black, colors.white],
  });

  const animatedBgStyle = {
    backgroundColor: type == 'notification' ? colorInterpolation : colors.black,
  };

  /************ Main Functions *************/
  const handleItemSnoozeStatus = (item: any) => () => {
    const payload = {snoozeType: item?.value};
    console.log('on snooze press payload', payload);
    updateMenuItemStatusApi(data, payload, 'snooze');
    onClosePress();
  };

  const handleOnPrinterSelect = (item: any) => () => {
    const settings = getStore().settings.settings;
    dispatch(updateSettings({printerMacAddress: item}));
    setAsyncData(constants.asyncSettings, {
      ...settings,
      printerMacAddress: item,
    });
    onClosePress();
  };

  return (
    <Modal
      style={{margin: 0}}
      animationIn={'fadeIn'}
      animationOut={'fadeOut'}
      isVisible={isVisible}
      backdropOpacity={type == 'notification' ? 0 : 0.6}>
      {/* Render flash notification animation */}
      {isVisible && type == 'notification' ? (
        <Animated.View
          style={{
            ...styles.backgroundView,
            ...animatedBgStyle,
            opacity: flashAnim,
          }}
        />
      ) : null}
      <View
        style={{
          ...styles.mainView,
          width: type == 'snooze' ? 580 : 320,
        }}>
        {type != 'notification' && (
          <TouchableOpacity
            onPress={() => onClosePress()}
            hitSlop={commonStyles.hitSlop}
            style={styles.closeButton}>
            <Image style={commonStyles.verySmallIcon} source={images.icClose} />
          </TouchableOpacity>
        )}

        <PrimaryText
          style={{
            ...fonts.medium46,
            color: colors.blackText,
            alignSelf: 'center',
            marginTop: 10,
          }}>
          {type == 'snooze'
            ? 'Snooze till'
            : type == 'printerList'
            ? 'Select Printer'
            : ''}
        </PrimaryText>
        {type == 'primary' && (
          <>
            <PrimaryText
              style={{
                ...fonts.regular26,
                color: colors.bannerHeadingText,
                textAlign: 'center',
                marginTop: 10,
              }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Velit
              turpis mauris, in massa turpis. Duis quis egestas tincidunt
              ullamcorper. Sollicitudin sit aliquam non elit.
            </PrimaryText>

            <TouchableOpacity style={styles.dropdownWrapper}>
              <PrimaryText
                style={{...fonts.regular26, color: colors.bannerHeadingText}}>
                Dropdown option
              </PrimaryText>
              <Image
                style={commonStyles.verySmallIcon}
                source={images.icDropDown}
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.submitButton}>
              <PrimaryText
                style={{
                  ...fonts.medium32,
                  color: colors.white,
                }}>
                Submit
              </PrimaryText>
            </TouchableOpacity>
          </>
        )}
        {type == 'snooze' && (
          <ScrollView
            contentContainerStyle={{
              paddingHorizontal: 10,
              paddingTop: 10,
              paddingBottom: 20,
            }}>
            {snoozeListData.map((item, index) => (
              <TouchableOpacity
                key={`${index}_snooze_item_key`}
                style={styles.snoozeItemWrapper}
                onPress={handleItemSnoozeStatus(item)}>
                <PrimaryText
                  style={{...fonts.medium36, color: colors.primaryText}}>
                  {item.label}
                </PrimaryText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
        {type == 'printerList' && (
          <ScrollView
            contentContainerStyle={{
              paddingHorizontal: 10,
              paddingTop: 10,
              paddingBottom: 20,
            }}>
            {data.map((item: any, index: number) => (
              <TouchableOpacity
                key={`${index}_printer_mac_item_key`}
                style={styles.snoozeItemWrapper}
                onPress={handleOnPrinterSelect(item)}>
                <PrimaryText
                  style={{...fonts.medium36, color: colors.primaryText}}>
                  {item}
                </PrimaryText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {type == 'notification' && (
          <>
            <PrimaryText style={fonts.heading37}>
              {strings.ctNotification}
            </PrimaryText>
            <PrimaryText
              style={{
                ...fonts.regular32,
                paddingTop: 10,
                paddingBottom: 20,
              }}>
              {data?.message}
            </PrimaryText>
            <View style={commonStyles.horizontalBetweenStyles}>
              <PrimaryButton
                disabled={buttonDisabled}
                onPressIn={() => setButtonDisabled(true)}
                onPressOut={() => setButtonDisabled(false)}
                style={{
                  ...styles.notificationButton,
                  backgroundColor: colors.statusRed,
                }}
                onPress={() => {
                  if (data?.notificationId) {
                    dispatch(setIsNotificationModal(false));
                    dispatch(setNotificationAttention(null));
                    notificationService.removeDeliveredNotifications(
                      data?.notificationId,
                    );
                  }
                }}
                title={strings.btDismiss}
              />
              <PrimaryButton
                disabled={buttonDisabled}
                style={{...styles.notificationButton}}
                onPressIn={() => setButtonDisabled(true)}
                onPressOut={() => setButtonDisabled(false)}
                onPress={() => {
                  if (data?.notificationId) {
                    dispatch(setIsNotificationModal(false));
                    dispatch(setNotificationAttention(null));
                    notificationService.removeDeliveredNotifications(
                      data?.notificationId,
                    );
                    navigate(screenName.orderDetails, {orderId: data?.orderId});
                    orderReadApi(data?.orderId);
                  }
                }}
                title={strings.btShowDetail}
              />
            </View>
          </>
        )}
      </View>
    </Modal>
  );
};

export default PrimaryModal;

const styles = StyleSheet.create({
  backgroundView: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    zIndex: -5,
  },
  mainView: {
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    alignSelf: 'center',
    borderRadius: 5,
    paddingVertical: 20,
  },
  closeButton: {
    alignSelf: 'flex-end',
  },
  dropdownWrapper: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: colors.dropdownBorder,
    marginTop: 15,
    paddingVertical: 3,
    justifyContent: 'space-between',
    paddingRight: 5,
  },
  submitButton: {
    alignSelf: 'center',
    paddingHorizontal: 40,
    paddingVertical: 13,
    backgroundColor: colors.secondary,
    borderRadius: 8,
    marginTop: 25,
  },
  snoozeItemWrapper: {
    width: '100%',
    height: 40,
    justifyContent: 'center',
    paddingHorizontal: '5%',
    backgroundColor: colors.white,
    marginTop: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.borderColor,
  },
  notificationButton: {
    width: '45%',
  },
});
