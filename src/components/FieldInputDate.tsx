import React, {FC, useEffect, useState} from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native';
import {colors} from '../styles';
import PrimaryText from './PrimaryText';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {FieldInputDateProps} from '../types/components';
import {compareScreenWidth} from '../core';
import {useSelector} from 'react-redux';
import {dispatch, RootState} from '../redux';
import {setShowDateModal} from '../redux/modules/orderSlice';

const FieldInputDate: FC<FieldInputDateProps> = ({
  value,
  onChange,
  maximumDate,
  inputStyles,
}) => {
  /********* Hooks Functions *********/
  // const {showDateModal} = useSelector((state: RootState) => ({
  //   showDateModal: state.order.showDateModal,
  // }));
  const [showDateModal, setShowDateModal] = useState(false);

  const {isOpenDatePicker} = useSelector((state: RootState) => ({
    isOpenDatePicker: state?.generic?.isOpenDatePicker,
  }));

  useEffect(() => {
    if (isOpenDatePicker) {
      setShowDateModal(false);
    }
  }, [isOpenDatePicker]);

  /********* Main Functions *********/
  const handleDateSelection = (date: Date) => {
    console.log('Selected Date==>', date);
    onChange(date);
    // dispatch(setShowDateModal(false));
    setShowDateModal(false);
  };

  return (
    <TouchableOpacity
      // onPress={() => dispatch(setShowDateModal(true))}
      onPress={() => setShowDateModal(true)}
      style={{
        ...styles.mainView,
        width: compareScreenWidth() ? 280 : 250,
      }}>
      <PrimaryText style={inputStyles} props={{numberOfLines: 1}}>
        {value}
      </PrimaryText>

      <DateTimePickerModal
        maximumDate={maximumDate ?? undefined}
        isVisible={showDateModal}
        mode="datetime"
        onConfirm={handleDateSelection}
        // onCancel={() => dispatch(setShowDateModal(false))}
        onCancel={() => setShowDateModal(false)}
      />
    </TouchableOpacity>
  );
};

export default FieldInputDate;

const styles = StyleSheet.create({
  mainView: {
    height: 40,
    paddingHorizontal: 10,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.dateFieldBorder,
    borderRadius: 3,
  },
});
