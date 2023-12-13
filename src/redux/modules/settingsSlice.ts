import {createSlice} from '@reduxjs/toolkit';

interface SettingsState {
  settings: {
    enablePrinting: boolean;
    autoPrint: boolean;
    printingType: 'Bluetooth' | 'Cloud Print';
    fontSize: 'Default';
    numOfCopy: number;
    printerMacAddress: string | null;
  };
  searchedPrinters: any[];
  showPrinterModal: boolean;
  searchedPrintersLoader: boolean;
  isPrinterConnected: boolean;
}

const initialState: SettingsState = {
  settings: {
    enablePrinting: true,
    autoPrint: true,
    printingType: 'Bluetooth',
    fontSize: 'Default',
    numOfCopy: 1,
    printerMacAddress: null,
  },
  searchedPrinters: [],
  showPrinterModal: false,
  searchedPrintersLoader: false,
  isPrinterConnected: false,
};

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    updateSettings: (state, action) => {
      state.settings = {...state.settings, ...action?.payload};
    },
    setSearchedPrinters: (state, action) => {
      state.searchedPrinters = action?.payload;
    },
    setShowPrinterModal: (state, action) => {
      state.showPrinterModal = action?.payload;
    },
    setSearchedPrintersLoader: (state, action) => {
      state.searchedPrintersLoader = action?.payload;
    },
    setIsPrinterConnected: (state, action) => {
      state.isPrinterConnected = action?.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  updateSettings,
  setSearchedPrinters,
  setShowPrinterModal,
  setSearchedPrintersLoader,
  setIsPrinterConnected,
} = settingsSlice.actions;

export default settingsSlice.reducer;
