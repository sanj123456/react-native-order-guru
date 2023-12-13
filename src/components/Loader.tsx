import React, {FC} from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';
import Modal from 'react-native-modal';
import {useSelector} from 'react-redux';
import {strings} from '../i18n';
import {RootState} from '../redux';
import {colors, fonts} from '../styles';
import {LoaderProps} from '../types/components';
import PrimaryText from './PrimaryText';

const Loader: FC<LoaderProps> = ({}) => {
  const {isLoading} = useSelector((state: RootState) => ({
    isLoading: state.generic.isLoading,
  }));

  return (
    <Modal
      backdropOpacity={0.05}
      style={styles.modalStyles}
      animationIn={'fadeIn'}
      animationOut={'fadeOut'}
      isVisible={isLoading}>
      <View style={styles.mainViewWrapper}>
        <ActivityIndicator size={'large'} color={colors.secondary} />

        <PrimaryText
          style={{
            ...fonts.medium43,
            color: colors.blackText,
            marginTop: 15,
          }}>
          {strings.ctLoading}
        </PrimaryText>
      </View>
    </Modal>
  );
};

export default Loader;

const styles = StyleSheet.create({
  modalStyles: {
    alignItems: 'center',
    zIndex: 100,
  },
  mainViewWrapper: {
    backgroundColor: colors.white,
    paddingHorizontal: 50,
    paddingVertical: 30,
    borderRadius: 20,
    alignItems: 'center',
  },
  mainImage: {
    height: 220,
    width: 220,
    resizeMode: 'contain',
  },
});
