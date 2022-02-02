import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, Text, FlatList, ImageBackground, Dimensions, ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, DATA_LIST, TEXT } from "../helpers/constants";
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';
import { Context as DataContext } from '../context/dataContext';
import Spinner from 'react-native-loading-spinner-overlay';
import { Entypo } from '@expo/vector-icons';

const OfferChef = ({ navigation }) => {
  const id = navigation.state.params.id;
  const { state, getOffer } = useContext(DataContext);
  const [loading, setLoading] = useState(true);
  console.log('offerChef', state);

  const fetchOffer = async () => {
    setLoading(true);
    try {
      const response = await getOffer({ id });
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffer();

    return () => {
      fetchOffer
    };
  }, []);



  const stars = length => {
    let content = [];
    const floor_st = Math.floor(length);//3
    const ceil_st = Math.ceil(length);//4

    const half = ceil_st - floor_st;//1
    const empty = 5 - (floor_st + half);//1

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
  const Item = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        console.log('item chif', item.id)
        navigation.navigate('Chefs', {
          id: item.id
        })
      }}
    >
      <View style={style.item}>
        <ImageBackground source={{ uri: item.food_image }} style={{
          resizeMode: "contain",
          height: Dimensions.get('window').width * 0.4,
        }}
          imageStyle={{ borderRadius: 8 }}

        >
          <LinearGradient
            // Background Linear Gradient
            colors={['transparent', 'transparent', 'transparent', 'rgba(237,21,57,0.4)']}
            style={style.background}
            start={[0.0, 0.3]}
            end={[0.05, 0.85]}
          />

          <View style={{ flex: 1, }}>
            <View style={{ flex: 1, flexDirection: 'column-reverse', }}>
              <Text style={{ color: 'white', alignSelf: 'flex-end', padding: 16, fontSize: 12 }}>{item.food_name}</Text>

            </View>
          </View>

        </ImageBackground>
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 8, }}>
          <View style={style.chef}>
            <Image source={{ uri: item.chef_image }} style={style.pro} />
            <Text style={{ fontSize: 13, alignSelf: 'center', color: 'white', marginBottom: 4, marginTop: 4 }}>{item.chef_name}</Text>
            <Text style={{ fontSize: 8, alignSelf: 'center', color: 'white', marginBottom: 4 }}>{item.chef_rating}</Text>
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', marginBottom: 8, height: 10 }}>
              {stars(item.chef_rating)}

            </View>
          </View>

          <Text style={{ fontSize: 12, color: '#748A9D', marginLeft: 91, left: 16, position: 'absolute', bottom: -32 }}>
            <Feather name="truck" size={14} style={{ color: '#748A9D', alignSelf: "center", marginLeft: 16, marginRight: 16 }} /> ${item.delivery_charge}
          </Text>
          <Text style={{ fontSize: 12, color: '#748A9D', marginLeft: 91, left: 80, position: 'absolute', bottom: -32 }}>
            <Feather name="clock" size={14} style={{ color: '#748A9D', alignSelf: "center", marginLeft: 16, marginRight: 16 }} /> {item.time} min
                  </Text>
          <Image source={{ uri: item.flag }} style={style.flag} />

        </View>
      </View>
    </TouchableOpacity>

  );

  return <SafeAreaView style={{ backgroundColor: 'white' }}>
    <Spinner visible={loading} />
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} keyboardShouldPersistTaps="handled">
      <View style={style.header}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Feather name="arrow-left" color='#748a9d' size={24} />

        </TouchableOpacity>

        <Text style={{ fontWeight: 'bold', fontSize: 20, color: '#748a9d' }}>Offers</Text>

        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Entypo name="cross" size={24} color="#748a9d" />
        </TouchableOpacity>

      </View>
      <Text style={{ fontWeight: 'bold', color: '#748a9d', fontSize: 14, marginHorizontal: 16, marginTop: 16 }}>{state.offers.title}</Text>

      <FlatList
        data={state.offers.chef_banners}
        renderItem={Item}
        keyExtractor={(item, index) => item.id}
        showsVerticalScrollIndicator={false}
        style={{ marginTop: 8 }}
      />
    </ScrollView>
  </SafeAreaView>

};

const style = StyleSheet.create({
  pro: {
    width: 55,
    height: 55,
    marginVertical: 8,
    marginHorizontal: 8,
    borderRadius: 30
  },
  flag: {
    width: 35,
    height: 35,
    position: 'absolute',
    right: 8,
    borderRadius: 30,
    bottom: -36
  },
  item: {
    backgroundColor: '#F0F4F8',
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    paddingBottom: 48

  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: Dimensions.get('window').width * 0.4,
    borderRadius: 8,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(225,0,0,0.3)',
    borderRadius: 20,
  },
  chef: {
    height: 140,
    width: 70,
    backgroundColor: COLORS.primary,
    position: 'absolute',
    bottom: -32,
    left: 16,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
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
});
OfferChef.navigationOptions = () => {
  return {
    headerShown: false,
  }
}
export default OfferChef;
