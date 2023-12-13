import {NativeModules, Platform} from 'react-native';
import {
  constants,
  convertToBluetoothPrintData,
  errorToast,
  successToast,
} from '../core';
import {strings} from '../i18n';
import {getStore, dispatch} from '../redux/index';
import {setIsLoading} from '../redux/modules/genericSlice';
import {
  setShowPrinterModal,
  setSearchedPrinters,
  setSearchedPrintersLoader,
  setIsPrinterConnected,
  updateSettings,
} from '../redux/modules/settingsSlice';
import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';
import {setAsyncData} from './asyncServices';
const {CitizenPrinterModule} = NativeModules;

class PrinterModule {
  getBluetoothPrinters = () => {
    dispatch(setSearchedPrintersLoader(true));
    CitizenPrinterModule.getBluetoothPrinters((result: any) => {
      console.log('getBluetoothPrinters results', result);
      dispatch(setSearchedPrintersLoader(false));
      if (result == 'Error') {
        errorToast();
      } else if (result == 'No device found') {
        errorToast('', strings.msgNoPrinterFound);
      } else if (Array.isArray(result) && result?.length > 0) {
        //
        dispatch(setShowPrinterModal(true));
        dispatch(
          setSearchedPrinters(result), //['00:01:90:DF:D1:7C', '00:01:90:DF:D1:7C']
        );
      }
    });
  };

  connectToBluetoothPrinter = () => {
    const printerMacAddress = getStore().settings.settings.printerMacAddress;
    if (printerMacAddress) {
      CitizenPrinterModule?.checkBluetoothPrinterStatus((result: any) => {
        if (result == 'success') {
          dispatch(setIsPrinterConnected(true));
        } else {
          CitizenPrinterModule?.connectToBluetoothPrinter(
            printerMacAddress,
            (result: any) => {
              if (result == 'success') {
                successToast(
                  'The Bluetooth printer has connected successfully.',
                );
                dispatch(setIsPrinterConnected(true));
              } else {
                errorToast(result, strings.msgFailure);
              }
            },
          );
        }
      });
    } else {
      errorToast(strings.msgNoBluetoothDevice);
    }
  };

  disconnectFromBluetoothPrinter = () => {
    CitizenPrinterModule?.disconnectFromBluetoothPrinter((result: any) => {
      if (result == 'success') {
        const settings = getStore().settings.settings;
        dispatch(updateSettings({printerMacAddress: ''}));
        setAsyncData(constants.asyncSettings, {
          ...settings,
          printerMacAddress: '',
        });
        successToast('The Bluetooth printer has disconnected successfully.');
        dispatch(setIsPrinterConnected(false));
      } else {
        errorToast(result, strings.msgFailure);
      }
    });
  };

  checkBluetoothPrinterStatus = () => {
    console.log('checkBluetoothPrinterStatus init');
    CitizenPrinterModule?.checkBluetoothPrinterStatus((result: any) => {
      if (result == 'success') {
        dispatch(setIsPrinterConnected(true));
      } else {
        dispatch(setIsPrinterConnected(false));
        errorToast(result, strings.msgFailure);
      }
    });
  };

  handleBluetoothPrint = (singleOrderData: any) => {
    const {
      isPrinterConnected,
      settings: {printerMacAddress, numOfCopy},
    } = getStore().settings;
    const orderingItems = getStore().order.orderingItems;
    // convertToBluetoothPrintData(singleOrderData, orderingItems);
    // return;
    if (printerMacAddress) {
      //   if (isPrinterConnected) {
      CitizenPrinterModule?.checkBluetoothPrinterStatus((result: any) => {
        if (result == 'success') {
          dispatch(setIsLoading(true));
          CitizenPrinterModule?.handleBluetoothPrintCommand(
            numOfCopy.toString(),
            Platform.OS == 'android'
              ? convertToBluetoothPrintData(singleOrderData, orderingItems)
              : JSON.stringify(
                  convertToBluetoothPrintData(singleOrderData, orderingItems),
                ),
            (result: any) => {
              dispatch(setIsLoading(false));
              if (result == 'success') {
                successToast('The Bluetooth printing was successful.');
              } else {
                errorToast(result, strings.msgFailure);
              }
            },
          );
        } else {
          dispatch(setIsPrinterConnected(false));
          errorToast(result, strings.msgFailure);
        }
      });
      //   } else {
      //     errorToast(strings.msgNoPrinterConnected);
      //   }
    } else {
      errorToast(strings.msgNoBluetoothDevice);
    }
  };

  checkBluetoothScanPermission = () => {
    check(PERMISSIONS.ANDROID.BLUETOOTH_SCAN)
      .then(result => {
        console.log('checkBluetoothScanPermission response', result);
        if (result != RESULTS.GRANTED) {
          this.requestBluetoothScanPermission();
        }
      })
      .catch(error => {
        console.log('Error', error);
      });
  };

  requestBluetoothScanPermission = () => {
    request(PERMISSIONS.ANDROID.BLUETOOTH_SCAN)
      .then(result => {
        console.log('requestBluetoothScanPermission response=>', result);
        this.checkBluetoothConnectPermission();
      })
      .catch(e => console.log('requestBluetoothScanPermission Error', e));
  };

  checkBluetoothConnectPermission = () => {
    check(PERMISSIONS.ANDROID.BLUETOOTH_CONNECT)
      .then(result => {
        console.log('checkBluetoothConnectPermission response', result);
        if (result != RESULTS.GRANTED) {
          this.requestBluetoothConnectPermission();
        }
      })
      .catch(error => {
        console.log('Error', error);
      });
  };

  requestBluetoothConnectPermission = () => {
    request(PERMISSIONS.ANDROID.BLUETOOTH_CONNECT)
      .then(result => {
        console.log('requestBluetoothConnectPermission response=>', result);
      })
      .catch(e => console.log('requestBluetoothConnectPermission Error', e));
  };
}

export const printerServices = new PrinterModule();
