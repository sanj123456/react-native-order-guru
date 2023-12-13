import {createSlice} from '@reduxjs/toolkit';

interface GenericState {
  isLoading: boolean;
  noInternet: boolean;
  appStateVisible: 'inactive' | 'background' | 'active' | null;
  isNotificationModal: boolean;
  isOpenDatePicker: boolean;
  notificationAttention: {
    message: string;
    orderId: string;
    notificationId: string;
  } | null;
}

const initialState: GenericState = {
  isLoading: false,
  noInternet: false,
  appStateVisible: 'active',
  isNotificationModal: false,
  isOpenDatePicker: false,
  notificationAttention: null,
};

export const genericSlice = createSlice({
  name: 'generic',
  initialState,
  reducers: {
    setIsLoading: (state, action) => {
      state.isLoading = action?.payload;
    },
    setNoInternet: (state, action) => {
      state.noInternet = action?.payload;
    },
    setAppStateVisible: (state, action) => {
      state.appStateVisible = action?.payload;
    },
    setIsNotificationModal: (state, action) => {
      state.isNotificationModal = action?.payload;
    },
    setIsOpenDatePicker: (state, action) => {
      state.isOpenDatePicker = action?.payload;
    },
    setNotificationAttention: (state, action) => {
      state.notificationAttention = action?.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setIsLoading,
  setNoInternet,
  setAppStateVisible,
  setIsNotificationModal,
  setIsOpenDatePicker,
  setNotificationAttention,
} = genericSlice.actions;

export default genericSlice.reducer;
