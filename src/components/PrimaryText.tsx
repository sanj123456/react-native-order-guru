import React, {FC} from 'react';
import {Text} from 'react-native';
import {fonts} from '../styles';
import {PrimaryTextProps} from '../types/components';

const PrimaryText: FC<PrimaryTextProps> = ({style, children, props}) => {
  return (
    <Text
      style={{
        ...fonts.regular28,
        ...style,
      }}
      maxFontSizeMultiplier={1.2}
      {...props}>
      {children}
    </Text>
  );
};

export default PrimaryText;
