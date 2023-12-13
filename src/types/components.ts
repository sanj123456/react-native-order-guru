import {ReactNode} from 'react';
import {TextProps, TextStyle, ViewStyle} from 'react-native';
import {orderItemDataTypes} from './storeTypes';

export type PrimaryTextProps = {
  style?: TextStyle;
  children?: ReactNode;
  props?: TextProps;
};

export type PrimaryButtonProps = {
  style?: ViewStyle;
  title: string;
  addMargin?: number;
  onPress: () => void;
  onPressIn?: () => void;
  onPressOut?: () => void;
  disabled?: boolean;
};

export type FieldInputProps = {
  placeholder?: string;
  inputViewStyles?: ViewStyle;
  inputStyles?: TextStyle;
  onChangeText: (text: string) => void;
  value: string;
  type: 'email' | 'password';
};

export type OrderItemProps = {
  data: orderItemDataTypes;
  index?: number;
  dashboardTab?: 'prepare' | 'ordered' | 'upcoming' | string | undefined;
  animatedValue?: any;
  showAnimation?: boolean;
};

export type SecondaryHeaderProps = {
  title: string;
  backgroundColor?: string;
};

export type PrimaryHeaderProps = {
  title: string;
  left: 'menu' | 'back';
  search?: boolean;
  onSearchPress?: () => void;
};

export type PrimaryModalProps = {
  isVisible: boolean;
  onClosePress: () => void;
  type: 'primary' | 'snooze' | 'notification' | 'printerList';
  data?: any;
};

export type LoaderProps = {};

export type FieldInputDateProps = {
  value: any;
  onChange: (date: Date) => void;
  maximumDate?: Date;
  inputStyles?: TextStyle;
};

export type NoInternetProps = {};
