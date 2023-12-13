import {DrawerActions, useNavigation} from '@react-navigation/native';
import React, {FC} from 'react';
import {View, TouchableOpacity, Image, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import {images, screenName} from '../core';
import {strings} from '../i18n';
import {RootState} from '../redux';
import {setLocationStatusApi} from '../services';
import {colors, commonStyles, fonts} from '../styles';
import {PrimaryHeaderProps} from '../types/components';
import PrimaryText from './PrimaryText';

const PrimaryHeader: FC<PrimaryHeaderProps> = ({
  title,
  left,
  search,
  onSearchPress,
}) => {
  /********** Props and Data destructuring *********/

  /********** Hooks Functions *********/
  const {noInternet, prepTime, isPrinterConnected} = useSelector(
    (state: RootState) => ({
      noInternet: state.generic.noInternet,
      prepTime: state.dashboard.prepTime,
      isPrinterConnected: state.settings.isPrinterConnected,
    }),
  );

  const navigation = useNavigation();

  const handleOpenDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  return (
    <View style={commonStyles.primaryHeaderStyles}>
      <View style={commonStyles.primaryHeaderLeftSide}>
        <TouchableOpacity
          onPress={() =>
            left == 'menu' ? handleOpenDrawer() : navigation.goBack()
          }>
          <Image
            style={
              left == 'menu'
                ? commonStyles.primaryHeaderMenuIcon
                : commonStyles.primaryHeaderBackIcon
            }
            source={left == 'menu' ? images.icMenu : images.icBack}
          />
        </TouchableOpacity>
        <PrimaryText style={commonStyles.primaryHeaderLabelStyles}>
          {title}
        </PrimaryText>
      </View>

      <View style={commonStyles.primaryHeaderRightSide}>
        <Image style={commonStyles.normalIcon} source={images.icLocation} />
        <PrimaryText style={commonStyles.locationText}>
          {prepTime?.name}
        </PrimaryText>
        <View style={styles.separatorLine} />

        <TouchableOpacity
          onPress={() => setLocationStatusApi({status: !prepTime?.status})}
          style={styles.switchButtonWrapper}>
          <View
            style={{
              ...styles.switchButtonStyles,
              backgroundColor: prepTime?.status
                ? colors.secondary
                : colors.statusRed,
              alignSelf: prepTime?.status ? 'flex-end' : 'flex-start',
              opacity: prepTime?.status != null ? 1 : 0,
            }}>
            <PrimaryText style={styles.switchButtonText}>
              {prepTime?.status ? strings.btEnabled : strings.btDisabled}
            </PrimaryText>
          </View>
        </TouchableOpacity>

        {/* {left == 'menu' && (
          <Image
            style={{
              ...commonStyles.normalIcon,
              marginLeft: 15,
            }}
            source={images.icSync}
          />
        )} */}

        <Image
          style={{
            ...commonStyles.normalIcon,
            tintColor: noInternet ? colors.statusRed : colors.statusGreen,
            marginLeft: 20,
          }}
          source={images.icWifi}
        />

        <TouchableOpacity
          onPress={
            search
              ? onSearchPress
              : //@ts-ignore
                () => navigation.navigate(screenName.settingsStack)
          }>
          <Image
            style={{
              ...commonStyles.normalIcon,
              marginLeft: 20,
              tintColor: search
                ? undefined
                : isPrinterConnected
                ? colors.btBlue
                : undefined,
            }}
            source={search ? images.icSearch : images.icBtInactive}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PrimaryHeader;

const styles = StyleSheet.create({
  separatorLine: {
    height: 50,
    width: 1,
    backgroundColor: colors.white,
  },
  switchButtonWrapper: {
    width: 110,
    borderRadius: 5,
    backgroundColor: colors.white,
    justifyContent: 'center',
    marginLeft: 15,
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  switchButtonStyles: {
    paddingVertical: 4,
    borderRadius: 5,
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  switchButtonText: {
    ...fonts.regular26,
    color: colors.white,
  },
});
