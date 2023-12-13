import React, {FC, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Animated,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useSelector} from 'react-redux';
import {PrimaryModal, PrimaryText, SecondaryHeader} from '../../components';
import {constants} from '../../core';
import {strings} from '../../i18n';
import {dispatch, RootState} from '../../redux';
import {
  setSearchedPrinters,
  setShowPrinterModal,
  updateSettings,
} from '../../redux/modules/settingsSlice';
import {setAsyncData} from '../../services';
import {printerServices} from '../../services/printerServices';
import {colors, commonStyles, fonts} from '../../styles';

type SectionDataType = {
  label: string;
  type: 'switch' | 'status' | 'text';
  value: string | number;
  status: boolean;
};

const PrinterSettings: FC = ({}) => {
  /************* Hooks Function **************/
  const {
    settings,
    searchedPrinters,
    showPrinterModal,
    searchedPrintersLoader,
    isPrinterConnected,
  } = useSelector((state: RootState) => ({
    settings: state.settings.settings,
    searchedPrinters: state.settings.searchedPrinters,
    showPrinterModal: state.settings.showPrinterModal,
    searchedPrintersLoader: state.settings.searchedPrintersLoader,
    isPrinterConnected: state.settings.isPrinterConnected,
  }));

  const printerTypeRef = useRef(new Animated.Value(0)).current;
  const numOfCopyRef = useRef(new Animated.Value(0)).current;

  const [dropdownData, setDropdownData] = useState<{
    isVisible: boolean;
    type: 'printerType' | 'numOfCopy' | string;
    data: any[];
  }>({
    isVisible: false,
    type: '',
    data: [],
  });

  const {
    autoPrint,
    enablePrinting,
    printingType,
    fontSize,
    numOfCopy,
    printerMacAddress,
  } = settings;

  const firstSectionData: SectionDataType[] = [
    {
      label: 'Enable Printing',
      type: 'switch',
      value: '',
      status: enablePrinting,
    },
    {
      label: 'Auto Print when connected to printer',
      type: 'switch',
      value: '',
      status: autoPrint,
    },
    {
      label: 'Select Printing Type',
      type: 'status',
      value: printingType,
      status: false,
    },
  ];

  const secondSectionData: SectionDataType[] = [
    {
      label: 'Connect to printer',
      type: 'status',
      value: 'Connect Now',
      status: false,
    },
    {
      label: 'Printer Status',
      type: 'text',
      value: printerMacAddress
        ? printerMacAddress +
          (isPrinterConnected ? ' (Connected)' : ' (Disconnected)')
        : 'No device connected',
      status: false,
    },
    {
      label: 'Disconnect printer',
      type: 'status',
      value: 'Disconnect Now',
      status: false,
    },
    {
      label: 'Printer font size',
      type: 'status',
      value: fontSize,
      status: false,
    },
    {
      label: 'No of copies to print',
      type: 'status',
      value: numOfCopy,
      status: false,
    },
  ];

  const handleOnSwitchPress = (data: SectionDataType) => {
    if (data?.label == 'Enable Printing') {
      dispatch(
        updateSettings({
          enablePrinting: !enablePrinting,
        }),
      );
      setAsyncData(constants.asyncSettings, {
        ...settings,
        enablePrinting: !enablePrinting,
      });
    } else if (data?.label == 'Auto Print when connected to printer') {
      dispatch(
        updateSettings({
          autoPrint: !autoPrint,
        }),
      );
      setAsyncData(constants.asyncSettings, {
        ...settings,
        autoPrint: !autoPrint,
      });
    }
  };

  const handleOnStatusPress = (data: SectionDataType) => {
    if (data?.label == 'Select Printing Type') {
      setDropdownData({
        isVisible: true,
        type: 'printerType',
        data: [
          {label: 'Bluetooth', value: 'Bluetooth'},
          {label: 'Cloud Print', value: 'Cloud Print'},
        ],
      });
    } else if (data?.label == 'Connect to printer') {
      printerServices.getBluetoothPrinters();
    } else if (data?.label == 'Disconnect printer') {
      printerServices.disconnectFromBluetoothPrinter();
    } else if (data?.label == 'No of copies to print') {
      setDropdownData({
        isVisible: true,
        type: 'numOfCopy',
        data: [
          {label: 1, value: 1},
          {label: 2, value: 2},
        ],
      });
    }
  };

  const handleDropdownItemPress = (data: any) => {
    if (dropdownData?.type == 'printerType') {
      dispatch(
        updateSettings({
          printingType: data?.value,
        }),
      );
      setAsyncData(constants.asyncSettings, {
        ...settings,
        printingType: data?.value,
      });
      setDropdownData({
        isVisible: false,
        type: '',
        data: [],
      });
    } else if (dropdownData?.type == 'numOfCopy') {
      dispatch(
        updateSettings({
          numOfCopy: data?.value,
        }),
      );
      setAsyncData(constants.asyncSettings, {
        ...settings,
        numOfCopy: data?.value,
      });
      setDropdownData({
        isVisible: false,
        type: '',
        data: [],
      });
    }
  };

  const RenderItem: FC<{data: SectionDataType; showBorder: boolean}> = ({
    data,
    showBorder,
  }) => {
    return (
      <View
        onLayout={({nativeEvent}) => {
          if (data?.label == 'Select Printing Type') {
            console.log('value', nativeEvent.layout.y);
            Animated.timing(printerTypeRef, {
              toValue: nativeEvent.layout.y + 70,
              duration: 100,
              useNativeDriver: false,
            }).start();
          } else if (data?.label == 'No of copies to print') {
            Animated.timing(numOfCopyRef, {
              toValue: nativeEvent.layout.y + 260,
              duration: 100,
              useNativeDriver: false,
            }).start();
          }
        }}
        style={{
          ...styles.itemWrapper,
          borderBottomWidth: showBorder ? 0.5 : 0,
        }}>
        <PrimaryText
          style={{
            ...fonts.regular36,
            color: colors.blackText,
          }}>
          {data.label}
        </PrimaryText>

        {data.type == 'switch' && (
          <TouchableOpacity
            onPress={() => handleOnSwitchPress(data)}
            style={{
              ...styles.switchWrapper,
              backgroundColor: data?.status
                ? colors.switchBg
                : colors.statusRed,
              alignItems: data?.status ? 'flex-end' : 'flex-start',
            }}>
            <View style={styles.switchToggle} />
          </TouchableOpacity>
        )}

        {(data.type == 'status' || data.type == 'text') && (
          <TouchableOpacity
            disabled={
              data.type == 'text' ||
              (data?.label == 'Disconnect printer' && !isPrinterConnected)
            }
            activeOpacity={0.8}
            onPress={() => handleOnStatusPress(data)}
            style={commonStyles.horizontalCenterStyles}>
            <PrimaryText
              style={{
                ...fonts.regular38,
                color:
                  data?.label == 'Disconnect printer' && !isPrinterConnected
                    ? colors.borderColor
                    : data.type == 'status'
                    ? colors.blueText
                    : colors.blackText,
                marginRight: 5,
              }}>
              {data.value}
            </PrimaryText>
            {data?.label == 'Connect to printer' && searchedPrintersLoader ? (
              <ActivityIndicator size={'small'} color={colors.secondary} />
            ) : null}
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={commonStyles.mainView}>
      <SecondaryHeader
        title={strings.ctPrinterSettings}
        backgroundColor={colors.white}
      />

      {/* Render printer list modal */}
      <PrimaryModal
        type="printerList"
        isVisible={showPrinterModal}
        data={searchedPrinters}
        onClosePress={() => {
          dispatch(setShowPrinterModal(false));
          dispatch(setSearchedPrinters([]));
        }}
      />

      <ScrollView contentContainerStyle={styles.contentContainerStyle}>
        {dropdownData?.isVisible && (
          <Animated.View
            style={{
              ...styles.dropdownWrapper,
              top:
                dropdownData?.type == 'numOfCopy'
                  ? numOfCopyRef
                  : printerTypeRef,
            }}>
            {dropdownData.data.map((item, index) => (
              <TouchableOpacity
                onPress={() => handleDropdownItemPress(item)}
                style={styles.dropdownItem}
                key={`${index}_dropdown_item_key`}>
                <PrimaryText style={fonts.medium36}>{item.label}</PrimaryText>
              </TouchableOpacity>
            ))}
          </Animated.View>
        )}

        <View style={styles.sectionWrapper}>
          {firstSectionData.map((item, index) => (
            <RenderItem
              data={item}
              key={`$${index}optionKeys`}
              showBorder={index + 1 < firstSectionData?.length}
            />
          ))}
        </View>

        <View style={styles.sectionWrapper}>
          {secondSectionData.map((item, index) => (
            <RenderItem
              data={item}
              key={`$${index}optionKeys2`}
              showBorder={index + 1 < secondSectionData?.length}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default PrinterSettings;

const styles = StyleSheet.create({
  contentContainerStyle: {
    paddingHorizontal: 30,
    paddingVertical: 15,
  },
  sectionWrapper: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: 15,
    marginTop: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  itemWrapper: {
    ...commonStyles.horizontalBetweenStyles,
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderColor: colors.bannerHeadingText,
  },
  switchWrapper: {
    width: 50,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  switchToggle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.white,
  },
  dropdownWrapper: {
    position: 'absolute',
    backgroundColor: colors.white,
    paddingVertical: 5,
    paddingHorizontal: 8,
    zIndex: 2,
    right: 35,
    minWidth: 130,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: 10,
  },
  dropdownItem: {
    paddingVertical: 8,
    borderBottomWidth: 0.5,
  },
});
