import React, {FC, useState} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import {images} from '../core';
import {colors, commonStyles, fonts} from '../styles';
import {FieldInputProps} from '../types/components';

const FieldInput: FC<FieldInputProps> = ({
  placeholder,
  inputViewStyles,
  inputStyles,
  onChangeText,
  value,
  type,
}) => {
  /********** Hooks Functions ***********/
  const [hidePassword, setHidePassword] = useState(
    type == 'password' ? true : false,
  );

  return (
    <View
      style={{
        ...commonStyles.horizontalBetweenStyles,
        ...inputViewStyles,
      }}>
      <TextInput
        hitSlop={{top: 20, bottom: 20, left: 0, right: 0}}
        style={{
          width: '100%',
          padding: 0,
          ...fonts.regular28,
          ...inputStyles,
        }}
        placeholder={placeholder}
        onChangeText={onChangeText}
        value={value}
        secureTextEntry={hidePassword}
        autoCapitalize={'none'}
      />
      {type == 'password' && (
        <TouchableOpacity onPress={() => setHidePassword(!hidePassword)}>
          <Image
            style={commonStyles.smallIcon}
            source={hidePassword ? images.icOpenEye : images.icCloseEye}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default FieldInput;
