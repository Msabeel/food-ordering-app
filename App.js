import React, { useEffect } from 'react';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import CartScreen from './src/screens/CartScreen';
import ChefScreen from './src/screens/ChefScreen';
import DeliveryScreen from './src/screens/DeliveryScreen';
import FoodScreen from './src/screens/FoodScreen';
import HelpScreen from './src/screens/HelpScreen';
import HomeScreen from './src/screens/HomeScreen';
import OrdersScreen from './src/screens/OrdersScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import RecieptScreen from './src/screens/RecieptScreen';
import ReviewScreen from './src/screens/ReviewScreen';
import ReviewListScreen from './src/screens/ReviewListScreen';
import SearchScreen from './src/screens/SearchScreen';
import SignupScreen from './src/screens/SignupScreen';
import SplashScreen from './src/screens/SplashScreen';
import ForgotPassword from './src/screens/ForgotPassword';
import PickupScreen from "./src/screens/PickupScreen";
import ResolveAuth from "./src/screens/ResolveAuth";
import { Feather } from '@expo/vector-icons';
import { COLORS, BTN_STYLE, INPUT } from "./src/helpers/constants";
import FoodHub from "./src/screens/FoodHub";
import RegisterScreen from './src/screens/RegisterScreen';
import LocationScreen from './src/screens/Location';
import { Provider as AuthProvider } from './src/context/authContext';
import { setNavigator } from './src/navigationRef';
import { Provider as DataProvider } from './src/context/dataContext';
import { Image, TouchableOpacity, Text, View } from 'react-native';
import PaymentMethod from './src/screens/PaymentMethod';
import OfferChef from './src/screens/OfferChef';
import AddressScreen from './src/screens/AddressScreen';
import * as Location from 'expo-location';

import { setJSExceptionHandler, setNativeExceptionHandler } from 'react-native-exception-handler';
import messaging from '@react-native-firebase/messaging';
import * as Notifications from 'expo-notifications';


const handleError = (error, isFatal) => {
  console.log("gobal error", error);
  // alert(error.name);
}

setJSExceptionHandler((error, isFatal) => {
  console.log("gobal error ", error);
  handleError(error, isFatal);
}, true);

setNativeExceptionHandler((errorString) => {
  console.log("gobalNative ", errorString);
})


console.disableYellowBox = true;
const switchNavigator = createSwitchNavigator({
  ResolveAuth: ResolveAuth,
  loginFlow: createSwitchNavigator({
    // Signup: AddressScreen,
    Signup: SignupScreen,
    Password: ForgotPassword,
    Register: RegisterScreen
  }),
  AddressFlow: AddressScreen,


  mainFlow: createBottomTabNavigator({

    Home: {
      screen: createStackNavigator({
        Home1: HomeScreen,
        Chefs: ChefScreen,
        Foods: FoodScreen,
        Cart: {
          screen: CartScreen, navigationOptions: {
            headerVisible: false,
          }
        },
        Offers: {
          screen: OfferChef, navigationOptions: {
            headerVisible: false,
          }
        },
        Location: {
          screen: LocationScreen, navigationOptions: {
            headerVisible: false,
          }
        },
        Card: {
          screen: PaymentMethod, navigationOptions: {
            headerVisible: false,
          }
        },
        Delivery: {
          screen: DeliveryScreen, navigationOptions: {
            headerVisible: false,
          }
        },
        Review: {
          screen: ReviewScreen, navigationOptions: {
            headerVisible: false,
          }
        },
        ReviewList: {
          screen: ReviewListScreen, navigationOptions: {
            headerVisible: false,
          }
        },
        Profile: {
          screen: ProfileScreen, navigationOptions: {
            headerVisible: false,
          }
        },
        Help: {
          screen: HelpScreen, navigationOptions: {
            headerVisible: false,
          }
        },
      },
        {
          navigationOptions: {
            headerVisible: false,
            tabBarOnPress: ({ navigation }) => {
              let { routes } = navigation.state;
              routes.map((name) => {
                if (name.routeName === "Home1") {
                  navigation.navigate(name.routeName)
                }
              })
            }
          }
        }

      ),
      navigationOptions: {
        tabBarLabel: "Home",

        tabBarIcon: ({ tintColor }) => (
          // <Feather name="home" color={tintColor} size={20}/>  
          <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
            <Image source={require('./assets/home.png')} style={{ tintColor: tintColor, width: 25, height: 25, resizeMode: 'contain' }} />
          </View>
        )
      }
    },

    Search: {
      screen: SearchScreen,
      navigationOptions: {
        tabBarLabel: "Search",
        tabBarIcon: ({ tintColor }) => (
          <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
            <Image source={require('./assets/search.png')} style={{ tintColor: tintColor, width: 25, height: 25, resizeMode: 'contain' }} />
          </View>

        )
      }
    },

    Pickup: {
      screen: PickupScreen,
      navigationOptions: {
        tabBarLabel: "Pickup",
        tabBarIcon: ({ tintColor }) => (
          <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
            <Image source={require('./assets/order.png')} style={{ tintColor: tintColor, width: 29, height: 23, resizeMode: 'contain' }} />
          </View>
        )
      }
    },
    Orders: {
      screen: createStackNavigator({
        Orders: OrdersScreen,
        Reciepts: {
          screen: RecieptScreen, navigationOptions: {
            headerVisible: false,
          }
        },
      }),
      navigationOptions: {
        tabBarLabel: "Orders",
        tabBarIcon: ({ tintColor }) => (
          <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
            <Image source={require('./assets/pickup.png')} style={{ tintColor: tintColor, width: 29, height: 20, resizeMode: 'contain' }} />
          </View>
        )
      }
    },
    Hub: {
      screen: FoodHub,
      navigationOptions: {
        tabBarLabel: "Food Hub",
        tabBarIcon: ({ tintColor }) => (
          <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
            <Image source={require('./assets/chat.png')} style={{ tintColor: tintColor, width: 25, height: 20, resizeMode: 'contain' }} />
          </View>
        )
      }
    }

  },
    {
      initialRouteName: "Home",
      tabBarOptions: {
        activeTintColor: '#ED1539',
        inactiveTintColor: '#748a9d',
        labelStyle: {
          fontSize: 10
        },
        tabStyle: {
          borderLeftColor: '#748a9d',
          borderLeftWidth: 0.5,
          paddingTop: 5
          // marginVertical: 4
        },
      },
    }
  )
});

const Start = createAppContainer(switchNavigator);


export default () => {

  // const getAddress = () => {
  //   (async () => {
  //     let { status } = await Location.requestPermissionsAsync();
  //     if (status !== 'granted') {
  //       setErrorMsg('Permission to access location was denied');
  //     }

  //     await Location.getCurrentPositionAsync({
  //       accuracy: Location.Accuracy.BestForNavigation
  //     })
  //       .then((location) => {
  //         console.log('locationAccuracyInApp', location)
  //       });
  //   })();
  // };

  // useEffect(() => {
  //   getAddress();

  //   return () => {
  //     getAddress;
  //   }
  // }, [])

  return (

    <DataProvider>
      <AuthProvider>
        <Start
          ref={(navigator) => {
            setNavigator(navigator);
          }}
        />
      </AuthProvider>
    </DataProvider>

  )
}




