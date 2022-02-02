import React, { useEffect, useCallback, useContext, useState } from "react";
import {
  View, StyleSheet, Text, TextInput, FlatList, TouchableOpacity,
  Image, ImageBackground, Dimensions
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, BTN_STYLE, INPUT } from "../helpers/constants";
import Spinner from 'react-native-loading-spinner-overlay';
import { FontAwesome, Feather, AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-community/async-storage';
import { Context as DataContext } from '../context/dataContext';
import axios from 'axios';
import { NavigationEvents } from 'react-navigation';

import classifyPoint from 'robust-point-in-polygon';
import { BOUNDRIES } from '../boundries';

const SearchScreen = ({ navigation }) => {
  const { state } = useContext(DataContext);
  const { location } = state;
  const [searchQuery, setSearchQuery] = useState('');
  const [chefData, setchefData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [check, setCheck] = useState(true);

  console.log('chefData', chefData)

  const clearDataHandler = () => {
    setSearchQuery('');
    setchefData([]);
    setCheck(true);
  };



  const fetchSearch = async () => {
    if (searchQuery === '') {
      setchefData([]);
      return;
    }
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      const req = axios.create({
        baseURL: 'http://admin.sizzlefoods.ca/public/api/',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const response = await req.post('search', { query_text: searchQuery });
      const responseData = response.data;
      if (responseData.status === 'S') {
        setchefData(responseData.chef_banners);
        if (responseData.chef_banners.length === 0) {
          alert('No data found!...');
          setCheck(false);
          // setSearchQuery('');
        } else {
          setchefData(responseData.chef_banners);
          setCheck(false);
        }
      } else {
        setchefData([]);
        // setSearchQuery('')
        setCheck(false);
        alert('No data found!...');
      }
      console.log('responseSearch', response)
      setLoading(false);
    } catch (error) {
      console.log('errorinfetch', error);
      setLoading(false);
      setchefData([]);
      setCheck(false);
      alert('Something went wrong!....');
      // setSearchQuery('')
    }
  };

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

  const findLocation = React.useMemo(() => {
    let add = "Willowdale";
    let address = add.toLowerCase();
    let customerAddress = state.location.toLowerCase();
    let findAddress = customerAddress.includes(address);
    return findAddress;
  }, [location]);

  const findBoundary = () => {    // detail
    let lat = parseFloat(state.coords.latitude);
    let lng = parseFloat(state.coords.longitude)
    var checkLocation = classifyPoint(BOUNDRIES, [lng, lat])
    console.log('checkLocation', checkLocation);
    if (checkLocation === -1) {
      return true;
    }
    return false;
  };

  const renderChefItem = ({ item }) => {
    let boundaryCheck = findBoundary();

    if (boundaryCheck) {
      return <ChefItem item={item} />
    } else {
      if (item.delivery_type === 'home') {
        return;
      } else {
        return <ChefItem item={item} />
      }
    }


  };

  const ChefItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
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

            {/* <View style={{flex: 1,}}>
          <View style={{flex:1,flexDirection:'column-reverse',}}>
            <Text style={{color:'white',alignSelf:'flex-end',padding: 16,fontSize:12}}>{item.food_name}</Text>
          </View>
        </View> */}

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
            {
              item.time === 0 ? null : <Text style={{ fontSize: 12, color: '#748A9D', marginLeft: 91, left: 80, position: 'absolute', bottom: -32 }}>
                <Feather name="clock" size={14} style={{ color: '#748A9D', alignSelf: "center", marginLeft: 16, marginRight: 16 }} /> {item.time} min
              </Text>
            }

            <Image source={{ uri: item.flag }} style={style.flag} />

          </View>
        </View>
      </TouchableOpacity>
    );
  }




  return <SafeAreaView >
    <Spinner visible={loading} />
    <NavigationEvents
      onWillFocus={clearDataHandler}
    />
    <View style={{ ...INPUT.backgroundStyle, marginTop: 24 }}>
      <TextInput
        style={[INPUT.inputStyle, { paddingLeft: 10 }]}
        autoCapitalize="none"
        autoCorrect={false}
        placeholder="Search here"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      {
        check ? <Feather name="search"
          style={{
            fontSize: 24,
            alignSelf: 'center',
            marginHorizontal: 16,
            color: COLORS.primary,
            opacity: 0.5,
          }}
          onPress={fetchSearch}
        /> : <AntDesign name="closecircleo"
          style={{
            fontSize: 24,
            alignSelf: 'center',
            marginHorizontal: 16,
            color: COLORS.primary,
            opacity: 0.5,
          }}
          onPress={clearDataHandler}
        />
      }
      {/* <AntDesign name="closecircleo" size={24} color="black" /> */}
      {/* <Feather name="search"
        style={{
          fontSize: 24,
          alignSelf: 'center',
          marginHorizontal: 16,
          color: COLORS.primary,
          opacity: 0.5,
        }}
        onPress={fetchSearch}
      /> */}
    </View>
    <View style={{ marginLeft: 16, marginTop: 20, }}>
      {
        chefData.length === 0 ? null :
          <FlatList
            data={chefData}
            keyExtractor={item => item.id + item.food_image}
            showsVerticalScrollIndicator={false}
            renderItem={renderChefItem}
            style={{ marginBottom: 140 }}
          />
      }
    </View>

  </SafeAreaView>
}

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
    marginRight: 16,
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
  }
});

export default SearchScreen;