import {createSlice} from '@reduxjs/toolkit';

interface OrderState {
  singleOrderData: any;
  isLoadingSingleOrder: boolean;
  orderHistoryData: {
    total: number;
    results: any[];
  };
  isRefreshingOrderHistory: boolean;
  isLoadingMoreOrderHistory: boolean;
  showDateModal: boolean;
  orderingItems: any[];
}

const initialState: OrderState = {
  singleOrderData: null,
  isLoadingSingleOrder: false,
  orderHistoryData: {
    total: 0,
    results: [],
  },
  isRefreshingOrderHistory: false,
  isLoadingMoreOrderHistory: false,
  showDateModal: false,
  orderingItems: [],
};

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setSingleOrderData: (state, action) => {
      state.singleOrderData = action?.payload;
    },
    setIsLoadingSingleOrder: (state, action) => {
      state.isLoadingSingleOrder = action?.payload;
    },
    setOrderHistoryData: (state, action) => {
      state.orderHistoryData = action?.payload;
    },
    setIsRefreshingOrderHistory: (state, action) => {
      state.isRefreshingOrderHistory = action?.payload;
    },
    setIsLoadingMoreOrderHistory: (state, action) => {
      state.isLoadingMoreOrderHistory = action?.payload;
    },
    setShowDateModal: (state, action) => {
      state.showDateModal = action?.payload;
    },
    setOrderingItems: (state, action) => {
      state.orderingItems = action?.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setSingleOrderData,
  setIsLoadingSingleOrder,
  setOrderHistoryData,
  setIsRefreshingOrderHistory,
  setIsLoadingMoreOrderHistory,
  setShowDateModal,
  setOrderingItems,
} = orderSlice.actions;

export default orderSlice.reducer;
