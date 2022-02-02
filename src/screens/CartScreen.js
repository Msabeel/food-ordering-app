import React, { useEffect, useContext, useLayoutEffect, useState } from "react";
import { View, Modal, StyleSheet, Text, TextInput, FlatList, ImageBackground, Dimensions, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, DATA_LIST, TEXT, INPUT, BTN_STYLE, MAP_STYLE } from "../helpers/constants";
import { LinearGradient } from "react-native-linear-gradient";
import { Octicons } from '@expo/vector-icons';
import { Button, Icon } from "react-native-elements";
import { FontAwesome } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { EvilIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Context as DataContext } from '../context/dataContext';
import Spinner from 'react-native-loading-spinner-overlay';
import { mapStyle } from '../helpers/mapStyle';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import PickupOrDeliveryModal from '../components/PickupOrDeliveryModal';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import ModalDropdown from 'react-native-modal-dropdown';
import classifyPoint from 'robust-point-in-polygon';

import { BOUNDRIES } from '../boundries';
import Calender from '../components/Calender';


const CartScreen = ({ navigation }) => {
  const { state, placeOrder, removeCartItem, removeCartDrink,
    updatePlaceOrderStatus, getChefData, setConfirmDate } = useContext(DataContext);
  const { chef_info, confirm_date, total_drink_price, totalDrink } = state;
  console.log('confirm_date', confirm_date)
  const [instr, setInstr] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [addressShow, setAddressShow] = useState("");
  const [showPickOrDelivery, setShowPickOrDelivery] = useState("")
  const [finalCoords, setFinalCoords] = useState(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [date, setDate] = useState(null);
  const [showDate, setShowDate] = useState(null);
  const [deliveryMethod, setDeliveryMethod] = useState(null);
  const [availabilityDate, setAvailabilityDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [chooseColor, setChooseColor] = useState('#748a9d');
  const [toggleCalender, setToggleCalender] = useState(false);
  let actualDate = new Date();

  const profile = state.profile;
  let detail = state.carts;
  console.log('CartScreen', detail)





  useEffect(() => {
    if (confirm_date !== null) {
      setAvailabilityDate(confirm_date.availabilityDate)
      setShowDate(confirm_date.showDate);
      setDate(confirm_date.date);
      setChooseColor(COLORS.primary);
    }
  }, [confirm_date])

  const toggleCalenderHandler = () => {
    setToggleCalender(!toggleCalender);
  };

  const onConfirmDateHandler = (selectedDate) => {
    console.log('selected>>', selectedDate.getDate(), ' ', actualDate.getDate())
    if (selectedDate.getDate() === actualDate.getDate()) {


      return;
    }
    let fullDateTime = formatDateTime(selectedDate);
    let fullDate = formateDate(selectedDate);
    setAvailabilityDate(selectedDate)
    setShowDate(fullDate);
    setDate(fullDateTime);
    showDatePicker();
    //availabilityDate
    //showDate
    //date
    console.log('selectDate>>>', selectedDate, ' ', fullDate, ' ', fullDateTime);
  }

  const formatDateTime = (date) => {
    let month = '' + (date.getMonth() + 1);
    let day = '' + date.getDate();
    let year = date.getFullYear();

    let hr = '' + date.getHours();
    let min = '' + date.getMinutes();
    let sec = '' + date.getSeconds();

    let finalDate;
    let finalTime;
    let completeDate;

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    if (sec.length < 2)
      sec = '0' + sec;
    if (min.length < 2)
      min = '0' + min;
    if (hr.length < 2)
      hr = '0' + hr;

    finalTime = [hr, min, sec].join(':');
    finalDate = [year, month, day].join('-');

    completeDate = finalDate + ' ' + finalTime;
    return completeDate;
  }

  const formateDate = (date) => {
    let month = '' + (date.getMonth() + 1);
    let day = '' + date.getDate();
    let year = date.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    return [day, month, year].join('-');
  }

  const showCurrentDateTime = () => {
    let date = new Date();
    let fullDateTime = formatDateTime(date);
    let fullDate = formateDate(date);
    setAvailabilityDate(date)
    setShowDate(fullDate);
    setDate(fullDateTime);
  }

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = () => {
    //alert('eho')
    setChooseColor(COLORS.primary);
    setConfirmDate(date, availabilityDate, showDate);

    //console.log('todayDate', new Date().getDate(), ' ', date.getDate());

    // if (date.getDate() !== new Date().getDate()) {

    // }

    // let fullDateTime = formatDateTime(date);
    // let fullDate = formateDate(date);
    //setAvailabilityDate(date)
    //setChooseColor(COLORS.primary);
    // setShowDate(fullDate);
    //  setDate(fullDateTime);
    hideDatePicker();
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
  const pins = [
    {
      title: state.location,
      coordinates: {
        latitude: parseFloat(state.coords.latitude),
        longitude: parseFloat(state.coords.longitude)
      },
    },
    {
      title: detail === null ? 'address' : detail.chef.address,
      coordinates: {
        latitude: detail === null ? 43.7711708 : parseFloat(detail.chef.lat),
        longitude: detail === null ? -79.4197497 : parseFloat(detail.chef.lng)
      },
    },
  ]





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

  const getDeliveryOrPickup = (status) => {
    let add = "Willowdale";
    let address = add.toLowerCase();
    let finalWord = "Pickup From";
    let showAddress = detail.chef.address;



    let customerAddress = state.location.toLowerCase();
    let chefAddress = detail.chef.address.toLowerCase();


    let findAddress = findBoundary();

    if (findAddress) {
      finalWord = "Delivery To";
      showAddress = state.location;
    }

    if (detail.chef.delivery_method === "takeaway" && findAddress) {
      finalWord = "Pickup From";
      showAddress = detail.chef.address;
    } else if (detail.chef.delivery_method === "home" && findAddress) {
      finalWord = "Delivery To";
      showAddress = state.location;
    } else if (detail.chef.delivery_method === "both" && findAddress) {
      finalWord = "Delivery To";
      showAddress = state.location;
    }

    if (status === "Deliver") {
      return <View style={{
        flexDirection: "row",
      }}
      // onPress={() => {
      //   detail.chef.delivery_method === "both" && findAddress ?
      //     setModalVisible(!modalVisible) : null
      // }}
      >
        <Text style={{
          fontWeight: 'bold',
          color: '#748a9d',
          fontSize: 16,
        }}>{
            //finalWord
            showPickOrDelivery === "" ? finalWord : showPickOrDelivery
          } </Text>
        {detail.chef.delivery_method === "both" && findAddress ? <Feather name="chevron-down" style={{
          alignSelf: 'flex-start', marginTop: 5,
          color: COLORS.primary, marginLeft: 5
        }} /> : null}
      </View>
    } else {
      return <Text style={{ flex: 1, alignSelf: "center", color: '#748a9d', fontSize: 16, fontWeight: 'bold', }}>
        {
          //showAddress
          addressShow === "" ? showAddress : addressShow
        }
      </Text>
    }

  };

  const ShowDropdown = () => {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <ModalDropdown defaultValue="Delivery To"
          showsVerticalScrollIndicator={false}
          dropdownTextStyle={{ color: '#748a9d', fontSize: 16, fontWeight: 'bold' }}
          dropdownStyle={{ width: 120, height: 80 }}
          style={{ width: 80 }}
          textStyle={{ color: '#748a9d', fontSize: 16, fontWeight: 'bold' }}
          onSelect={(data) => {
            if (data === 0) {
              let coords = {
                latitude: detail.chef.lat,
                longitude: detail.chef.lng
              }
              setShowPickOrDelivery("Pickup From")
              setAddressShow(detail.chef.address);
              setFinalCoords(coords);
              setDeliveryMethod("takeaway");
            } else {

              setAddressShow(state.location);
              setShowPickOrDelivery("Delivery To")
              setFinalCoords(state.coords);
              setDeliveryMethod("home")
            }

          }}
          options={['Pickup From', 'Delivery To']}

        >
        </ModalDropdown>
        <View style={{}}>
          <Feather name="chevron-down" style={{ color: COLORS.primary }} />
        </View>
      </View>
    );
  }

  const findAvailabilityDate = () => {
    let todayDate = new Date();
    let bool = true;
    let days = ['SUN', "MON", "TUE", "W", "THR", "FRI", "SAT"];

    let todaydate = todayDate.getDate();
    let availabilitydate = availabilityDate.getDate();
    let today = days[availabilityDate.getDay()];

    var diff = (todayDate.getTime() - availabilityDate.getTime()) / 1000;
    diff /= (60 * 60);
    var calDiff = Math.abs(Math.round(diff))

    console.log('calDiffer', calDiff)
    if (calDiff >= 36) {

      return bool;
    } else {
      alert("Please Choose Date and Time after 36hr");
      return false;
    }

  }

  const removeCartItemHanlder = async (cart_item_id) => {
    setLoading(true);
    console.log('cartImtd', cart_item_id)
    try {
      const response = await removeCartItem({ cart_item_id });
      console.log('rremoveCartImt', response);
      if (response === false) {
        setLoading(false);
      } else {
        setLoading(false);
        console.log('removeAarry', response.items.length, ' ', response.drinks.length)
        let itemLength = response.items.length;
        let drinkLength = response.drinks.length;
        if (itemLength === 0 && drinkLength === 0) {
          navigation.navigate('Home1');
        }

      }

    } catch (error) {
      console.log('errorInRemoveCartItem', error);
      setLoading(false);
    }
  };

  const removeDrinkHandler = async (cart_item_id) => {
    setLoading(true);
    console.log('cartImtd', cart_item_id)
    try {
      const response = await removeCartDrink({ cart_item_id });

      console.log('removeDrinkResponse', response);
      if (response === false) {
        setLoading(false);
      } else {
        setLoading(false);
        console.log('removeAarry', response.items.length, ' ', response.drinks.length);
        let itemLength = response.items.length;
        let drinkLength = response.drinks.length;
        if (itemLength === 0 && drinkLength === 0) {
          navigation.navigate('Home1');
        }
      }

    } catch (error) {
      console.log('errorInRemoveDrinkItem', error);
      setLoading(false);
    }
  };


  const placeOrderHandler = async () => {
    const { chef_info } = state;
    console.log(' detail.drinks', detail.drinks)
    console.log('detail.items', detail.items)
    console.log('state', chef_info)

    const userDrink = detail.drinks;
    const userItem = detail.items;

    const chefDrink = chef_info.drinks;
    const chefItem = chef_info.items;

    const chefItemLength = chefItem.length;
    const chefDrinkLength = chefDrink.length;

    const userDrinkLength = userDrink.length;
    const userItemLength = userItem.length;

    console.log(' chefItemLength', chefItemLength);
    console.log(' userItemLength', userItemLength);

    console.log(' chefDrinkLength', chefDrinkLength);
    console.log(' userDrinkLength', userDrinkLength)

    if (userItemLength > 0) {
      if (chefItemLength > 0) {
        let flag = 0;
        userItem.map((item) => {
          chefItem.map((chef) => {
            if (chef.item_name === item.food) {
              console.log('item found', chef.item_name, item.food)
              flag = 1;
            }
          })
        });

        if (flag == 0) {
          alert('Currently food Item unavailable, Please remove it.');
          return;
        }

      } else {
        alert('Currently this food item unavailable, Please remove it.');
        return;
      }
    };

    if (userDrinkLength > 0) {
      if (chefDrinkLength > 0) {
        let flag = 0;
        userDrink.map((item) => {
          chefDrink.map((chef) => {
            if (chef.name === item.drink) {
              console.log('item found>>', chef.name, item.drink)
              flag = 1;
            }
          })
        });

        if (flag === 0) {
          alert('Currently Drink Item unavailable, Please remove it.');
          return;
        }
      } else {
        alert('Currently this Drink item unavailable, Please remove it.');
        return;
      }
    };



    try {
      if (profile.payments.id == "no") {
        setLoading(false);
        navigation.navigate('Card');
      } else {
        let coords;
        let address;
        if (finalCoords === null) {
          coords = {
            latitude: detail.chef.lat,
            longitude: detail.chef.lng
          }
          address = detail.chef.address;
        } else {
          coords = finalCoords;
          address = addressShow;
        }

        let find = findBoundary();
        let both = detail.chef.delivery_method === "both" && find ? "home" : "takeaway";

        let delivery_method = detail.chef.delivery_method === "both" ? deliveryMethod === null ? both : deliveryMethod : detail.chef.delivery_method;
        let result = findAvailabilityDate();
        if (result) {
          setLoading(true);
          const response = await placeOrder({ instr, coords, delivery_method, address, date });
          setLoading(false);
          console.log('respnsePlaceroder', response);
          if (response === false) {
            return;
          } else if (response === 'S') {
            Alert.alert("", "your order place successfully!", [
              {
                text: "Ok",
                onPress: (() => navigation.navigate('Orders'))
              }
            ]);

          } else if (response === 'F') {
            setLoading(false);
            navigation.navigate('Home1');
          };
        } else {
          return;
        }

      }
    } catch (error) {
      console.log('errorInPlaceOrder', error);
      setLoading(false);
    }
  }



  const ShowChooseDateTime = (status) => {
    let delivery = 'Choose your Delivery Date and Time';
    let pickup = 'Choose your Pickup Date and Time';
    let deliveryResult = showPickOrDelivery === "" ? delivery : showPickOrDelivery === 'Delivery To' ? delivery : pickup;
    if (status === 'pickup') {
      return <Text style={{ fontWeight: 'bold', color: '#748a9d', fontSize: 16 }}>{pickup}</Text>
    } else {
      return <Text style={{ fontWeight: 'bold', color: '#748a9d', fontSize: 16 }}>{deliveryResult}</Text>
    }
  }

  const customs = customes => {
    return customes.map((item, i) => {
      return <View style={[style.items, { width: "100%" }]}>
        <View style={{ flexDirection: "row", width: "90%" }}>
          <View style={{ width: "60%", justifyContent: 'center' }}>
            <Text style={{ color: '#748a9d', fontSize: 12 }} >+{item.name}</Text>
          </View>
          <View style={{ width: "40%", flexDirection: "row", justifyContent: 'space-around', alignItems: 'center' }}>
            <Text>  </Text>
            <Text style={{ color: '#748a9d', fontSize: 12 }}>${item.price}</Text>
          </View>
        </View>
      </View>
    })
  }

  const items = () => {
    return detail.items.map((item, i) => {
      return <>
        <View style={[style.items, { width: "100%", height: "16%" }]}>
          <View style={{ flexDirection: "row", width: "100%" }}>
            <View style={{ flexDirection: "row", width: "90%" }}>
              <View style={{ width: "60%", justifyContent: 'center' }}>
                <Text style={{ fontWeight: 'bold', color: '#748a9d', fontSize: 12 }}>{item.food}</Text>
              </View>
              <View style={{ flexDirection: "row", width: "40%", justifyContent: 'space-around', alignItems: 'center' }}>
                <Text style={{ color: '#748a9d', fontSize: 12, }}>{item.qty}</Text>
                <Text style={{ color: 'red', fontSize: 14, }}>${item.sub_total}</Text>
              </View>
            </View>
            <View style={{ width: "10%" }}>

              <TouchableOpacity onPress={async () => {
                // let cart_item_id = item.id;
                removeCartItemHanlder(item.id);
              }}
                style={{ width: "100%", height: "100%", alignSelf: 'flex-start' }}
              >
                <EvilIcons name="close" size={15} color="#748a9d" style={{ alignSelf: "flex-start" }} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {customs(item.customizations)}
      </>
    });
  }
  const drinks = () => {
    return detail.drinks.map((item, i) => {
      return <View style={[style.items, { width: '100%', paddingTop: 5 }]}>
        <View style={{ width: "100%", flexDirection: "row" }}>
          <View style={{ width: "90%", flexDirection: "row" }}>
            <View style={{ width: "60%", justifyContent: 'center' }}>
              <Text style={{ color: '#748a9d', fontSize: 12, fontWeight: 'bold' }}>{item.drink}</Text>
            </View>
            <View style={{ width: "40%", flexDirection: "row", justifyContent: 'space-around', alignItems: 'center' }}>
              <Text style={{ color: '#748a9d', fontSize: 12 }}>{item.quantity}</Text>
              <Text style={{ color: '#748a9d', fontSize: 12 }}>${item.price}</Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => {
              removeDrinkHandler(item.id);
              // removeCartDrink({ cart_item_id });
            }}
            style={{ width: "10%", justifyContent: 'center' }}>
            <EvilIcons name="close" size={15} color="#748a9d" style={{ alignSelf: "flex-start" }} />
          </TouchableOpacity>
        </View>
      </View>
    })
  }

  if (detail === null) {
    return <Spinner visible={true} />;
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

        <Text style={{ fontWeight: 'bold', fontSize: 20, color: '#748a9d' }}>Cart</Text>

        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Entypo name="cross" size={24} color="#748a9d" />
        </TouchableOpacity>

      </View>


      <View style={{ height: 200, }}>
        <MapView
          customMapStyle={MAP_STYLE}
          style={{ flex: 1 }}
          initialRegion={{
            latitude: detail === null ? 43.7711708 : parseFloat(detail.chef.lat),
            longitude: detail === null ? -79.4197497 : parseFloat(detail.chef.lng),
            latitudeDelta: 0.0100,
            longitudeDelta: 0.0100

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

        </MapView>

      </View>

      <View style={{
        flexDirection: "row", justifyContent: 'flex-start',
        paddingTop: 16, paddingBottom: 16,
        flex: 1, paddingHorizontal: 16,
      }}>
        {findBoundary() && (detail.chef.delivery_method === "both") ? ShowDropdown() : getDeliveryOrPickup("Deliver")}
        <Feather name="map-pin" size={16} style={{ color: COLORS.primary, alignSelf: 'flex-start', marginLeft: 16, marginRight: 10 }} />
        {getDeliveryOrPickup("pickup")}
        {/* <View style={{
          width: '90%', flexDirection: 'row'
        }}>
          {findLocation() && detail.chef.delivery_method === "both" ? ShowDropdown() : getDeliveryOrPickup("Deliver")}
          <View style={{ width: '70%', paddingLeft: 10 }}>
            {getDeliveryOrPickup("pickup")}
          </View>
        </View> */}
      </View>

      {/* <View style={{
        flex: 1,
        flexDirection: "row",
        justifyContent: 'flex-start',
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 16
      }} */}
      {/* // style={style.add}> */}

      {/* {showDropdown()} */}
      {/* {getDeliveryOrPickup("Deliver")} */}
      {/* <Text style={{ fontWeight: 'bold', color: '#748a9d', fontSize: 16 }}>Deliver To</Text> */}
      {/* <Feather name="map-pin" size={16} style={{ color: COLORS.primary, alignSelf: 'flex-start', marginLeft: 16, marginRight: 10 }} /> */}
      {/* {getDeliveryOrPickup("pickup")} */}
      {/* <Text style={{ flex: 1, alignSelf: "center", color: '#748a9d', fontSize: 16, fontWeight: 'bold', }}>{state.location}</Text> */}
      {/* <Feather name="chevron-down" style={{ alignSelf: 'flex-start', color: COLORS.primary, marginLeft: 8 }} /> */}
      {/* </View> */}

      <View style={{
        backgroundColor: '#F0F4F8',
        height: 80,
        borderRadius: 5,
        marginHorizontal: 16,
        flexDirection: 'row',

      }}>

        <TextInput
          style={{
            flex: 1,
            fontSize: 16,
            paddingLeft: 16,
            color: '#748a9d', fontWeight: "bold"
          }}
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="Delivery Instructions"
          multiline={true}
          value={instr}
          onChangeText={setInstr}
        />
        <Feather name="edit" style={{ paddingHorizontal: 8, paddingTop: 8, color: '#748a9d' }} size={20}>

        </Feather>
      </View>
      <View style={style.time}>
        {findBoundary() && (detail.chef.delivery_method === "both") ? ShowChooseDateTime("Both") : ShowChooseDateTime("pickup")}
        {/* <Text style={{ fontWeight: 'bold', color: '#748a9d', fontSize: 16 }}>Food Preparation Time</Text>
        <Text style={{ fontWeight: 'bold', color: '#748a9d', fontSize: 16 }}>{detail.total_prepration_time} mins</Text> */}

        <TouchableOpacity onPress={toggleCalenderHandler}
        //  onPress={showDatePicker}
        >
          <Text style={{
            alignSelf: "center",
            fontWeight: 'bold',
            color: chooseColor,
            // color: showDate === null ? '#748a9d' : COLORS.primary,
            fontSize: 16,
            paddingTop: 5
          }}>
            {
              showDate === null ? showCurrentDateTime() : showDate
            }
            <Feather name="chevron-down" size={16} style={{ alignSelf: "center", color: COLORS.primary, marginLeft: 8, marginLeft: 8 }} />
          </Text>
        </TouchableOpacity>

      </View>

      <View style={style.detail}>
        <View style={style.chef}>
          <Image source={{ uri: detail.chef.profile_pic }} style={style.pro} />
          <Text style={{ fontSize: 12, alignSelf: 'center', color: 'white', marginBottom: 4 }}>{detail.chef.chef_name}</Text>
          <Text style={{ fontSize: 10, alignSelf: 'center', color: 'white', marginBottom: 4 }}>{detail.chef.rating}</Text>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', marginBottom: 8, height: 10 }}>
            {stars(detail.chef.rating)}
          </View>
        </View>

        <View style={style.orders}>
          {items()}
          <View style={{ marginTop: 6 }}>
            {drinks()}
          </View>
        </View>

      </View>
      <View style={style.calculatons}>
        <View style={style.calculatons_item}>
          <Text style={{ fontWeight: 'bold', color: '#748a9d', fontSize: 14 }}>Sub Total</Text>
          <Text style={{ fontWeight: 'bold', color: '#748a9d', fontSize: 14 }}>${detail.sub_total}</Text>
        </View>
        <View style={style.calculatons_item}>
          <Text style={{ fontWeight: 'bold', color: '#748a9d', fontSize: 14 }}>Platform Fee</Text>
          <Text style={{ fontWeight: 'bold', color: '#748a9d', fontSize: 14 }}>${detail.platform_fees}</Text>
        </View>
        <View style={style.calculatons_item}>
          <Text style={{ fontWeight: 'bold', color: '#748a9d', fontSize: 14 }}>Delivery Fee</Text>
          <Text style={{ fontWeight: 'bold', color: '#748a9d', fontSize: 14 }}>${detail.service_fees}</Text>
        </View>
        <View style={style.calculatons_item}>
          <Text style={{ fontWeight: 'bold', color: '#748a9d', fontSize: 14 }}>Discount</Text>
          <Text style={{ fontWeight: 'bold', color: '#748a9d', fontSize: 14 }}>${detail.discount}</Text>
        </View>
        <View style={style.calculatons_item}>
          <Text style={{ fontWeight: 'bold', color: '#748a9d', fontSize: 14 }}>Tax</Text>
          <Text style={{ fontWeight: 'bold', color: '#748a9d', fontSize: 14 }}>${detail.tax_fee}</Text>
        </View>

        <View style={{ ...style.calculatons_item, paddingTop: 16 }}>
          <Text style={{ color: '#748a9d', fontSize: 20 }}>Total</Text>
          <Text style={{ color: 'red', fontSize: 20 }}>${detail.total}</Text>
        </View>
      </View>

      <View style={{ padding: 16, backgroundColor: 'white' }}>
        {profile.payments.id != "no" ?
          <Text style={{ fontWeight: 'bold', color: '#748a9d', fontSize: 16 }}>Card : {profile.payments.number}  <Feather name="credit-card" style={{ color: 'red' }} size={16}></Feather></Text>
          : null}
        <View style={{ marginTop: 16 }}>
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
            buttonStyle={{ borderRadius: 28, paddingVertical: 15, marginHorizontal: 36 }}
            type="solid"
            title="Check out"
            onPress={placeOrderHandler}
          ></Button>
        </View>
      </View>

      <PickupOrDeliveryModal
        visible={modalVisible}

        setVisible={(value) => {
          if (value === "pickup") {
            let coords = {
              latitude: detail.chef.lat,
              longitude: detail.chef.lng
            }
            setShowPickOrDelivery("Pickup From")
            setAddressShow(detail.chef.address);
            setFinalCoords(coords);
            setDeliveryMethod("takeaway");
          } else {
            setAddressShow(state.location);
            setShowPickOrDelivery("Delivery To")
            setFinalCoords(state.coords);
            setDeliveryMethod("home")
          }
          setModalVisible(!modalVisible)
        }}
      />

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="time"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />

      {
        chef_info.availability !== undefined && <Calender
          toggleCalender={toggleCalender}
          setToggleHandler={toggleCalenderHandler}
          availability={chef_info.availability}
          actualDate={actualDate}
          onConfirmDate={(selectDate) => {
            onConfirmDateHandler(selectDate);
          }}
        />
      }



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
    justifyContent: 'flex-start',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16
  },
  time: {
    flex: 1,
    // flexDirection: "column",
    // justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    alignItems: 'center'
  },
  detail: {
    flex: 1,
    flexDirection: "row",
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16
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
CartScreen.navigationOptions = () => {
  return {
    headerShown: false,
  }
}
export default CartScreen;
