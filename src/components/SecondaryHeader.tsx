import {useNavigation} from '@react-navigation/native';
import React, {FC} from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {images} from '../core';
import {colors, commonStyles, fonts} from '../styles';
import {SecondaryHeaderProps} from '../types/components';
import PrimaryText from './PrimaryText';

const SecondaryHeader: FC<SecondaryHeaderProps> = ({
  title,
  backgroundColor,
}) => {
  const navigation = useNavigation();

  return (
    <View
      style={{
        ...commonStyles.secondaryHeaderStyles,
        backgroundColor: backgroundColor ?? colors.transparent,
      }}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        hitSlop={commonStyles.hitSlop}
        style={commonStyles.secondaryHeaderLeftSide}>
        <Image style={commonStyles.smallIcon} source={images.icBack} />
      </TouchableOpacity>
      <PrimaryText style={{...fonts.regular36, color: colors.historyText}}>
        {title}
      </PrimaryText>
    </View>
  );
};

export default SecondaryHeader;

const styles = StyleSheet.create({});
