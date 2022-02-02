import createDataContext from './createDataContext';
import sizzleApi from '../api/sizzle';
import AsyncStorage from '@react-native-community/async-storage';
import { navigate } from '../navigationRef';
import messaging from '@react-native-firebase/messaging';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';
import auth from '@react-native-firebase/auth';

const authReducer = (state, action) => {
  switch (action.type) {
    case 'add_error':
      console.log("authREducerError ", action.payload)
      return { ...state, errorMessage: action.payload, isLoading: false };
    case 'socialLog':
      return { ...state, socialLoginDomain: action.payload }
    case 'add_loader':
      return { ...state, isLoading: action.payload };
    case 'signup':
      return { errorMessage: '', token: action.payload };
    case 'otp':
      return { errorMessage: '', otp: action.payload };
    case 'changepassword':
      return { errorMessage: '', change_password: action.payload };
    case 'clear_error':
      console.log("clearReducer");
      return {
        ...state, errorMessage: ''
      }
    default:
      return state;
  }
};

const getSocialLoginStatus = async (domain) => {
  try {
    console.log(domain)
    if (domain === "google") {
      await GoogleSignin.isSignedIn().then((status) => {
        console.log("status ", status)
      });
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut().then((status) => {
        console.log("logout from google")
      });
    } else {
      //await LoginManager.logOut();
      console.log("facebook logout")
    }
  } catch (error) {
    console.log("errorIngetSocialStatus ", error)
  }

}

const socialLogin = dispatch => async (email, device_token, domain, name, password, mobile) => {
  try {
    dispatch({ type: 'add_loader', payload: true });
    console.log(device_token);
    const response = await sizzleApi.post('login/mail', { email, device_token });
    console.log("sociallogin ", response);
    if (response.data === "The selected email is invalid.") {
      // getSocialLoginStatus(domain);
      const res = await sizzleApi.post('signup', { email, password, name, mobile, device_token });
      console.log("response ", res)
      const data = res.data;
      console.log("data ", data);
      if (data.status !== '200') {
        getSocialLoginStatus(domain);
        dispatch({ type: 'add_error', payload: data.message });
      } else {
        console.log("signUp data ", data);
        dispatch({ type: 'socialLog', payload: domain });
        dispatch({ type: 'signup', payload: data.access_token });
        await AsyncStorage.setItem('token', data.access_token);
        await AsyncStorage.setItem('id', data.id.toString());
        navigate('AddressFlow', { details: data });
      }
      dispatch({ type: 'add_loader', payload: false });
      return;
    }
    const data = response.data;
    await AsyncStorage.setItem('token', data.access_token);
    await AsyncStorage.setItem('id', data.id.toString());
    dispatch({ type: 'signup', payload: data.access_token });
    dispatch({ type: 'socialLog', payload: domain });
    dispatch({ type: 'add_loader', payload: false });
    navigate('mainFlow');
  } catch (error) {
    console.log("socialLoginError ", error);
    dispatch({ type: 'add_loader', payload: false });
    dispatch({ type: 'add_error', payload: "Something went wrong." });
  }
}


const signup = dispatch => async ({ name, mobile, email, password, domain, device_token }) => {
  dispatch({ type: 'add_loader', payload: true });
  console.log("name1 ", name);
  console.log("email1 ", email);
  console.log("password1 ", password);
  console.log("domain ", domain);
  try {
    const response = await sizzleApi.post('signup', { email, password, name, mobile, device_token });
    console.log("response ", response)
    const data = response.data;
    console.log("data ", data);
    if (data.status !== '200') {
      getSocialLoginStatus(domain);
      dispatch({ type: 'add_error', payload: data.message });
    } else {
      console.log("signUp data ", data);
      dispatch({ type: 'socialLog', payload: domain });
      dispatch({ type: 'signup', payload: data.access_token });
      await AsyncStorage.setItem('token', data.access_token);
      await AsyncStorage.setItem('id', data.id.toString());
      navigate('AddressFlow', { details: data });
    }

  } catch (err) {
    console.log("Signup Error ", err)
    dispatch({ type: 'add_error', payload: "Something went wrong." });
    dispatch({ type: 'add_loader', payload: false });
  }
}




const signin = dispatch => async ({ email, password, device_token }) => {

  console.log("signIN ", email, " |", password);
  dispatch({ type: 'add_loader', payload: true });
  try {
    console.log("device ", device_token)
    const response = await sizzleApi.post('login', { email, password, device_token });
    console.log("response ", response)
    const data = response.data;
    console.log("signIN data ", data);
    if (data.status != '200') {
      console.log('errorinsign', data.message)
      dispatch({ type: 'add_error', payload: data.message });
    } else {
      console.log("login succes ", data);
      console.log("signIN ", data.lat, " |", data.long);
      await AsyncStorage.setItem('token', data.access_token);
      await AsyncStorage.setItem('id', data.id.toString());
      if (data.lat !== null) {
        await AsyncStorage.setItem('lat', data.lat.toString());
        await AsyncStorage.setItem('long', data.long.toString());
      }

      dispatch({ type: 'signup', payload: data.access_token });
      navigate('mainFlow');
    }
  } catch (err) {
    console.log(("SignIn Error ", err))
    dispatch({ type: 'add_error', payload: "Something went wrong." });

  }
}

const sendOTP = dispatch => async ({ email, otp }) => {
  console.log("signIN ", email, " |", otp);
  dispatch({ type: 'add_loader', payload: true });
  try {
    const response = await sizzleApi.post('password', { email, otp });
    const data = response.data;
    console.log("otp data ", data);
    if (data.status != 'S') {
      dispatch({ type: 'add_error', payload: data.message });
    } else {
      console.log(data);

      dispatch({ type: 'otp', payload: data.data });

    }
  } catch (err) {
    console.log(("SignIn Error ", err))
    dispatch({ type: 'add_error', payload: "Something went wrong." });

  }
}


const changePassword = dispatch => async (email, passwrod) => {
  console.log("signIN ", email, " |", passwrod);
  dispatch({ type: 'add_loader', payload: true });
  try {
    const response = await sizzleApi.post('reset/password', { email, passwrod });
    const data = response;
    console.log("changepassword data ", data);
    if (data.status !== 200) {
      dispatch({ type: 'add_error', payload: "Something went wrong!" });
    } else {
      console.log(data);

      dispatch({ type: 'changepassword', payload: data });
      dispatch({ type: 'otp', payload: null });
      navigate('Signup')
    }
  } catch (err) {
    console.log(("SignIn Error ", err))
    dispatch({ type: 'add_error', payload: "Something went wrong." });

  }
}

const clearErrors = dispatch => () => {
  console.log("clear error");
  dispatch({ type: 'clear_error' });
}

const clearOtp = dispatch => () => {

  dispatch({ type: 'otp', payload: null });

}

const localSingnIn = dispatch => async () => {
  // await AsyncStorage.removeItem('token');
  // await AsyncStorage.removeItem('id');
  // await AsyncStorage.removeItem('coords');


  const token = await AsyncStorage.getItem('token');


  if (token) {
    console.log("token")
    messaging().getInitialNotification().then((response) => {
      if (response !== null) {
        console.log("get INitial notification", response);
        if (response.data.is_completed === "true") {
          console.log("Reciept screen for notifciaton")
          navigate('Reciepts', {
            id: response.data.order_id,
          })
        } else {
          console.log("Delivery screen for notifciaton")
          navigate('Delivery', {
            id: response.data.order_id,
          })
        }
      }
    });

    dispatch({ type: 'signup', payload: token });
    navigate('mainFlow');

  } else {
    navigate('Signup');
  }
}

export const { Provider, Context } = createDataContext(
  authReducer,
  {
    signin,
    signup,
    clearErrors,
    localSingnIn,
    sendOTP,
    changePassword,
    clearOtp,
    socialLogin
  },
  { token: null, errorMessage: '', isLoading: false, otp: null, change_password: null }
);
