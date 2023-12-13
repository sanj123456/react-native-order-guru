/* eslint-disable react-native/no-inline-styles */
import {useNavigation} from '@react-navigation/native';
import React, {FC} from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Text,
} from 'react-native';
import {constants, images, screenName} from '../core';
import {strings} from '../i18n';
import {fcmRemoveApi, getAsyncData, removeAsyncData} from '../services';
import {colors, fonts} from '../styles';
import PrimaryText from './PrimaryText';
import moment from 'moment';
import DeviceInfo from 'react-native-device-info';
import {RootState, dispatch} from '../redux';
import {setProfileData} from '../redux/modules/profileSlice';
import {useSelector} from 'react-redux';

const AppDrawer: FC = () => {
  const navigation = useNavigation();
  const {profileData} = useSelector((state: RootState) => ({
    profileData: state.profile.profileData,
  }));

  const drawerData: {label: string; screen: string; icon: any}[] = [
    {
      label: strings.ctDashboard,
      screen: screenName.dashboard,
      icon: images.menuDashboard,
    },
    {
      label: strings.ctOrderHistory,
      screen: screenName.orderHistoryStack,
      icon: images.menuOrder,
    },
    {
      label: strings.ctMenu,
      screen: screenName.menuStack,
      icon: images.menu,
    },
    {
      label: strings.ctPrinterSettings,
      screen: screenName.settingsStack,
      icon: images.menuPrinter,
    },
    {
      label: strings.ctSignOut,
      screen: screenName.auth,
      icon: images.menuSignOut,
    },
  ];

  /********* Hooks Functions **********/
  // const {profileData} = useSelector((state: RootState) => ({
  //   profileData: state.profile.profileData,
  // }));

  /********* Main Functions **********/
  const handleSignOut = async () => {
    // dispatch(setIsLoading(true));
    // messaging()
    //   .unsubscribeFromTopic(
    //     `${constants.notifyOrderTopic}${profileData?.user?.ipadDevice?.location}`,
    //   )
    //   .then(() => {
    //     console.log(
    //       'Unsubscribed from the topic!',
    //       `${constants.notifyOrderTopic}${profileData?.user?.ipadDevice?.location}`,
    //     );
    //     dispatch(setIsLoading(false));
    //   })
    //   .catch(e => {
    //     console.log('Error unsubscribeFromTopic', e);
    //     dispatch(setIsLoading(false));
    //   });
    let fcmToken = await getAsyncData(constants.asyncFcmToken);
    if (fcmToken) {
      fcmRemoveApi({fcmToken});
    } else {
      removeAsyncData(constants.asyncUserData);
      dispatch(setProfileData(null));
    }
  };

  const handleOptionPress =
    (item: {label: string; screen: string; icon: any}) => () => {
      if (item.label === strings.ctSignOut) {
        handleSignOut();
      } else {
        // @ts-ignore
        navigation.navigate(item.screen);
      }
    };

  const RenderDrawerItem = (
    item: {label: string; screen: string; icon: any},
    index: number,
  ) => {
    return (
      <TouchableOpacity
        // @ts-ignore
        onPress={handleOptionPress(item)}
        style={styles.itemWrapper}
        key={`${index}_drawerListItem`}>
        <Image
          style={
            index === 0 || index === 4
              ? styles.iconLargeImage
              : styles.iconImage
          }
          source={item.icon}
        />
        <PrimaryText style={styles.itemText}>{item.label}</PrimaryText>
        <Image style={styles.optionIcon} source={images.icRightArrow} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.mainView}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{zIndex: 5}}
        contentContainerStyle={{
          paddingBottom: 50,
          backgroundColor: colors.primary,
          flex: 1,
          justifyContent: 'center',
        }}>
        <Image style={styles.appLogoImage} source={images.dummyLogo} />
        <View style={styles.contentContainerStyle}>
          {drawerData.map((item, index) => RenderDrawerItem(item, index))}
        </View>
        <View style={styles.footer}>
          <Text style={styles.userNameText}>
            {strings.ctUsername}: {profileData.user.username}
          </Text>
        </View>
      </ScrollView>
      <View style={styles.bottomViewStyle}>
        <Image style={styles.bottomImage} source={images.icCopyright} />
        <PrimaryText style={styles.copyRightText}>
          {strings.ctCopyright(
            moment(new Date()).format('YYYY'),
            DeviceInfo.getVersion(),
          )}
        </PrimaryText>
      </View>
    </View>
  );
};

export default AppDrawer;

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingHorizontal: 25,
  },
  appLogoImage: {
    height: 120,
    width: '80%',
    resizeMode: 'contain',
    alignSelf: 'center',
    // marginTop: '45%',
  },
  contentContainerStyle: {
    marginTop: '12%',
  },
  itemWrapper: {
    width: '100%',
    paddingVertical: 15,
    backgroundColor: colors.secondary,
    marginTop: 30,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  iconImage: {
    height: 25,
    width: 25,
    resizeMode: 'contain',
    marginRight: 15,
  },
  iconLargeImage: {
    height: 28,
    width: 28,
    resizeMode: 'contain',
    marginRight: 12,
  },
  itemText: {
    ...fonts.regular48,
    color: colors.white,
    width: '83%',
  },
  optionIcon: {
    height: 18,
    width: 18,
    resizeMode: 'contain',
  },
  bottomViewStyle: {
    position: 'absolute',
    bottom: '2%',
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    zIndex: 0,
  },
  bottomImage: {
    height: 25,
    width: 25,
    resizeMode: 'contain',
    marginRight: 10,
  },
  copyRightText: {
    ...fonts.regular30,
    color: colors.white,
  },
  footer: {
    position: 'absolute',
    bottom: '2%',
    alignSelf: 'center',
    alignItems: 'center',
  },
  userNameText: {
    ...fonts.medium46,
    color: colors.white,
    paddingVertical: 20,
  },
});
