import React, { useState, useContext, useEffect } from "react";
import { View, StyleSheet, Text, TextInput, Image, ImageBackground, ToastAndroid, Platform, Alert } from "react-native";
import { Button, Icon } from "react-native-elements";
import { LinearGradient } from "react-native-linear-gradient";
import Spacer from "../components/Spacer";
import { COLORS, BTN_STYLE, INPUT } from "../helpers/constants";
import { Feather } from '@expo/vector-icons';
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import Spinner from 'react-native-loading-spinner-overlay';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';
import auth from '@react-native-firebase/auth';
import messaging from '@react-native-firebase/messaging';

import { Context as AuthContext } from '../context/authContext';
import { NavigationEvents } from 'react-navigation';

const SignupScreen = ({ navigation }) => {
  const { state, signin, clearErrors, socialLogin } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [device_token, setDevice_token] = useState('');

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: "404900215549-nkg0ti1md9299h0nkr0pnd5edvn1gqlf.apps.googleusercontent.com",
    });
  }, []);

  useEffect(() => {
    getNotificationToken().then((token) => {
      console.log("fcmtoken  ", token)
      setDevice_token(token.toString());
    }).catch((error) => {
      console.log('ERR_SignupNoFcm', error)
    })
  }, [])

  const getNotificationToken = async () => {
    try {
      let fcmToken = "";
      const status = await messaging().hasPermission();
      if (status) {
        fcmToken = await messaging().getToken();

      } else {
        const request = messaging().requestPermission();
      }
      return fcmToken;
    } catch (error) {
      console.log('ERR_getNotificationToken', error)
    }

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
      auth().signInWithCredential(facebookCredential).then((data) => {
        const { email, id, name } = data.additionalUserInfo.profile;
        let mobile = "0000";
        let password = id;
        socialLogin(email, device_token, "facebook", name, password, mobile);
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
        let password = exp;
        let mobile = "0000";
        socialLogin(email, device_token, "google", name, password, mobile);
        console.log("userinfo ", userInfo.additionalUserInfo.profile)
      });

    } catch (error) {
      console.log(error)
    }

  }


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

  const notifyMessage = msg => {
    if (Platform.OS === 'android') {
      ToastAndroid.showWithGravity(msg, ToastAndroid.LONG, ToastAndroid.CENTER)
    } else {
      Alert.alert(msg);
    }
  }

  return <View style={style.container}>
    <NavigationEvents
      onWillFocus={clearErrors}
    />
    <Spinner visible={state.isLoading} />
    <Spinner visible={loading} />
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
      <ImageBackground source={require('../../assets/login.png')} style={{
        resizeMode: "contain", marginVertical: 20
      }} >
        <Spacer marg={32} style={{ flex: 1, flexDirection: 'row', marginTop: 20, }}>
          <Image style={{ alignSelf: 'center', resizeMode: 'contain' }} source={require('../../assets/logo.png')} />
        </Spacer>
        {state.errorMessage !== '' ?
          showMessage() : null}


        <Spacer marg={8}>
          <View style={INPUT.backgroundStyle}>
            <Feather name="mail" style={INPUT.iconStyle} />
            <TextInput label="Email"
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
        <Spacer marg={48} style={{ flex: 1, flexDirection: 'row', }}>
          <TouchableOpacity onPress={() => {
            navigation.navigate("Password")
          }}>
            <Text style={{ alignSelf: 'center', color: '#748a9d', fontWeight: "bold", fontSize: 16 }}>Forgot Password ?</Text>
          </TouchableOpacity>
        </Spacer>
        {/* <Spacer marg={48} style={{ flex: 1, flexDirection: 'row', }}>
          <Text style={{ alignSelf: 'center', color: '#748a9d', fontWeight: "bold", fontSize: 16 }}>Forgot Password ?</Text>
        </Spacer> */}
        <Spacer marg={16} style={{ flex: 1, flexDirection: 'row', }}>
          <Text style={{ alignSelf: 'center', color: 'red', fontSize: 16 }}>Signin with</Text>
        </Spacer>

        <Spacer marg={32} >
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', marginBottom: 16 }}>
            <TouchableOpacity
              onPress={() => {
                // facebookLogIn()
                onFacebookButtonPress()
              }}
            >
              <Image
                style={{ marginHorizontal: 8 }}
                source={require('../../assets/fb.png')}
                width={35}
                height={35}
              />
            </TouchableOpacity>
            {Platform.OS === 'ios' && <TouchableOpacity
              onPress={() => { }}
            >
              <Image
                style={{ marginHorizontal: 8 }}
                source={require('../../assets/ios.png')}
                width={35}
                height={35}
              />
            </TouchableOpacity>}
            <TouchableOpacity
              onPress={() => {
                //alert("helo");
                onGoogleButtonPress()
                // signInWithGoogle();
              }}
            >
              <Image
                style={{ marginHorizontal: 8 }}
                source={require('../../assets/gmail.png')}
                width={35}
                height={35}
              />
            </TouchableOpacity>
          </View>
        </Spacer>






        <Spacer marg={32}>
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
            title="Sign In"
            onPress={() => {
              if (email.length == 0 || email.length < 4) {
                notifyMessage("Invalid Email .")

              } else if (password.length < 8) {
                notifyMessage("Password must be of minimum 8 digit.")

              } else {
                signin({ email, password, device_token })
              }
            }}

          ></Button>
        </Spacer>

        <Spacer style={{ flex: 1, flexDirection: 'row', }}>
          <TouchableOpacity
            onPress={() => {
              clearErrors();
              navigation.navigate('Register');
            }}
          >
            <Text style={{ alignSelf: 'center', color: '#748a9d', fontWeight: "bold", fontSize: 16 }}>Create Account</Text>
          </TouchableOpacity>
        </Spacer>

      </ImageBackground>

    </ScrollView>
  </View>;
}

const style = StyleSheet.create({
  container: {

    flex: 1,
    justifyContent: 'center',
    // marginVertical: 20
  }
});

export default SignupScreen;