import {StyleSheet} from 'react-native';
import {colors} from './colors';

export const fontFamily = {
  primaryBold: 'Roboto-Bold',
  primaryExtraBold: 'Roboto-Black',
  primaryRegular: 'Roboto-Regular',
  primaryMedium: 'Roboto-Medium',
  primaryLight: 'Roboto-Light',
  primaryItalic: 'Roboto-Italic',
};

const headingFont = {
  fontFamily: fontFamily.primaryBold,
  color: colors.black,
};

const mediumFont = {
  fontFamily: fontFamily.primaryMedium,
  color: colors.black,
};

const regularFont = {
  fontFamily: fontFamily.primaryRegular,
  color: colors.black,
};

const italicFont = {
  fontFamily: fontFamily.primaryItalic,
  color: colors.black,
};

const lightFont = {
  fontFamily: fontFamily.primaryLight,
  color: colors.black,
};

/**
 *
 * The font size is handled according to UI and device resolution.
 * The size defined in figma is not working same in device so it may vary
 * size:46 in figma is size:26 in device
 *
 * */

export const fonts = StyleSheet.create({
  // Bold
  heading112: {
    ...headingFont,
    fontSize: 50,
  },
  heading51: {
    ...headingFont,
    fontSize: 28,
  },
  heading46: {
    ...headingFont,
    fontSize: 26,
  },
  heading37: {
    ...headingFont,
    fontSize: 18,
  },
  heading36: {
    ...headingFont,
    fontSize: 17.5,
  },

  // medium
  medium51: {
    ...mediumFont,
    fontSize: 27,
  },
  medium48: {
    ...mediumFont,
    fontSize: 24,
  },
  medium46: {
    ...mediumFont,
    fontSize: 23,
  },
  medium43: {
    ...mediumFont,
    fontSize: 21.5,
  },
  medium36: {
    ...mediumFont,
    fontSize: 19,
  },
  medium32: {
    ...mediumFont,
    fontSize: 16,
  },
  medium28: {
    ...mediumFont,
    fontSize: 14,
  },
  medium24: {
    ...mediumFont,
    fontSize: 12,
  },

  // Regular
  regular48: {
    ...regularFont,
    fontSize: 24,
  },
  regular40: {
    ...regularFont,
    fontSize: 20,
  },
  regular38: {
    ...regularFont,
    fontSize: 19,
  },
  regular36: {
    ...regularFont,
    fontSize: 18,
  },
  regular32: {
    ...regularFont,
    fontSize: 18,
  },
  regular30: {
    ...regularFont,
    fontSize: 16,
  },
  regular28: {
    // Used in CustomText component
    ...regularFont,
    fontSize: 16,
  },
  regular26: {
    ...regularFont,
    fontSize: 14,
  },
  regular24: {
    ...regularFont,
    fontSize: 12,
  },
  regular22: {
    ...regularFont,
    fontSize: 11,
  },
  regular20: {
    ...regularFont,
    fontSize: 10,
  },

  // Light
  light40: {
    ...lightFont,
    fontSize: 20,
  },
  light28: {
    ...lightFont,
    fontSize: 14,
  },

  // Italic
  italic32: {
    ...italicFont,
    fontSize: 18,
  },
});
