import React, {FC, useState} from 'react';
import {Keyboard, StyleSheet, View} from 'react-native';
import {FieldInput, PrimaryButton, PrimaryText} from '../../components';
import {errorToast} from '../../core';
import {strings} from '../../i18n';
import {loginAPI} from '../../services';
import {colors, commonStyles, fonts} from '../../styles';
import {CommonNavigationProps} from '../../types/navigationTypes';

const Login: FC<CommonNavigationProps> = ({}) => {
  /******** Hooks Functions *********/

  const [formData, setFormData] = useState({
    username: '', //"devloc","quaintgull426","eachant859"
    password: '', //"devloc","wancrow697","swifthawk60"
  });

  /******** Main Functions *********/

  const handleValidation = () => {
    if (formData.username === '') {
      errorToast(strings.msgEnterUsername, '', 'bottom');
      return false;
    } else if (formData.password === '') {
      errorToast(strings.msgEnterPassword, '', 'bottom');
      return false;
    } else {
      return true;
    }
  };

  const handleSubmit = () => {
    if (handleValidation()) {
      Keyboard.dismiss();
      loginAPI(formData);
    }
  };

  return (
    <View
      style={{
        ...commonStyles.mainView,
        ...commonStyles.containerCenter,
        backgroundColor: colors.primary,
      }}>
      <View style={styles.formWrapper}>
        <PrimaryText style={styles.loginHeading}>{strings.ctLogin}</PrimaryText>
        <PrimaryText style={styles.signIntoGuide}>
          {strings.ctSignIntoYourAccount}
        </PrimaryText>

        <FieldInput
          type="email"
          inputViewStyles={styles.inputViewStyles}
          placeholder={strings.ctUsername}
          value={formData.username}
          onChangeText={username => setFormData({...formData, username})}
        />

        <FieldInput
          type="password"
          inputStyles={{width: '90%'}}
          inputViewStyles={styles.inputViewStyles}
          placeholder={strings.ctPassword}
          value={formData.password}
          onChangeText={password => setFormData({...formData, password})}
        />

        <PrimaryButton
          onPress={handleSubmit}
          title={strings.btSignIn}
          addMargin={30}
        />
      </View>

      <PrimaryText style={styles.bottomTextStyles}>
        {strings.ctYouMustHaveAccount}
      </PrimaryText>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  formWrapper: {
    paddingHorizontal: 50,
    paddingVertical: 40,
    backgroundColor: colors.white,
    borderRadius: 10,
  },
  loginHeading: {
    ...fonts.medium46,
    alignSelf: 'center',
  },
  signIntoGuide: {
    ...fonts.regular32,
    alignSelf: 'center',
    color: colors.primaryText,
    marginTop: 8,
  },
  bottomTextStyles: {
    ...fonts.italic32,
    color: colors.white,
    marginTop: 50,
  },
  inputViewStyles: {
    width: 280,
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderColor: colors.borderColor,
    marginTop: 15,
  },
});
