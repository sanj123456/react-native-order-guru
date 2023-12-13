import {useFocusEffect} from '@react-navigation/native';
import React, {FC, useCallback, useState} from 'react';
import {
  Image,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {FlatList, ScrollView, TextInput} from 'react-native-gesture-handler';
import {useSelector} from 'react-redux';
import {
  PrimaryModal,
  NoDataFound,
  PrimaryHeader,
  PrimaryText,
} from '../../components';
import {images} from '../../core';
import {dispatch, RootState} from '../../redux';
import {
  setIsSnoozeModalVisible,
  setMenuItemsData,
} from '../../redux/modules/menuSlice';
import {
  allMenuCategoriesApi,
  menuItemsApi,
  updateMenuItemStatusApi,
} from '../../services';
import {colors, commonStyles, fonts} from '../../styles';
import {MenuItemParams} from '../../types/apiDataTypes';
import {CommonNavigationProps} from '../../types/navigationTypes';
import {menuItemDataTypes} from '../../types/storeTypes';

const MenuScreen: FC<CommonNavigationProps> = ({navigation, route}) => {
  /************ Props and Data structuring *************/

  /************ Hooks Functions *************/
  const {
    allMenuCategoriesData,
    menuItemsData,
    isLoadingMoreMenu,
    isMenuRefreshing,
    isRefreshingMenuCategories,
    isSnoozeModalVisible,
    noInternet,
  } = useSelector((state: RootState) => ({
    allMenuCategoriesData: state.menu.allMenuCategoriesData,
    menuItemsData: state.menu.menuItemsData,
    isLoadingMoreMenu: state.menu.isLoadingMoreMenu,
    isMenuRefreshing: state.menu.isMenuRefreshing,
    isRefreshingMenuCategories: state.menu.isRefreshingMenuCategories,
    isSnoozeModalVisible: state.menu.isSnoozeModalVisible,
    noInternet: state.generic.noInternet,
  }));

  const [showSearchBar, setShowSearchBar] = useState(false);
  const [selectedCatID, setSelectedCatID] = useState('');
  const [menuItemParamsData, setMenuItemParamsData] = useState<MenuItemParams>({
    limit: 20,
    page: 0,
    sort: 'desc',
    _q: '',
  });
  const [selectedSnoozeID, setSelectedSnoozeID] = useState('');

  useFocusEffect(
    useCallback(() => {
      dispatch(
        setMenuItemsData({
          results: [],
          total: 0,
        }),
      );
      if (allMenuCategoriesData?.length == 0 && !noInternet) {
        allMenuCategoriesApi();
        setMenuItemParamsData({
          ...menuItemParamsData,
          page: 0,
        });
      } else if (allMenuCategoriesData?.length > 0 && !noInternet) {
        menuItemsApi(allMenuCategoriesData?.[0]?._id, menuItemParamsData);
        setSelectedCatID(allMenuCategoriesData?.[0]?._id);
      }
    }, [allMenuCategoriesData?.length, noInternet]),
  );

  /************ Main Functions *************/
  const handleSelectCategory = (id: string) => () => {
    menuItemsApi(id, menuItemParamsData);
    setSelectedCatID(id);
  };

  const handleItemStatus = (item: menuItemDataTypes) => () => {
    const payload = {status: !item?.status};
    updateMenuItemStatusApi(item?._id, payload, 'status');
  };

  const handleItemSnoozeStatus = (item: menuItemDataTypes) => () => {
    setSelectedSnoozeID(item?._id);
    dispatch(setIsSnoozeModalVisible(true));
  };

  const handleRefreshMenu = () => {
    menuItemsApi(
      selectedCatID,
      {
        ...menuItemParamsData,
        page: 0,
      },
      'refreshing',
    );
    setMenuItemParamsData({
      ...menuItemParamsData,
      page: 0,
    });
  };

  const isCloseToBottom = ({
    layoutMeasurement,
    contentOffset,
    contentSize,
  }: any) => {
    const paddingToBottom = 20;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };

  const handleLoadMoreMenu = () => {
    menuItemsApi(
      selectedCatID,
      {
        ...menuItemParamsData,
        page: menuItemParamsData?.page + 1,
      },
      'load_more',
    );
    setMenuItemParamsData({
      ...menuItemParamsData,
      page: menuItemParamsData?.page + 1,
    });
  };

  const handleRefreshMenuCategories = () => {
    allMenuCategoriesApi();
    setMenuItemParamsData({
      ...menuItemParamsData,
      page: 0,
    });
  };

  return (
    <View style={commonStyles.mainView}>
      <PrimaryHeader
        title="Menu"
        left="menu"
        search
        onSearchPress={() => {
          setShowSearchBar(!showSearchBar);
          if (showSearchBar) {
            setMenuItemParamsData({
              ...menuItemParamsData,
              _q: '',
              page: 0,
            });
            menuItemsApi(
              selectedCatID,
              {
                ...menuItemParamsData,
                _q: '',
                page: 0,
              },
              'search',
            );
          }
        }}
      />
      <View style={styles.contentContainer}>
        {/* Render Modal */}

        <PrimaryModal
          data={selectedSnoozeID}
          type="snooze"
          onClosePress={() => dispatch(setIsSnoozeModalVisible(false))}
          isVisible={isSnoozeModalVisible}
        />

        {/* Render Screen Left content */}
        <View style={styles.leftContainer}>
          <FlatList
            refreshControl={
              <RefreshControl
                refreshing={isRefreshingMenuCategories}
                onRefresh={handleRefreshMenuCategories}
              />
            }
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingVertical: 25}}
            data={allMenuCategoriesData}
            keyExtractor={(item, index) => `${index}menuItemsKeys`}
            renderItem={({item, index}) => (
              <TouchableOpacity
                onPress={handleSelectCategory(item?._id)}
                style={{
                  ...styles.menuItemWrapper,
                  borderRightWidth: item?._id == selectedCatID ? 1.5 : 0,
                }}>
                <PrimaryText
                  style={{
                    ...fonts.medium36,
                    color:
                      item?._id == selectedCatID
                        ? colors.secondary
                        : colors.bannerHeadingText,
                  }}>
                  {item?.categoryName}
                </PrimaryText>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* Render Screen Right content */}
        <View style={styles.rightContainer}>
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={isMenuRefreshing}
                onRefresh={handleRefreshMenu}
              />
            }
            scrollEventThrottle={1000}
            onScroll={({nativeEvent}) => {
              if (
                isCloseToBottom(nativeEvent) &&
                menuItemsData?.results?.length < menuItemsData?.total &&
                !isLoadingMoreMenu
              ) {
                console.log('you can scroll more');
                handleLoadMoreMenu();
              }
            }}
            contentContainerStyle={styles.rightContentContainerStyle}
            showsVerticalScrollIndicator={false}>
            {showSearchBar && (
              <View style={styles.searchViewStyles}>
                <TextInput
                  style={styles.searchInputStyles}
                  placeholder="Search"
                  value={menuItemParamsData?._q}
                  onChangeText={_q => {
                    setMenuItemParamsData({
                      ...menuItemParamsData,
                      _q,
                      page: 0,
                    });
                    menuItemsApi(
                      selectedCatID,
                      {
                        ...menuItemParamsData,
                        _q,
                        page: 0,
                      },
                      'search',
                    );
                  }}
                />
                <Image
                  style={{
                    ...commonStyles.smallIcon,
                    tintColor: colors.bannerHeadingText,
                  }}
                  source={images.icSearch}
                />
              </View>
            )}

            <View
              style={{
                alignSelf: 'flex-end',
                marginTop: 15,
              }}>
              <PrimaryText
                style={{
                  ...fonts.light28,
                  color: colors.bannerHeadingText,
                }}>
                SHOW IN MENU?
              </PrimaryText>
            </View>

            {menuItemsData?.results?.length > 0 ? (
              <View>
                {menuItemsData?.results?.map((item, index) => (
                  <View
                    style={styles.menuOptionWrapper}
                    key={`${index}_menu_items_keys`}>
                    <PrimaryText
                      style={{
                        ...fonts.medium36,
                        color: colors.blackText,
                        width: '55%',
                      }}>
                      {item?.name}
                    </PrimaryText>

                    {/*//TODO: This code will be used in second phase */}
                    <TouchableOpacity
                      // @ts-ignore
                      disabled={!item?.status}
                      onPress={handleItemSnoozeStatus(item)}
                      style={styles.snoozeButton}>
                      <PrimaryText
                        style={{
                          ...fonts.medium28,
                          color: colors.white,
                        }}>
                        {!item?.status ? 'Snoozed' : 'Snooze'}
                      </PrimaryText>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={handleItemStatus(item)}
                      style={{
                        ...styles.switchButton,
                        backgroundColor: item?.status
                          ? colors.statusGreen
                          : colors.statusRed,
                      }}>
                      <PrimaryText
                        style={{
                          ...fonts.light28,
                          color: colors.white,
                          alignSelf: item?.status ? 'flex-start' : 'flex-end',
                        }}>
                        {item?.status ? 'Yes' : 'No'}
                      </PrimaryText>
                      <View
                        style={{
                          ...styles.switchToggle,
                          left: item?.status ? undefined : 3,
                          right: item?.status ? 3 : undefined,
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            ) : (
              <NoDataFound />
            )}
          </ScrollView>
        </View>
      </View>
    </View>
  );
};

export default MenuScreen;

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  leftContainer: {
    width: '30%',
    backgroundColor: colors.white,
  },
  menuItemWrapper: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderColor: colors.secondary,
  },
  rightContainer: {
    width: '70%',
  },
  rightContentContainerStyle: {
    paddingHorizontal: 35,
    paddingVertical: 20,
  },
  searchViewStyles: {
    width: '100%',
    height: 45,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    backgroundColor: colors.white,
    borderWidth: 0.5,
    borderColor: colors.dateFieldBorder,
    justifyContent: 'space-between',
  },
  searchInputStyles: {
    ...fonts.regular32,
    color: colors.blackText,
    width: '94%',
  },
  menuOptionWrapper: {
    width: '100%',
    flexDirection: 'row',
    alignSelf: 'center',
    paddingHorizontal: 20,
    backgroundColor: colors.white,
    borderRadius: 10,
    marginTop: 15,
    paddingVertical: 15,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  snoozeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.secondary,
    borderRadius: 5,
  },
  switchButton: {
    width: 65,
    height: 35,
    justifyContent: 'center',
    borderRadius: 5,
    paddingHorizontal: 5,
  },
  switchToggle: {
    width: 30,
    height: 30,
    backgroundColor: colors.white,
    borderRadius: 5,
    position: 'absolute',
    zIndex: 2,
  },
});
