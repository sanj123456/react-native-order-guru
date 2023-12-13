import React, {FC} from 'react';
import {TouchableOpacity} from 'react-native';
import {commonStyles} from '../styles';
import {PrimaryButtonProps} from '../types/components';
import PrimaryText from './PrimaryText';

const PrimaryButton: FC<PrimaryButtonProps> = ({
  style,
  title,
  addMargin,
  onPress,
  onPressIn,
  onPressOut,
  disabled,
}) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={{
        ...commonStyles.primaryButtonStyle,
        marginTop: addMargin ?? 0,
        ...style,
      }}>
      <PrimaryText style={commonStyles.primaryButtonLabelStyles}>
        {title}
      </PrimaryText>
    </TouchableOpacity>
  );
};

export default PrimaryButton;
