import AsyncStorage from '@react-native-async-storage/async-storage';

export const setAsyncData = async (key: string, value: any) => {
  console.log('Key', key, '\n Value', value);
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    console.log('setAsyncData Error', e);
  }
};

export const getAsyncData = async (key: string) => {
  let data = null;
  try {
    const res: any = await AsyncStorage.getItem(key);
    data = JSON.parse(res);
  } catch (e) {
    console.log('getAsyncData Error', e);
  }
  return data;
};

export const removeAsyncData = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    // remove error
    console.log('removeAsyncData Error', e);
  }

  console.log('Removed.');
};
