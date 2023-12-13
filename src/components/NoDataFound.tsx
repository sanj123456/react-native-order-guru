import React, {FC} from 'react';
import {View} from 'react-native';
import {fonts} from '../styles';
import PrimaryText from './PrimaryText';

const NoDataFound: FC = ({}) => {
  return (
    <View
      style={{
        width: '100%',
        paddingTop: '10%',
        alignItems: 'center',
      }}>
      <PrimaryText style={fonts.medium32}>No Data Found</PrimaryText>
    </View>
  );
};

export default NoDataFound;
