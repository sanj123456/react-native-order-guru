import {colors} from './colors';
import {StyleSheet} from 'react-native';
import {fonts} from './fonts';

export const commonStyles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: colors.screenBackground,
  },
  containerCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  horizontalCenterStyles: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  horizontalBetweenStyles: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  primaryButtonStyle: {
    height: 50,
    backgroundColor: colors.secondary,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonLabelStyles: {
    ...fonts.regular32,
    color: colors.white,
  },
  primaryHeaderStyles: {
    width: '100%',
    height: 100,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingTop: 20,
    justifyContent: 'space-between',
  },
  primaryHeaderLeftSide: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  primaryHeaderMenuIcon: {
    height: 35,
    width: 35,
    resizeMode: 'contain',
    marginRight: 15,
  },
  primaryHeaderBackIcon: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
    marginRight: 15,
    tintColor: colors.white,
  },
  primaryHeaderLabelStyles: {
    ...fonts.heading46,
    color: colors.white,
  },
  primaryHeaderRightSide: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  normalIcon: {
    height: 25,
    width: 25,
    resizeMode: 'contain',
    marginLeft: 15,
  },
  smallIcon: {
    height: 18,
    width: 18,
    resizeMode: 'contain',
  },
  extraSmallIcon: {
    height: 15,
    width: 15,
    resizeMode: 'contain',
  },
  verySmallIcon: {
    height: 10,
    width: 10,
    resizeMode: 'contain',
  },
  locationText: {
    color: colors.white,
    width: 110,
    marginLeft: 10,
    flex: 1,
  },
  secondaryHeaderStyles: {
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryHeaderLeftSide: {
    position: 'absolute',
    left: 20,
  },
  hitSlop: {
    top: 15,
    bottom: 15,
    left: 15,
    right: 15,
  },
});
