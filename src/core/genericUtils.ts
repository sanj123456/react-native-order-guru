import moment from 'moment';
import {Dimensions} from 'react-native';
import {showMessage} from 'react-native-flash-message';

const {width, height} = Dimensions.get('screen');

// These toast are used to show the message to replace alert message and for in app notification tray

export const errorToast = (
  description?: string,
  msg?: string,
  position?:
    | 'top'
    | 'bottom'
    | 'center'
    | {top?: number; left?: number; bottom?: number; right?: number},
) => {
  showMessage({
    message: msg ? msg : 'Error',
    description: description ? description : 'Oops! something went wrong',
    type: 'danger',
    position: position ?? 'bottom',
    icon: 'auto',
  });
};

export const successToast = (
  description: string,
  msg?: string,
  position?:
    | 'top'
    | 'bottom'
    | 'center'
    | {top?: number; left?: number; bottom?: number; right?: number},
) => {
  showMessage({
    message: msg ? msg : 'Success',
    description: description ? description : '',
    type: 'success',
    position: position ?? 'bottom',
    icon: 'auto',
  });
};

// Converting object data into form data

export const convertToFormData = (payload: any) => {
  let formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    formData.append(key, value);
  });
  console.log('Converted formData', formData);
  return formData;
};

export const compareScreenWidth = (value?: number) => {
  return value ?? width > 800;
};

export const dateTimeComparison = (bigDate: any, smallDate: any) => {
  console.log(
    'dateTimeComparison',
    moment(bigDate).format('YYYYMMDDHHmm'),
    moment(smallDate).format('YYYYMMDDHHmm'),
    !(
      moment(bigDate).format('YYYYMMDDHHmm') >=
      moment(smallDate).format('YYYYMMDDHHmm')
    ),
  );
  return (
    moment(bigDate).format('YYYYMMDDHHmm') >=
    moment(smallDate).format('YYYYMMDDHHmm')
  );
};

export const capitalize = (text: string) => {
  return text.replace(/^./, str => str.toUpperCase());
};
