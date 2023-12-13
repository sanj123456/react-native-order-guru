import React, {FC} from 'react';
import {BackHandler, StyleSheet, useWindowDimensions, View} from 'react-native';
import Modal from 'react-native-modal';
import {colors, fonts} from '../styles';
import PrimaryButton from './PrimaryButton';
import PrimaryText from './PrimaryText';

const DeviceNotSupported: FC = () => {
  /*********** Hooks Functions ************/
  const {width} = useWindowDimensions();
  return (
    <Modal isVisible={width < 600}>
      <View style={styles.mainView}>
        <PrimaryText
          style={{
            ...fonts.heading46,
            color: colors.statusRed,
            alignSelf: 'center',
          }}>
          Sorry!
        </PrimaryText>
        <PrimaryText
          style={{
            ...fonts.medium32,
            color: colors.primaryText,
            alignSelf: 'center',
          }}>
          Application is not supported in this device.
        </PrimaryText>
        <PrimaryButton
          title="Exit App"
          onPress={() => BackHandler.exitApp()}
          addMargin={20}
        />
      </View>
    </Modal>
  );
};

export default DeviceNotSupported;

const styles = StyleSheet.create({
  mainView: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    borderRadius: 10,
    elevation: 3,
    alignSelf: 'center',
  },
});
