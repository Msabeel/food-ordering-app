import React, { useContext, useEffect } from "react";
import { View, StyleSheet, Text, TextInput, FlatList, ImageBackground, Dimensions, TouchableOpacity, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, DATA_LIST, TEXT, INPUT, BTN_STYLE } from "../helpers/constants";
import { LinearGradient } from "react-native-linear-gradient";
import { Button, Icon } from "react-native-elements";
import { FontAwesome } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { Context as DataContext } from '../context/dataContext';
const RecieptScreen = ({ navigation }) => {

  const id = navigation.state.params.id;
  console.log("order id", id);
  const { state, getOrderData, getCart } = useContext(DataContext);
  useEffect(() => {
    getOrderData({ id });
  }, []);

  console.log("orderDetails ", state.orderDetails)
  const order = state.orderDetails


  const ratinFunc = (star) => {
    var stars = []
    if (star > 0) {
      for (var i = 0; i >= star; i++) {
        stars.push(() => {
          return (
            <Text>Star</Text>
          )
        })
      }
    }

    return stars
  }

  return <SafeAreaView style={{ backgroundColor: 'white' }}>
    {
      state.orderDetails &&

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
        <View style={style.header}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
          >
            <Feather name="arrow-left" color='#748a9d' size={24} />

          </TouchableOpacity>
          <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#748a9d' }}>Order #{order.order.order_id}</Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Help')
            }}
          >
            <Text style={{ fontWeight: 'bold', fontSize: 16, color: COLORS.primary }}>Help</Text>

          </TouchableOpacity>
        </View>
        <View style={style.add}>
          <Text style={{ alignSelf: "center", color: '#63BC6E', fontSize: 16, fontWeight: 'bold', }}>Order Completed</Text>
          <Text style={{ alignSelf: "center", color: '#748a9d', fontSize: 16, fontWeight: 'bold', }}> |  {order.order.date}</Text>

        </View>

        <View style={style.detail}>
          <View style={style.chef}>
            <Image source={{ uri: order.order.chef.profile_pic }} style={style.pro} />
            <Text style={{ fontSize: 12, alignSelf: 'center', color: 'white', marginBottom: 4 }}>{order.order.chef.chef_name}</Text>
            <Text style={{ fontSize: 10, alignSelf: 'center', color: 'white', marginBottom: 4 }}>{order.order.chef.rating}</Text>
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', marginBottom: 8, height: 10 }}>

              <FontAwesome name="star" size={10} color="white" />
              <FontAwesome name="star" size={10} color="white" />
              <FontAwesome name="star" size={10} color="white" />
              <FontAwesome name="star" size={10} color="white" />
              <FontAwesome name="star-o" size={10} color="white" />

            </View>
          </View>
          <View style={style.orders}>
            <View style={style.items}>
              <Text style={{ flex: 6, alignSelf: 'flex-start', fontWeight: 'bold', color: '#748a9d', fontSize: 12 }}>{order.order.items[0].food}</Text>
              <Text style={{ flex: 2, alignSelf: 'center', color: '#748a9d', fontSize: 12 }}>{order.order.items[0].qty}</Text>
              <Text style={{ flex: 2, alignSelf: 'flex-end', color: COLORS.primary, fontSize: 12 }}>${order.order.items[0].sub_total}</Text>

            </View>
            <View style={{ ...style.items, paddingLeft: 8 }}>
              {
                order.order.items[0].customizations && order.order.items[0].customizations.map((u, i) => {
                  return (
                    <>
                      <Text style={{ flex: 6, alignSelf: 'flex-start', color: '#748a9d', fontSize: 12 }}>+ {u.name}</Text>
                      <Text style={{ flex: 2, alignSelf: 'center', color: '#748a9d', fontSize: 12 }}> </Text>
                      <Text style={{ flex: 2, alignSelf: 'flex-end', color: '#748a9d', fontSize: 12 }}>${u.price}</Text>
                    </>
                  )
                })
              }


            </View>


            <View style={{ ...style.items, paddingLeft: 8, paddingTop: 8 }}>
              {
                order.order.drinks && order.order.drinks.map((u, i) => {
                  return (
                    <>
                      <Text style={{ flex: 6, alignSelf: 'flex-start', color: '#748a9d', fontSize: 12 }}>+ {u.drink}</Text>
                      <Text style={{ flex: 2, alignSelf: 'center', color: '#748a9d', fontSize: 12 }}> {u.quantity}</Text>
                      <Text style={{ flex: 2, alignSelf: 'flex-end', color: '#748a9d', fontSize: 12 }}>${u.price}</Text>

                    </>
                  )
                })
              }


            </View>



          </View>


        </View>
        <View style={style.calculatons}>
          <View style={style.calculatons_item}>
            <Text style={{ fontWeight: 'bold', color: '#748a9d', fontSize: 14 }}>Sub Total</Text>
            <Text style={{ fontWeight: 'bold', color: '#748a9d', fontSize: 14 }}>${order.order.sub_total}</Text>
          </View>
          <View style={style.calculatons_item}>
            <Text style={{ fontWeight: 'bold', color: '#748a9d', fontSize: 14 }}>Platform Fee</Text>
            <Text style={{ fontWeight: 'bold', color: '#748a9d', fontSize: 14 }}>${order.order.platform_fees}</Text>
          </View>
          <View style={style.calculatons_item}>
            <Text style={{ fontWeight: 'bold', color: '#748a9d', fontSize: 14 }}>Deliver Fee</Text>
            <Text style={{ fontWeight: 'bold', color: '#748a9d', fontSize: 14 }}>${order.order.service_fees}</Text>
          </View>
          <View style={style.calculatons_item}>
            <Text style={{ fontWeight: 'bold', color: '#748a9d', fontSize: 14 }}>Tax</Text>
            <Text style={{ fontWeight: 'bold', color: '#748a9d', fontSize: 14 }}>${order.order.tax_fee}</Text>
          </View>

          <View style={{ ...style.calculatons_item, paddingTop: 16 }}>
            <Text style={{ color: '#748a9d', fontSize: 20 }}>Total</Text>
            <Text style={{ color: COLORS.primary, fontSize: 20 }}>${order.order.total}</Text>
          </View>
        </View>

        <View style={{ padding: 16, backgroundColor: 'white', flex: 1, flexDirection: 'row', justifyContent: 'space-evenly' }}>
          <Text style={{ fontWeight: 'bold', alignSelf: 'center', color: '#748a9d', fontSize: 16 }}>Paid By </Text>
          {/* <Image source={require('../../assets/card.png')} /> */}
          <FontAwesome name="credit-card" size={25} />
          <Text style={{ alignSelf: 'center', fontWeight: 'bold', color: '#748a9d', fontSize: 16 }}>**** **** **** {order !== null ? order.order.card : null} </Text>

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
          title="Write a review"
          onPress={() => {
            navigation.navigate('ReviewList')
          }}
        ></Button>
      </ScrollView>
    }
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
RecieptScreen.navigationOptions = () => {
  return {
    headerShown: false,
  }
}
export default RecieptScreen;