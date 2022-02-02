import React, { useState, useContext, useEffect } from "react";
import { View, StyleSheet, Text, TextInput, Image, ImageBackground, TouchableOpacity, ToastAndroid, Platform, Alert, KeyboardAvoidingView } from "react-native";
import { Button, Icon } from "react-native-elements";
import Spacer from "../components/Spacer";
import { Feather } from '@expo/vector-icons';
import { ScrollView } from "react-native-gesture-handler";
import Spinner from 'react-native-loading-spinner-overlay';
import { NavigationEvents } from 'react-navigation';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';
import auth from '@react-native-firebase/auth';
import messaging from '@react-native-firebase/messaging';
import * as Location from 'expo-location';

import { COLORS, BTN_STYLE, INPUT } from "../helpers/constants";
import { Context as AuthContext } from '../context/authContext';

const RegisterScreen = ({ navigation }) => {
  const { state, signup, clearErrors } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [device_token, setDevice_token] = useState('');

  useEffect(() => {
    getNotificationToken().then((token) => {
      setDevice_token(token.toString());
    }).catch((err) => {
      console.log('error', err)
    })
  }, [])





  const getNotificationToken = async () => {
    let fcmToken = "";
    const status = await messaging().hasPermission();
    if (status) {
      fcmToken = await messaging().getToken();
      console.log("fcmTokenREgis ", fcmToken);
    } else {
      const request = messaging().requestPermission();
    }
    return fcmToken;
  }

  const onFacebookButtonPress = async () => {
    try {

      // Attempt login with permissions
      const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);

      if (result.isCancelled) {
        throw 'User cancelled the login process';
      }

      // Once signed in, get the users AccesToken
      const data = await AccessToken.getCurrentAccessToken();

      if (!data) {
        throw 'Something went wrong obtaining access token';
      }

      // Create a Firebase credential with the AccessToken
      const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);

      // Sign-in the user with the credential
      await auth().signInWithCredential(facebookCredential).then((data) => {
        const { email, id, name } = data.additionalUserInfo.profile;
        let mobile = "0000";
        let password = id;
        let domain = "facebook";
        signup({ email, password, name, mobile, domain, device_token });
      });

    } catch (error) {
      console.log("errorinfacebook ", error)
    }

  }

  const onGoogleButtonPress = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      // Get the users ID token
      const { idToken } = await GoogleSignin.signIn();

      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      // Sign-in the user with the credential
      await auth().signInWithCredential(googleCredential).then((userInfo) => {
        const { email, exp, name } = userInfo.additionalUserInfo.profile;
        let mobile = "0000";
        let password = exp;
        let domain = "google";
        signup({ email, password, name, mobile, domain, device_token });
      });

    } catch (error) {
      console.log(error)
    }

  }

  const notifyMessage = msg => {
    if (Platform.OS === 'android') {
      ToastAndroid.showWithGravity(msg, ToastAndroid.LONG, ToastAndroid.CENTER)
    } else {
      Alert.alert(msg);
    }
  };

  const showMessage = () => {
    const clearData = setTimeout(() => {
      clearErrors();

    }, 3000);
    return <Text style={{
      padding: 16,
      backgroundColor: COLORS.primary,
      color: 'white',
      marginHorizontal: 16,
      borderRadius: 12
    }}>{state.errorMessage}</Text>
  };


  return <KeyboardAvoidingView behavior="padding"
    keyboardVerticalOffset={5} style={style.container}>
    <NavigationEvents
      onWillFocus={clearErrors}
    />

    <Spinner visible={state.isLoading} />

    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
      <ImageBackground source={require('../../assets/login.png')} style={{
        resizeMode: "contain", marginVertical: 20
      }} >
        <Spacer marg={32} style={{ flex: 1, flexDirection: 'row', marginTop: 20, }}>
          <Image style={{ alignSelf: 'center', resizeMode: 'contain' }} source={require('../../assets/logo.png')} />
        </Spacer>
        {state.errorMessage ? showMessage() : null}
        <Spacer marg={8}>
          <View style={INPUT.backgroundStyle}>
            <Feather name="user" style={INPUT.iconStyle} />
            <TextInput label="Name"
              style={INPUT.inputStyle}
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="Name"
              value={name}
              onChangeText={(value) => {
                if (/^[a-zA-Z ]+$/.test(value) || value === "") {

                  setName(value);
                }
              }}

            />

          </View>
        </Spacer>
        <Spacer marg={8}>
          <View style={INPUT.backgroundStyle}>
            <Feather name="phone" style={INPUT.iconStyle} />
            <TextInput label="Mobile"
              style={INPUT.inputStyle}
              keyboardType='number-pad'
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="Mobile"
              value={mobile}
              onChangeText={(value) => {
                if (value.length < 11) {
                  setMobile(value);
                }
              }}

            />

          </View>
        </Spacer>
        <Spacer marg={8}>
          <View style={INPUT.backgroundStyle}>
            <Feather name="mail" style={INPUT.iconStyle} />
            <TextInput label="Email"
              keyboardType='email-address'
              style={INPUT.inputStyle}
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}

            />

          </View>
        </Spacer>
        <Spacer marg={32}>

          <View style={INPUT.backgroundStyle}>
            <Feather name="lock" style={INPUT.iconStyle} />

            <TextInput
              secureTextEntry
              style={INPUT.inputStyle}
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
            />
          </View>
        </Spacer>
        <Spacer marg={16} style={{ flex: 1, flexDirection: 'row', }}>
          <Text style={{ alignSelf: 'center', color: 'red', fontSize: 16 }}>Register with</Text>
        </Spacer>

        <Spacer marg={32} >
          {/* <Spinner visible={loading} />
           */}
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', marginBottom: 16 }}>
            <TouchableOpacity onPress={() => {
              onFacebookButtonPress();
            }}>
              <Image
                style={{ marginHorizontal: 8 }}
                source={require('../../assets/fb.png')}
                width={35}
                height={35}
              />
            </TouchableOpacity>
            {Platform.OS === 'ios' && <TouchableOpacity onPress={() => { }}>
              <Image
                style={{ marginHorizontal: 8 }}
                source={require('../../assets/ios.png')}
                width={35}
                height={35}
              />
            </TouchableOpacity>}
            <TouchableOpacity onPress={() => {
              onGoogleButtonPress()
            }}>
              <Image
                style={{ marginHorizontal: 8 }}
                source={require('../../assets/gmail.png')}
                width={35}
                height={35}
              />
            </TouchableOpacity>
          </View>
        </Spacer>





        <Spacer marg={16}>
          <Button
            icon={
              <Icon
                type="feather"
                name="arrow-right"
                color="white"
                size={18}
              />
            }
            ViewComponent={require('react-native-linear-gradient').default}
            // ViewComponent={LinearGradient} // Don't forget this!
            linearGradientProps={{
              colors: [COLORS.primary, COLORS.secondary],
              start: { x: 0.7, y: 1 },
              end: { x: 0, y: 1 },
            }}
            buttonStyle={BTN_STYLE}
            type="solid"
            title="Sign Up"
            onPress={() => {
              if (name.length == 0 || name.length < 3) {
                notifyMessage("Length of name must be minimum of 3 cherecters.")
              }
              else if (mobile.length < 10) {
                notifyMessage("Mobile number must be 10 digits.")

              } else {
                console.log('device_token', device_token)
                signup({ name, mobile, email, password, device_token })
              }
            }}
          ></Button>
        </Spacer>

        <Spacer style={{ flex: 1, flexDirection: 'row', }}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Signup')
            }}
          >
            <Text style={{ alignSelf: 'center', color: '#748a9d', fontWeight: "bold", fontSize: 16 }}>Already have an account login.</Text>
          </TouchableOpacity>
        </Spacer>

      </ImageBackground>

    </ScrollView>
  </KeyboardAvoidingView>;
}

const style = StyleSheet.create({
  container: {

    flex: 1,
    justifyContent: 'center',
    // marginVertical: 20
  }
});

export default RegisterScreen;