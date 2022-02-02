import React, { useEffect, useContext, useLayoutEffect, useState } from "react";
import { View, StyleSheet, Text, TextInput, FlatList, ImageBackground, Dimensions, TouchableOpacity, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, MAP_STYLE, TEXT } from "../helpers/constants";
import { LinearGradient } from "react-native-linear-gradient";
import { Octicons } from '@expo/vector-icons';
import { Button, Icon } from "react-native-elements";
import { FontAwesome } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import Spinner from 'react-native-loading-spinner-overlay';
import { Context as DataContext } from '../context/dataContext';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { navigate } from "../navigationRef";

const DeliveryScreen = ({ navigation }) => {
  let id = navigation.state.params.id;
  const { state, getCart, getOrderData } = useContext(DataContext);
  const [loading, setLoading] = useState(false);

  const fetchOrderData = async () => {
    setLoading(true);
    try {
      const response = await getOrderData({ id });
      setLoading(false);
    } catch (error) {
      console.log('errorInDelivery', error);
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchOrderData();

    return () => {
      fetchOrderData;
    }
  }, [])
  console.log("DeliveryScreenLoad ", state.isLoading)

  let detail = state.orderDetails;

  console.log("DeliverScreen", state)
  console.log("stateOrder ", state.orderDetails)



  const stars = length => {
    let content = [];
    const floor_st = Math.floor(length);//3
    const ceil_st = Math.ceil(length);//4
    console.log("length ", length);
    console.log("floor ", floor_st);
    console.log("ceil ", ceil_st);

    const half = ceil_st - floor_st;//1
    const empty = 5 - (floor_st + half);//1

    console.log("halfStar ", half);
    console.log("emptyStart ", empty)

    if (floor_st != 0) {
      for (let i = 0; i < floor_st; i++) {

        content.push(<FontAwesome name="star" size={10} color="white" />)

      }
    }
    if (half != 0) {
      for (let i = 0; i < half; i++) {
        content.push(<FontAwesome name="star-half-full" size={10} color="white" />)

      }
    }
    if (empty != 0) {
      for (let i = 0; i < empty; i++) {
        content.push(<FontAwesome name="star-o" size={10} color="white" />)

      }
    }


    return content;
  }
  const customs = customes => {
    return customes.map((item, i) => {
      return <View style={{ ...style.items }}>
        <Text style={{ flex: 6, alignSelf: 'flex-start', color: '#748a9d', fontSize: 12 }}>+{item.name}</Text>
        <Text style={{ flex: 2, alignSelf: 'center', color: '#748a9d', fontSize: 12 }}> </Text>
        <Text style={{ flex: 2, alignSelf: 'flex-end', color: '#748a9d', fontSize: 12 }}>${item.price}</Text>
      </View>
    })
  }
  const items = () => {
    return detail.order.items.map((item, i) => {
      return <>
        <View style={style.items}>
          <Text style={{ flex: 6, alignSelf: 'flex-start', fontWeight: 'bold', color: '#748a9d', fontSize: 12 }}>{item.food}</Text>
          <Text style={{ flex: 2, alignSelf: 'center', color: '#748a9d', fontSize: 12 }}>{item.qty}</Text>
          <Text style={{ flex: 2, alignSelf: 'flex-end', color: 'red', fontSize: 14 }}>${item.sub_total}</Text>

        </View>
        {customs(item.customizations)}
      </>
    });
  }

  const drinks = () => {
    return detail.order.drinks.map((item, i) => {
      return <View style={{ ...style.items, paddingLeft: 8, paddingTop: 8 }}>
        <Text style={{ flex: 6, alignSelf: 'flex-start', color: '#748a9d', fontSize: 12, fontWeight: "bold" }}>{item.drink}</Text>
        <Text style={{ flex: 2, alignSelf: 'center', color: '#748a9d', fontSize: 12 }}> {item.quantity}</Text>
        <Text style={{ flex: 2, alignSelf: 'flex-end', color: '#748a9d', fontSize: 12 }}>${item.price}</Text>

      </View>

    })
  }

  const pins = detail !== null ? [
    {
      title: state.location,
      coordinates: {
        latitude: detail.order.customer_lat !== null ? parseFloat(detail.order.customer_lat) : state.coords.latitude,
        longitude: detail.order.customer_lng !== null ? parseFloat(detail.order.customer_lng) : state.coords.longitude
      },
    },
    {
      title: detail.order.chef.address,
      coordinates: {
        latitude: parseFloat(detail.order.chef.lat),
        longitude: parseFloat(detail.order.chef.lng,)
      },
    },
  ] : null;

  const getDeliveryOrPickup = () => {
    let pickup = 'pickup your Order.'
    let delivery = 'your order will be deliver.'
    let result = detail.order.delivery_method === 'takeaway' ? pickup : delivery;
    return <Text style={{ alignSelf: "center", color: '#748a9d', fontSize: 16, fontWeight: 'bold' }}>
      {result}
    </Text>
  };

  const getEstimateDetails = () => {
    let delivery = 'Order Delivery Date';
    let pickup = 'Order Pickup Date';
    let result = detail.order.delivery_method === 'takeaway' ? pickup : delivery;

    return (
      <View style={style.add}>
        <Text style={{ fontWeight: 'bold', color: '#748a9d', fontSize: 16 }}>{result}</Text>
        <Feather name="clock" size={16} style={{ color: COLORS.primary, alignSelf: "center", marginLeft: 16, marginRight: 4 }} />
        <Text style={{ alignSelf: "center", color: '#748a9d', fontSize: 16, fontWeight: 'bold', }}>{detail.order.date}</Text>
      </View>
    );
  }


  return <SafeAreaView style={{ backgroundColor: 'white' }}>
    <Spinner visible={loading} />

    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
      <View style={style.header}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Feather name="arrow-left" color='#748a9d' size={24} />

        </TouchableOpacity>

        <Text style={{ fontWeight: 'bold', fontSize: 20, color: '#748a9d' }}>Delivery</Text>

        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Entypo name="cross" size={24} color="#748a9d" />
        </TouchableOpacity>

      </View>

      <View style={{ height: 200 }}>
        {
          detail !== null ?
            <MapView
              provider={PROVIDER_GOOGLE}
              customMapStyle={MAP_STYLE}
              style={{ flex: 1 }}
              initialRegion={{
                latitude: parseFloat(detail.order.chef.lat),
                longitude: parseFloat(detail.order.chef.lng),
                latitudeDelta: 0.2,
                longitudeDelta: 0.2
              }}
              zoomEnabled={true}
            >
              {pins.map(marker => (
                <MapView.Marker
                  coordinate={marker.coordinates}
                  title={marker.title}
                >
                  <Image source={require('../../assets/marker.png')} width={10} height={10} />
                </MapView.Marker>

              ))}

            </MapView> : null

        }

      </View>

      {
        detail !== null ? getEstimateDetails() : null
      }

      {/* <View style={style.add}>
        <Text style={{ fontWeight: 'bold', color: '#748a9d', fontSize: 16 }}>Estimated drop off time</Text>
        <Feather name="clock" size={16} style={{ color: COLORS.primary, alignSelf: "center", marginLeft: 16, marginRight: 4 }} />
        <Text style={{ alignSelf: "center", color: '#748a9d', fontSize: 16, fontWeight: 'bold', }}>3:00</Text>
      </View> */}
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Image style={{ alignSelf: 'center', resizeMode: 'contain' }} source={require('../../assets/logo.png')} />

      </View>
      {/* <View style={style.add}>
        <Feather name="truck" size={16} style={{ color: COLORS.primary, alignSelf: "center", marginLeft: 16, marginRight: 8 }} />
        {detail !== null ? getDeliveryOrPickup() : null}
      </View>
      <View style={{ marginHorizontal: 16, marginBottom: 8, }}>
        <Text style={{ color: '#748a9d', fontSize: 16, fontWeight: 'bold', }}>Order details</Text>
      </View> */}
      <View style={{
        backgroundColor: '#F0F4F8',
        marginHorizontal: 16, borderRadius: 12, marginVertical: 20,
      }}>
        {
          detail !== null ?
            <View style={style.detail}>
              <View style={style.chef}>
                <Image source={{ uri: detail.order.chef.profile_pic }} style={style.pro} />
                <Text style={{ fontSize: 12, alignSelf: 'center', color: 'white', marginBottom: 4 }}>{detail.order.chef.chef_name}</Text>
                <Text style={{ fontSize: 10, alignSelf: 'center', color: 'white', marginBottom: 4 }}>{detail.order.chef.rating}</Text>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', marginBottom: 8, height: 10 }}>
                  {stars(detail.order.chef.rating)}
                </View>
              </View>
              <View style={style.orders}>
                {items()}
                {drinks()}
              </View>
            </View>
            : null
        }

        <View style={{ ...style.calculatons_item, paddingHorizontal: 16, paddingBottom: 16 }}>
          <Text style={{ color: '#748a9d', fontSize: 20 }}>Total</Text>
          <Text style={{ color: COLORS.primary, fontSize: 20 }}>
            ${detail !== null ? detail.order.total : null}
          </Text>
        </View>
      </View>

      <View style={{ padding: 16, backgroundColor: 'white', flex: 1, flexDirection: 'row', justifyContent: 'space-evenly' }}>
        <Text style={{ fontWeight: 'bold', alignSelf: 'center', color: '#748a9d', fontSize: 16 }}>Paid By </Text>
        <Image source={require('../../assets/card.png')} />
        <Text style={{ alignSelf: 'center', fontWeight: 'bold', color: '#748a9d', fontSize: 16 }}>**** **** **** {detail !== null ? detail.order.card : null} </Text>
      </View>
      <Button
        ViewComponent={require('react-native-linear-gradient').default}
        // ViewComponent={LinearGradient} // Don't forget this!
        linearGradientProps={{
          colors: [COLORS.primary, COLORS.secondary],
          start: { x: 0.7, y: 1 },
          end: { x: 0, y: 1 },
        }}
        buttonStyle={{ borderRadius: 28, paddingVertical: 15, marginHorizontal: 48, marginBottom: 16 }}
        type="solid"
        title="Help"
        onPress={() => {
          navigate('Help')
        }}
      ></Button>
    </ScrollView>

  </SafeAreaView>

}

const style = StyleSheet.create({
  header: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#F0F4F8',
    shadowOpacity: 0.9,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    elevation: 10

  },
  add: {
    flex: 1,
    flexDirection: "row",
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16
  },
  time: {
    flex: 1,
    flexDirection: "row",
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16
  },
  detail: {
    flex: 1,
    flexDirection: "row",
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,

  },

  pro: {
    width: 55,
    height: 55,
    marginVertical: 8,
    marginHorizontal: 8,
    borderRadius: 30
  },
  chef: {
    height: 140,
    width: 70,
    backgroundColor: COLORS.primary,

    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  orders: {
    flex: 1,
    flexDirection: 'column',
    marginTop: 24,
    marginLeft: 8
  },
  items: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  calculatons: {
    backgroundColor: '#F0F4F8',
    padding: 16,
    marginHorizontal: 16,
    borderRadius: 12,
    marginBottom: 16
  },
  calculatons_item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  }

});
DeliveryScreen.navigationOptions = () => {
  return {
    headerShown: false,
  }
}
export default DeliveryScreen;