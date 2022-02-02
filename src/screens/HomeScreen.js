import React, { useState, useRef, useContext, useEffect } from "react";
import {
  View, StyleSheet, Text, FlatList,
  ScrollView, Image, RefreshControl, Alert, Platform
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Spacer from "../components/Spacer";
import PromotionalBanner from "../components/PromotionalBanner";
import Categories from "../components/Categories";
import ChefBanner from "../components/ChefBanner";
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { COLORS, GOOGLE_API_KEY, BTN_STYLE, TEXT } from "../helpers/constants";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import BottomSheet from 'react-native-simple-bottom-sheet';
import { Context as DataContext } from '../context/dataContext';
import Spinner from 'react-native-loading-spinner-overlay';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import { Avatar } from "react-native-elements";
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { Dimensions } from "react-native";
import messaging from '@react-native-firebase/messaging';
import RemotePushController from './RemotePushController';
import classifyPoint from 'robust-point-in-polygon';
import { BOUNDRIES } from '../boundries';


const DATA = [
  {
    key: "01",
    value: "By Time"
  },
  {
    key: "01",
    value: "By Rating"
  }
]

Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldShowAlert: true
    }
  }
})

const HomeScreen = ({ navigation }) => {
  const panelRef = useRef(null);
  const { state, getHomeData, getCart } = useContext(DataContext);

  console.log('home>>>>', state)

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [topRated, setTopRated] = useState(true);
  const [estTime, setEstTime] = useState(false);
  const [cart, setCart] = useState(true);


  const findBoundary = () => {
    let lat = parseFloat(state.coords.latitude);
    let lng = parseFloat(state.coords.longitude);
    var checkLocation = classifyPoint(BOUNDRIES, [-79.414396, 43.768739]);
    var checkBoundary = classifyPoint(BOUNDRIES, [lng, lat]);
  };


  const getAddress = async () => {
    try {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
      }

      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.BestForNavigation
      });

      console.log('LocationInHome', location);
      let response = await getHomeData({ "coords": location.coords });
      if (response === false) {
        Alert.alert("Something went wrong!", "Please make sure your internet is connected", [
          {
            text: 'Ok',
          }
        ])
      } else {
        console.log('responseGetHome', response)
        setLoading(false);
      }

    } catch (error) {
      console.log('errorGetAddress', error);
      Alert.alert("Something went wrong!", "Please make sure your internet is connected", [
        {
          text: 'Ok',
        }
      ])
      // setLoading(false);
    }
  };



  useEffect(() => {
    findBoundary();

    const foregroundNotification = messaging().onMessage(async remoteMessage => {
      if (remoteMessage.data.is_completed === "true") {
        // Redirect to recipt screen
        Alert.alert(
          "",
          remoteMessage.notification.body,
          [
            {
              text: "cancel",
            },
            {
              text: "ok",
              onPress: () => {
                navigation.navigate('Reciepts', {
                  id: remoteMessage.data.order_id,
                })
              }
            }
          ])

      } else {
        // Redirect to delivery Screen
        Alert.alert(
          "",
          remoteMessage.notification.body,
          [
            {
              text: "cancel"
            },
            {
              text: "ok",
              onPress: () => {
                navigation.navigate('Delivery', {
                  id: remoteMessage.data.order_id,
                })
              }
            }
          ]
        )

      }
    });

    const onNotificationOpen = messaging().onNotificationOpenedApp((response) => {
      if (response.data.is_completed) {
        // Redirect to recipt screen
        navigation.navigate('Reciepts', {
          id: response.data.order_id,
        })
      } else {
        // Redirect to delivery Screen
        navigation.navigate('Delivery', {
          id: response.data.order_id,
        })
      }
    })

    return () => {
      foregroundNotification;
      onNotificationOpen;
    };
  }, []);



  useEffect(() => {
    getAddress();

  }, [])








  const renderChefBanner = ({ item }) => {
    return (
      <View style={{
        width: "100%",
        paddingVertical: 10,
        // borderWidth: 1,
        // borderColor: "#000",
        marginVertical: 5,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,
        elevation: 2,
        borderRadius: 5,
        justifyContent: "center"
      }} key={item.id + "%$%"}>
        <View style={{ flexDirection: 'row', paddingHorizontal: 10 }}>
          <View style={{ width: "10%" }}>
            <Avatar rounded source={{ uri: item.food_image }} />
          </View>
          <View style={{
            paddingLeft: 5,
            flexDirection: 'row',
            justifyContent: "space-between",
            width: "90%",
            alignItems: "center"
          }}>
            <View>
              <Text style={{ color: "#748A9D", fontWeight: "bold" }}>{item.food_name}</Text>
              <Text style={{ color: "#ccc" }}>Rating {item.chef_rating.substr(0, 3)}</Text>
            </View>
            <View>
              <Text style={{ color: "#748A9D" }}>Time {item.time}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  }

  onRefresh = () => {
    setRefreshing(true);
    getAddress();
    setRefreshing(false)
  }

  return <SafeAreaView style={{ flex: 1 }}>
    <Spinner visible={loading} />
    <RemotePushController />
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

      <View style={style.container}>
        <View style={{ ...style.row }}>
          <View style={{ flex: 2, alignItems: "center", justifyContent: "center" }}>
            <TouchableOpacity onPress={() => { navigation.navigate('Profile') }}>
              <Feather name="user" style={{ color: COLORS.primary, alignSelf: "center" }} size={16} />
            </TouchableOpacity>
          </View>
          <View style={{ flex: 6, flexDirection: 'row', justifyContent: "center", width: Dimensions.get('window').width * 0.6 }}>

            <Feather name="map-pin" style={{ color: COLORS.primary, alignSelf: "center", marginRight: 10, }} />
            <Text style={{ alignSelf: "center", color: '#748A9D' }} numberOfLines={1} onPress={() => {
              navigation.navigate('Location');
            }}>
              {state.location}
            </Text>
            <Feather name="chevron-down" style={{ alignSelf: "center", color: "black", marginLeft: 8 }} />

          </View>
          <View style={{ flex: 2, alignItems: 'center', justifyContent: "center" }}>
            <TouchableOpacity
              onPress={() => {
                // sendPushNotification();
                panelRef.current.togglePanel(); setCart(!cart);
              }
              }>
              <Image source={require('../../assets/filter.png')} style={{ width: 16, height: 16, alignSelf: "center" }} />
            </TouchableOpacity>
          </View>
        </View>
        <PromotionalBanner navigation={navigation} />
        <Categories />
        <ChefBanner navigation={navigation} />
      </View>
    </ScrollView>



    <BottomSheet
      ref={ref => { panelRef.current = ref }}
      isOpen={false}
      sliderMinHeight={0}
      onClose={() => { setCart(!cart) }}
    >

      <View style={{ marginBottom: 100 }}>
        <View
          style={{
            paddingHorizontal: 16,
            paddingBottom: 16
          }}>
          <Text style={{
            fontSize: 17,
            color: "#748a9d",
            fontWeight: "bold"
          }}>Filters</Text>
        </View>

        <View style={{
          width: "100%",
          flexDirection: "row",
          borderBottomWidth: 0.5,
          borderBottomColor: "#ccc"
        }}>
          <View style={{ width: "50%" }}>
            <TouchableOpacity
              style={{
                width: "100%",
                height: 30,
                alignItems: "center",
                justifyContent: "center",
                borderBottomWidth: topRated ? 1 : null,
                borderBottomColor: topRated ? "#F07D00" : null
              }}
              onPress={() => {
                setEstTime(false);
                setTopRated(true);

                state.chefs !== undefined && state.chefs.length !== 0 ?
                  state.chefs.sort((a, b) => {

                    let chefA = a.chef_rating,
                      chefB = b.chef_rating;
                    return chefB - chefA;
                  })
                  : null

              }}
            >
              <Text style={{
                color: topRated ? "#F07D00" : "#ccc"
              }}>Top Rated</Text>
            </TouchableOpacity>
          </View>
          <View style={{ width: "50%" }}>
            <TouchableOpacity
              style={{
                width: "100%",
                height: 30,
                alignItems: "center",
                justifyContent: "center",
                borderBottomWidth: estTime ? 1 : null,
                borderBottomColor: estTime ? "#F07D00" : null
              }}
              onPress={() => {
                setEstTime(true);
                setTopRated(false);
                console.le
                state !== undefined && state.chefs !== undefined && state.chefs.length !== 0 ?
                  state.chefs.sort((a, b) => {

                    let timeA = a.time,
                      timeB = b.time;
                    return timeA - timeB;
                  })
                  : null
              }}
            >
              <Text style={{
                color: estTime ? "#F07D00" : "#ccc"
              }}>Estimate Time</Text>
            </TouchableOpacity>
          </View>
        </View>
        {state.chefs !== undefined && state.chefs.length !== 0 ?
          < FlatList
            data={state.chefs}
            keyExtractor={(item) => item.key}
            renderItem={renderChefBanner}
            style={{ height: '100%' }}
          />
          : null}
      </View>

    </BottomSheet>

    {
      state.cart_item !== 0 && cart ?

        <View style={{ position: 'absolute', bottom: 8, left: 64, right: 64 }}>
          <TouchableOpacity style={style.btn}
            onPress={() => {
              getCart();
            }}
          >
            <LinearGradient
              // Background Linear Gradient
              colors={[COLORS.primary, COLORS.secondary]}
              style={style.background_btn}
              end={[0, 1]}
              start={[1, 0]}

            />
            <View style={{ flex: 1, flexDirection: 'row', paddingHorizontal: 24, paddingVertical: 15, borderRadius: 30, justifyContent: 'space-between' }}>
              <MaterialCommunityIcons name="cart" size={20} color="white" />
              <Text style={{ color: 'white', fontSize: 14 }}>View Cart</Text>
              <Text style={{ color: 'white', fontSize: 14, fontWeight: 'bold' }}>{state.cart_item} </Text>

            </View>
          </TouchableOpacity>
        </View>
        : null
    }

  </SafeAreaView>


}

const style = StyleSheet.create({
  container: {
    backgroundColor: 'white',

    paddingLeft: 16,
  },
  row: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between'

  },
  background_btn: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: "100%",
    borderRadius: 26
  },
  btn: {
    borderRadius: 26,
    elevation: 6
  },
});
HomeScreen.navigationOptions = () => {
  return {
    headerShown: false,
  }
};
export default HomeScreen;