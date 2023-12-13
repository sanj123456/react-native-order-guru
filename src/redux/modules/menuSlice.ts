import {createSlice} from '@reduxjs/toolkit';

interface MenuState {
  allMenuCategoriesData: any[];
  menuItemsData: {
    results: any[];
    total: number;
  };
  isMenuRefreshing: boolean;
  isLoadingMoreMenu: boolean;
  isRefreshingMenuCategories: boolean;
  isSnoozeModalVisible: boolean;
}

const initialState: MenuState = {
  allMenuCategoriesData: [],
  menuItemsData: {
    results: [],
    total: 0,
  },
  isMenuRefreshing: false,
  isLoadingMoreMenu: false,
  isRefreshingMenuCategories: false,
  isSnoozeModalVisible: false,
};

export const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    setAllMenuCategoriesData: (state, action) => {
      state.allMenuCategoriesData = action?.payload;
    },
    setMenuItemsData: (state, action) => {
      state.menuItemsData = action?.payload;
    },
    setIsMenuRefreshing: (state, action) => {
      state.isMenuRefreshing = action?.payload;
    },
    setIsLoadingMoreMenu: (state, action) => {
      state.isLoadingMoreMenu = action?.payload;
    },
    setIsRefreshingMenuCategories: (state, action) => {
      state.isRefreshingMenuCategories = action?.payload;
    },
    setIsSnoozeModalVisible: (state, action) => {
      state.isSnoozeModalVisible = action?.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setAllMenuCategoriesData,
  setMenuItemsData,
  setIsMenuRefreshing,
  setIsLoadingMoreMenu,
  setIsRefreshingMenuCategories,
  setIsSnoozeModalVisible,
} = menuSlice.actions;

export default menuSlice.reducer;
