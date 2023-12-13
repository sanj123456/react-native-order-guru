import {createSlice} from '@reduxjs/toolkit';

interface DashboardState {
  allOrderData: {
    total: number;
    results: any[];
    stats: {
      prepared: number;
      delivered: number;
      pending: number;
      _id: null;
    };
  };
  isRefreshing: boolean;
  isLoadingMore: boolean;
  prepTime: {
    prepTime: {delivery: number; pickup: number; hasMultipleZones: boolean};
    status: boolean | null;
    name: string;
    partnerLogo: string | null;
  };
  orderStats: {
    totalOrders: number;
    totalTip: number;
  };
  newNotifiedOrder: {
    orderId: string | null;
    orderNum: string | null;
    orderTiming: string | null;
  };
}

const initialState: DashboardState = {
  allOrderData: {
    total: 0,
    results: [],
    stats: {
      prepared: 0,
      delivered: 0,
      pending: 0,
      _id: null,
    },
  },
  isRefreshing: false,
  isLoadingMore: false,
  prepTime: {
    prepTime: {delivery: 0, pickup: 0},
    status: null,
    name: '',
    partnerLogo: null,
  },
  orderStats: {
    totalOrders: 0,
    totalTip: 0,
  },
  newNotifiedOrder: {
    orderId: null,
    orderNum: null,
    orderTiming: null,
  },
};

export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setAllOrderData: (state, action) => {
      state.allOrderData = action?.payload;
    },
    setIsRefreshing: (state, action) => {
      state.isRefreshing = action?.payload;
    },
    setIsLoadingMore: (state, action) => {
      state.isLoadingMore = action?.payload;
    },
    setPrepTime: (state, action) => {
      state.prepTime = action?.payload;
    },
    setOrderStats: (state, action) => {
      state.orderStats = action?.payload;
    },
    setNewNotifiedOrder: (state, action) => {
      state.newNotifiedOrder = action?.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setAllOrderData,
  setIsRefreshing,
  setIsLoadingMore,
  setPrepTime,
  setOrderStats,
  setNewNotifiedOrder,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
