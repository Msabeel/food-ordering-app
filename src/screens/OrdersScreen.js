import React, { useEffect, useContext, useLayoutEffect, useState } from "react";
import { View, RefreshControl, StyleSheet, Text, FlatList, ImageBackground, Dimensions, TouchableOpacity, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, DATA_LIST, TEXT } from "../helpers/constants";
import { LinearGradient } from "react-native-linear-gradient";
import { Octicons } from '@expo/vector-icons';
import { Button, Icon } from "react-native-elements";
import { Entypo } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { Context as DataContext } from '../context/dataContext';
import Spinner from 'react-native-loading-spinner-overlay';

const OrderScreen = ({ navigation }) => {
  const { state, orderList, getOrderData, clearErrors } = useContext(DataContext);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  console.log("orderScreen", state)

  const fetchOrderList = async () => {
    setLoading(true);
    try {
      const response = await orderList();
      setLoading(false);
    } catch (error) {
      console.log('errorInOrder', error);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchOrderList();

    return () => {
      fetchOrderList;
    }
  }, []);



  console.log("OrderScreenLoad ", state.isLoading)
  const renderItem = ({ item }) => {

    return (
      <TouchableOpacity
        onPress={() => {
          // let order_id = item.order_id;
          // getOrderData({ order_id });
          // console.log("itemId ", item.order_id);
          // navigation.navigate('Delivery', {
          //   id: item.order_id,
          // })
          console.log("item Completed ", item.isCompleted)

          if (item.isCompleted) {
            console.log("completed")
            navigation.navigate('Reciepts', {
              id: item.order_id,
            })
          } else {
            console.log("Devliery")
            navigation.navigate('Delivery', {
              id: item.order_id,
            })
          }
        }}
      >

        <View style={{ paddingVertical: 16, borderBottomColor: '#C0C0C0', borderBottomWidth: 1, marginHorizontal: 16 }}>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
            <Image source={{ uri: item.food_image }} style={{ width: 100, height: 100, borderRadius: 18, }} />
            <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-between', marginLeft: 16, paddingBottom: 8 }}>
              <Text style={{ fontWeight: 'bold', color: '#748A9D' }}>{item.chef_name}</Text>
              <Octicons name="primitive-dot" color={COLORS.primary} size={14}><Text style={{ color: '#9DB1C4', fontSize: 12 }}> {item.order_id}</Text></Octicons>
              <Octicons name="primitive-dot" color={COLORS.primary} size={14}><Text style={{ color: '#9DB1C4', fontSize: 12 }}> {item.date}</Text></Octicons>
              <Octicons name="primitive-dot" color={COLORS.primary} size={14} ><Text style={{ color: '#9DB1C4', fontSize: 12 }}> ${item.total}</Text></Octicons>
              <Octicons name="primitive-dot" color={COLORS.primary} size={14} ><Text style={{ color: 'green', fontSize: 12, fontWeight: 'bold' }}> Order {item.status}</Text></Octicons>

            </View>
            {!item.isRated && item.isCompleted ? <View style={{ flex: 1, justifyContent: 'center' }}>
              <Button
                ViewComponent={require('react-native-linear-gradient').default}
                // ViewComponent={LinearGradient} // Don't forget this!
                linearGradientProps={{
                  colors: [COLORS.primary, COLORS.secondary],
                  start: { x: 0.7, y: 1 },
                  end: { x: 0, y: 1 },
                }}
                titleStyle={{
                  fontSize: 12
                }}
                buttonStyle={{ paddingVertical: 4, paddingHorizontal: 16, borderRadius: 12, alignSelf: 'center', }}
                type="solid"
                title="Write Review"
                onPress={() => {
                  navigation.navigate('ReviewList', {
                    id: item.order_id,
                    name: item.chef_name
                  })
                }}
              />
            </View> : null}
          </View>
        </View>
      </TouchableOpacity>
    );
  }


  onRefresh = () => {
    setRefreshing(true);
    orderList();
    setRefreshing(false)
  }

  return (
    <SafeAreaView style={{ backgroundColor: 'white' }}>

      <Spinner visible={loading} />

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }

        showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
        <View style={style.header}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
          >
            <Feather name="arrow-left" color='#748a9d' size={24} />

          </TouchableOpacity>

          <Text style={{ fontWeight: 'bold', fontSize: 20, color: '#748a9d' }}>Order History</Text>

          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
          >
            <Entypo name="cross" size={24} color="#748a9d" />
          </TouchableOpacity>

        </View>

        <FlatList
          data={state.orders}

          renderItem={renderItem}
          keyExtractor={(item, index) => item.id}
          showsHorizontalScrollIndicator={false}
        />
      </ScrollView>
    </SafeAreaView>
  );

};

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
  item: {
    padding: 16,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end'
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: Dimensions.get('window').width * 0.4,
    borderRadius: 20,
  },
  roundButton1: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 100,
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.secondary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },


});
OrderScreen.navigationOptions = () => {
  return {
    headerShown: false,
  }
};
export default OrderScreen;
