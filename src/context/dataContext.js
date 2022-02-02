import createDataContext from './createDataContext';
import sizzleApi from '../api/sizzle';
import req from '../api/withHeader'
import AsyncStorage from '@react-native-community/async-storage';
import { navigate } from '../navigationRef'
import axios from 'axios';
import { COLORS, GOOGLE_API_KEY } from "../helpers/constants";
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Alert } from 'react-native';




const BASEURL = 'http://admin.sizzlefoods.ca/public/api/';

const dataReducer = (state, action) => {
  switch (action.type) {
    case 'add_error':
      return { ...state, errorMessage: action.payload, isLoading: false };
    case 'clear_error':
      return { ...state, errorMessage: '' };
    case 'add_loader':
      return { ...state, isLoading: action.payload, data: action.data };
    case 'loader':
      return { ...state, Load: action.payload };

    case 'orderList_loader':
      return { ...state, orderListLoader: action.payload };
    case 'total_drink_price':
      return { ...state, total_drink_price: action.payload };

    case 'fetch_chefs':
      return { ...state, chefs: action.payload }
    case 'fetch_promos':
      return { ...state, promos: action.payload }
    case 'fetch_cats':
      return { ...state, cats: action.payload }
    case 'fetch_chef_info':
      return { ...state, chef_info: action.payload }
    case 'fetch_food_info':
      return { ...state, food_info: action.payload }
    case 'customization_filter':
      return { ...state, customizatios: action.payload }
    case 'drinks_update':
      return { ...state, food_info: action.payload }
    case 'update_cart':
      return { ...state, carts: action.payload, is_cart: true, cart_id: action.payload.cart_id, cart_item: action.payload.qty }
    case 'update_cartItem':
      return { ...state, carts: action.payload }
    case 'place_order':
      return { ...state, order: action.payload, cart_item: 0, cart_id: null, is_cart: false }
    case 'place_order_status':
      return { ...state, order_status: action.payload }
    case 'order_data':
      return { ...state, orderDetails: action.payload, cart_item: 0, cart_id: null, is_cart: false }
    case 'update_cartId_cartItem':
      return { ...state, cart_item: 0, cart_id: null, carts: null }
    case 'fetch_orders':
      return { ...state, orders: action.payload }
    case 'set_location':
      return { ...state, location: action.payload }
    case 'set_coords':
      return { ...state, coords: action.payload }
    case 'fetch_card':
      return { ...state, card: action.payload }
    case 'set_cart':
      return { ...state, cart_item: action.cart_item, cart_id: action.cart_id }
    case 'set_takeaway':
      return { ...state, take_away_chefs: action.payload }
    case 'get_profile':
      return { ...state, profile: action.payload, isLoading: false }
    case 'fetch_offers':
      return { ...state, offers: action.payload, isLoading: false }
    case 'fetch_reviews':
      return { ...state, reviews: action.payload }
    case 'save_card':
      return { ...state, errorMessage: action.payload, profile: action.card, isLoading: false };
    case 'set_confirm_date':
      return { ...state, confirm_date: action.payload, isLoading: false };
    case 'total_drink':
      return { ...state, totalDrink: action.payload, isLoading: false };
    default:
      return state;
  }
};

const clearErrors = dispatch => () => {
  console.log("clear error from data");
  dispatch({ type: 'clear_error' });
}

const updateDrinkTotalPrice = dispatch => (price) => {
  console.log('updateDrinkTotalPrice', price)
  dispatch({ type: 'total_drink_price', payload: price });
}

const updateTotalDrink = dispatch => (data) => {
  console.log('updateTotalDrink', data)
  dispatch({ type: 'total_drink', payload: data });
}

const updateProfile = dispatch => async ({ email, name, mobile, address, lat, long, password }) => {
  const token = await AsyncStorage.getItem('token');
  console.log("updateLocation lat ", lat, " | ", long)

  dispatch({ type: 'add_loader', payload: true });
  const req = axios.create({
    baseURL: 'http://admin.sizzlefoods.ca/public/api/set/',
    //  baseURL: 'https://api.sizzle.sadathussain.com/public/api/set/',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  try {
    const response = await req.post('profile', {
      "email": email,
      "name": name,
      "mobile": mobile,
      "address": address,
      "lat": lat,
      "long": long,
      "password": password
    });
    const data = response.data;
    console.log("updateProfile: ", data);
    if (data.status === "200") {
      console.log("updateProfile11: ", data.data);
      dispatch({ type: 'get_profile', payload: data.data })

      if (lat !== null && lat !== undefined) {
        await AsyncStorage.setItem('lat', lat.toString());
        await AsyncStorage.setItem('long', long.toString());
      }
      // navigate('mainFlow');
      dispatch({ type: 'add_loader', payload: false });
      navigate('mainFlow');
    } else {
      dispatch({ type: 'add_error', payload: data.message });
      dispatch({ type: 'add_loader', payload: false });
    }

  } catch (error) {
    console.log("updateProfile Error: ", error)
    dispatch({ type: 'add_error', payload: "Something went wrong." });
    dispatch({ type: 'add_loader', payload: false });
  }
}

const getHomeData = dispatch => async ({ coords }) => {
  // dispatch({ type: 'add_loader', payload: true });
  const token = await AsyncStorage.getItem('token');
  let lat = await AsyncStorage.getItem('lat');
  let long = await AsyncStorage.getItem('long');
  let longitude;
  let latitude;
  let newCoords = null;
  if (lat !== null) {
    console.log('lat>>>>>>>', lat, long)
    latitude = parseFloat(lat);
    longitude = parseFloat(long);

  } else {
    console.log('currentAddress', coords.latitude, coords.longitude)
    latitude = coords.latitude;
    longitude = coords.longitude;
  }

  newCoords = {
    latitude: latitude,
    longitude: longitude
  };

  console.log("lat  ", latitude, " | ", longitude);
  console.log('newCoords', newCoords);
  // console.log("coords>>>>> ", coords)
  // console.log("token>>>>>>>>>>>>>>>>>>>>>>>>>>", token);
  const req = axios.create({
    baseURL: 'http://admin.sizzlefoods.ca/public/api/',
    //  baseURL: 'https://api.sizzle.sadathussain.com/public/api/',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  try {
    const response = await req.post('dashboard', { "lat": latitude, "long": longitude });
    // const response = await req.post('dashboard', { "lat": 37.953056, "long": -81.165556 });
    const data = response.data;
    console.log("getHomeData>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", data);

    if (data.data === null) {
      try {
        await AsyncStorage.clear();
        navigate('ResolveAuth');
      } catch (error) {
        console.log('errorinGethomDa', error)
      }
      return;
    }

    fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + latitude + ',' + longitude + '&key=' + GOOGLE_API_KEY + '&sensor=true')
      .then((response) => response.json())
      .then((responseJson) => {
        console.log('respnonseJson>>>', responseJson.results[0]);
        dispatch({ type: 'set_location', payload: responseJson.results[0].formatted_address });
        console.log('coords!!!!!', coords)
        dispatch({ type: 'set_coords', payload: newCoords });

        console.log('ADDRESS GEOCODE is BACK!! => ' + JSON.stringify(responseJson));
      });

    dispatch({ type: 'fetch_chefs', payload: data.chef_banners });
    dispatch({ type: 'fetch_promos', payload: data.promotions });
    dispatch({ type: 'fetch_cats', payload: data.chef_nationalities });
    dispatch({ type: 'set_cart', cart_item: data.cart_items_count, cart_id: data.cart_id });
    dispatch({ type: 'get_profile', payload: data.profile })
    return Promise.resolve(true);
  } catch (err) {
    console.log("getHomeError ", err)
    dispatch({ type: 'add_error', payload: "Something went wrong." });
    // dispatch({ type: 'add_loader', payload: false });
    return Promise.resolve(false);
  }

}
const updateLocation = dispatch => async ({ coords, location }) => {
  const token = await AsyncStorage.getItem('token');

  const req = axios.create({
    baseURL: 'http://admin.sizzlefoods.ca/public/api/',
    //  baseURL: 'https://api.sizzle.sadathussain.com/public/api/',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  try {
    const response = await req.post('dashboard', { "lat": coords.latitude, "long": coords.longitude });
    const data = response.data;
    console.log(data);

    dispatch({ type: 'fetch_chefs', payload: data.chef_banners });
    dispatch({ type: 'fetch_promos', payload: data.promotions });
    dispatch({ type: 'fetch_cats', payload: data.chef_nationalities });
    dispatch({ type: 'set_location', payload: location });
    dispatch({ type: 'set_coords', payload: coords });

    await AsyncStorage.setItem('lat', coords.latitude.toString());
    await AsyncStorage.setItem('long', coords.longitude.toString());

  } catch (err) {
    console.log("updateLocationError ", err)
    dispatch({ type: 'add_error', payload: "Something went wrong." });
    dispatch({ type: 'add_loader', payload: false });

  }

}

const removeCartDrink = dispatch => async ({ cart_item_id }) => {
  console.log("removeCartDrink Id ", cart_item_id)
  dispatch({ type: 'total_drink_price', payload: 0 });
  dispatch({ type: 'total_drink', payload: [] });
  // dispatch({ type: 'add_loader', payload: true });
  const token = await AsyncStorage.getItem('token');
  const request = axios.create({
    baseURL: 'http://admin.sizzlefoods.ca/public/api/',
    //  baseURL: 'https://api.sizzle.sadathussain.com/public/api/',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  try {
    const response = await request.post('cart/remove', { cart_item_id });
    console.log("removeCartDrink ", response.data);
    const data = response.data;
    if (data.status === "S") {
      if (data.cart === null) {
        navigate('Home1');
        dispatch({ type: 'update_cartId_cartItem' });
      } else {
        console.log("removeCartDrink", data.cart)
        dispatch({ type: 'update_cart', payload: data.cart });
        return Promise.resolve(data.cart);
      }

    }
  } catch (error) {
    console.log("removeCartDrinkError ", error);
    // dispatch({ type: 'add_loader', payload: false });
    return Promise.resolve(false);
  }

}

const removeCartItem = dispatch => async ({ cart_item_id }) => {
  // dispatch({ type: 'add_loader', payload: true });
  console.log("id removeCartItem ", cart_item_id);
  const token = await AsyncStorage.getItem('token');

  dispatch({ type: 'total_drink_price', payload: 0 });
  dispatch({ type: 'total_drink', payload: [] });

  const request = axios.create({
    baseURL: 'http://admin.sizzlefoods.ca/public/api/',
    //baseURL: 'https://api.sizzle.sadathussain.com/public/api/',
    headers: { 'Authorization': `Bearer ${token}` }
  });

  try {
    const response = await request.post('cart/remove', { cart_item_id });
    console.log("removeCartItem ", response.data);
    const data = await response.data;
    if (data.status === "S") {
      if (data.cart === null) {
        dispatch({ type: 'update_cartId_cartItem' });
        navigate('Home1');
      } else {
        console.log("removeCartItem.Cart ", data.cart);
        dispatch({ type: 'update_cart', payload: data.cart });
        return Promise.resolve(data.cart);
      }

    }

  } catch (error) {
    console.log("removeCartItemError ", error);
    //dispatch({ type: 'add_loader', payload: false });
    return Promise.resolve(false);
  }
};

const getOffer = dispatch => async ({ id }) => {

  const token = await AsyncStorage.getItem('token');
  //dispatch({ type: 'add_loader', payload: true });
  const req = axios.create({
    baseURL: 'http://admin.sizzlefoods.ca/public/api/',
    // baseURL: 'https://api.sizzle.sadathussain.com/public/api/',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  try {
    const response = await req.post('chef/banners', { id });
    const data = await response.data;
    //console.log(data);
    dispatch({ type: 'fetch_offers', payload: data.data });
    // dispatch({ type: 'add_loader', payload: false });
    return Promise.resolve(true);
  } catch (err) {
    console.log("getOfferError ", err)
    dispatch({ type: 'add_error', payload: "Something went wrong." });
    // dispatch({ type: 'add_loader', payload: false });
    return Promise.resolve(true);
  }
}

const getOrderData = dispatch => async ({ id }) => {
  console.log("getOrderDATa ", id);
  // dispatch({ type: 'add_loader', payload: true });

  const token = await AsyncStorage.getItem('token');
  try {


    const req = axios.create({
      baseURL: 'http://admin.sizzlefoods.ca/public/api/',
      //baseURL: 'https://api.sizzle.sadathussain.com/public/api/',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const response = await req.post('order/detail', { order_id: id });
    const data = response.data;
    console.log("getOrderData ", data);
    // console.log("order/details", data);
    dispatch({ type: 'order_data', payload: data });
    dispatch({ type: 'add_loader', payload: false, data: true });
    // return data;
    return Promise.resolve(true);
  } catch (err) {
    console.log("getOrderDataERR ", err);
    dispatch({ type: 'add_error', payload: "Something went wrong." });
    // dispatch({ type: 'add_loader', payload: false });
    return Promise.resolve(true);
  }
}

const getChefData = dispatch => async ({ id }) => {
  // dispatch({ type: 'add_loader', payload: true });

  try {
    const response = await sizzleApi.post('chef/details', { "chef_id": id });
    const data = response.data;
    console.log('getchefDate', response);
    dispatch({ type: 'fetch_chef_info', payload: data });
    // dispatch({ type: 'add_loader', payload: false, data: false });
    return Promise.resolve(data);
  } catch (err) {
    console.log('getChefDATeERror', err)
    dispatch({ type: 'add_error', payload: "Something went wrong." });
    // dispatch({ type: 'add_loader', payload: false });
    return Promise.resolve(0);
  }
}
const getFoodData = dispatch => async ({ id }) => {
  // dispatch({ type: 'add_loader', payload: true });

  try {
    const response = await sizzleApi.post('food', { id });
    const data = response.data;
    const food = data.data;

    let newcusts = data.data.sizes.filter(obj => obj.customizations.find(o => {
      if (obj.isSelected) {
        console.log('objectSelectded', obj)
        food.food_total = food.food_total + parseFloat(obj.price, 10)
        return o;
      }
    })
    );
    dispatch({ type: 'fetch_food_info', payload: food });
    dispatch({ type: 'customization_filter', payload: newcusts });
    return Promise.resolve(true);
    // dispatch({ type: 'add_loader', payload: false });
  } catch (err) {
    dispatch({ type: 'add_error', payload: "Something went wrong." });
    // dispatch({ type: 'add_loader', payload: false });
    return Promise.resolve(true);
  }
}
const updateItem = dispatch => async ({ filt }) => {
  dispatch({ type: 'drinks_update', payload: filt });
}



const getCart = dispatch => async () => {
  dispatch({ type: 'add_loader', payload: true });
  const token = await AsyncStorage.getItem('token');


  try {
    const req = axios.create({
      baseURL: 'http://admin.sizzlefoods.ca/public/api/',
      //baseURL: 'https://api.sizzle.sadathussain.com/public/api/',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const response = await req.post('cart/get');
    const data = await response.data.data;
    const chefId = data.chef.chef_id;
    console.log('getCartData>>', data.chef.chef_id, ' ', chefId)
    const responseChef = await sizzleApi.post('chef/details', { "chef_id": chefId });
    console.log('responseChef', responseChef.data);
    const chefData = responseChef.data;
    dispatch({ type: 'fetch_chef_info', payload: chefData });
    dispatch({ type: 'add_loader', payload: false });
    dispatch({ type: 'update_cart', payload: data });
    navigate('Cart');
  } catch {
    dispatch({ type: 'add_loader', payload: false });
  }

}

const updateCart = dispatch => async ({ drinks, chef_id, items, cart, coords }) => {
  const token = await AsyncStorage.getItem('token');

  try {
    const req = axios.create({
      baseURL: 'http://admin.sizzlefoods.ca/public/api/',
      // baseURL: 'https://api.sizzle.sadathussain.com/public/api/',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    let response;

    if (cart === null) {
      response = await req.post('cart/update', { drinks, chef_id, items, "lat": coords.latitude, "long": coords.longitude });
    } else {
      let cart_id = cart.cart_id;
      response = await req.post('cart/update', { cart_id, drinks, chef_id, items, "lat": coords.latitude, "long": coords.longitude });
    }
    console.log('addTocart', response.data);

    if (response.data.status == "S") {
      const data = response.data;
      dispatch({ type: 'update_cart', payload: data.data });
    }

  } catch (error) {
    console.log('errorUpdateCart', error)
  }

}

const addToCart = dispatch => async ({ drinks, chef_id, items, cart, coords }) => {

  dispatch({ type: 'add_loader', payload: true });
  const token = await AsyncStorage.getItem('token');

  const req = axios.create({
    baseURL: 'http://admin.sizzlefoods.ca/public/api/',
    // baseURL: 'https://api.sizzle.sadathussain.com/public/api/',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  let response;

  try {
    if (cart == null) {
      response = await req.post('cart/update', { drinks, chef_id, items, "lat": coords.latitude, "long": coords.longitude });
    } else {
      let cart_id = cart.cart_id;
      response = await req.post('cart/update', { cart_id, drinks, chef_id, items, "lat": coords.latitude, "long": coords.longitude });
    }

    console.log('addTocart', response.data);

    dispatch({ type: 'total_drink_price', payload: 0 });
    dispatch({ type: 'total_drink', payload: [] });

    if (response.data.status == "S") {
      const data = response.data;
      dispatch({ type: 'update_cart', payload: data.data });
      dispatch({ type: 'add_loader', payload: false });
      navigate('Cart');
    } else {
      dispatch({ type: 'add_loader', payload: false });
      Alert.alert("", response.data.message, [
        {
          text: 'OK', onPress: () => {
            navigate('Home1');
          }
        }
      ])
      console.log("addToCart failed ", response.data.message);
    }

  } catch {
    Alert.alert("", response.data.message, [
      {
        text: 'OK', onPress: () => {
          navigate('Home1');
        }
      }
    ])
    console.log('addtocartERror', response.data.message);
  }

}
const getProfile = dispatch => async () => {
  const token = await AsyncStorage.getItem('token');

  const req = axios.create({
    baseURL: 'http://admin.sizzlefoods.ca/public/api/',
    // baseURL: 'https://api.sizzle.sadathussain.com/public/api/',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  try {
    dispatch({ type: 'add_loader', payload: true });

    const response = await req.post('get/profile');
    const data = response.data;
    dispatch({ type: 'get_profile', payload: data.data })

  } catch (err) {
    dispatch({ type: 'add_loader', payload: false });

  }
}

const getChefs = dispatch => async (order) => {
  const token = await AsyncStorage.getItem('token');
  dispatch({ type: 'add_loader', payload: true });
  const req = axios.create({
    baseURL: 'http://admin.sizzlefoods.ca/public/api/',
    //baseURL: 'https://api.sizzle.sadathussain.com/public/api/',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  try {
    const response = await req.post('chef/banners', { id: 8 });
    const data = response.data;
    let chef_sorted = data.data.chef_banners;
    if (order === "TIME") {
      chef_sorted.sort((a, b) => {
        let timeA = a.time,
          timeB = b.time;
        return timeA - timeB;
      });
    } else {
      chef_sorted.sort((a, b) => {
        let chefA = a.chef_rating,
          chefB = b.chef_rating;
        return chefB - chefA;
      });
    }
    dispatch({ type: 'fetch_offers', payload: data.data });
    dispatch({ type: 'add_loader', payload: false });

  } catch (err) {
    dispatch({ type: 'add_loader', payload: false });
  }
}



const updateCard = dispatch => async ({ card }) => {
  dispatch({ type: 'add_loader', payload: true });

  const token = await AsyncStorage.getItem('token');
  const req = axios.create({
    baseURL: 'http://admin.sizzlefoods.ca/public/api/',
    // baseURL: 'https://api.sizzle.sadathussain.com/public/api/',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  response = await req.post('customer/card/add', { "cvc": card.cvc, "expiry": card.expiry, "number": card.number });

  try {
    if (response.data.status == "200") {
      dispatch({ type: 'save_card', payload: "Card Updated.", card: response.data.data });

    } else {
      dispatch({ type: 'add_error', payload: "Plz try again." });

    }

  } catch (err) {
    console.log("error")
  }
}

const help = dispatch => async ({ message }) => {
  dispatch({ type: 'add_loader', payload: true });

  const token = await AsyncStorage.getItem('token');
  const req = axios.create({
    baseURL: 'http://admin.sizzlefoods.ca/public/api/',
    // baseURL: 'https://api.sizzle.sadathussain.com/public/api/',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  try {
    let response = await req.post('help', { message });
    if (response.data.status == "S") {
      dispatch({ type: 'add_loader', payload: false });
      dispatch({ type: 'add_error', payload: "Your message has been sent to our team." });

    } else {
      dispatch({ type: 'add_loader', payload: false });
      dispatch({ type: 'add_error', payload: "Plz try again." });

    }
  } catch (error) {
    dispatch({ type: 'add_loader', payload: false });
    dispatch({ type: 'add_error', payload: "Plz try again." });

  }
}
const rate = dispatch => async ({ review, star_count, order_id }) => {
  dispatch({ type: 'add_loader', payload: true });

  const token = await AsyncStorage.getItem('token');
  const req = axios.create({
    baseURL: 'http://admin.sizzlefoods.ca/public/api/',
    // baseURL: 'https://api.sizzle.sadathussain.com/public/api/',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  try {
    let response = await req.post('order/review', { order_id, "star_count": star_count, review });
    if (response.data.status == "S") {
      dispatch({ type: 'add_loader', payload: false });
      dispatch({ type: 'add_error', payload: "Thank You for rating." });
      // navigate('Review');
      navigate('Home');
    } else {
      dispatch({ type: 'add_loader', payload: false });
      dispatch({ type: 'add_error', payload: "Plz try again." });

    }
  } catch (error) {
    dispatch({ type: 'add_loader', payload: false });
    dispatch({ type: 'add_error', payload: "Plz try again." });

  }
}

const getReviews = dispatch => async ({ id }) => {
  const token = await AsyncStorage.getItem('token');
  dispatch({ type: 'add_loader', payload: true });

  const req = axios.create({
    baseURL: 'http://admin.sizzlefoods.ca/public/api/',
    //  baseURL: 'https://api.sizzle.sadathussain.com/public/api/',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  try {
    response = await req.post('chef/reviews', { "chef_id": id });
    let data = response.data;
    if (data.status != "F") {
      dispatch({ type: 'fetch_reviews', payload: data.data });
      dispatch({ type: 'add_loader', payload: false });
    } else {
      dispatch({ type: 'add_loader', payload: false });
    }
  } catch (err) {
    dispatch({ type: 'add_loader', payload: false });
    console.log(err)
  }

}
const getCustomizatios = dispatch => async ({ newcusts }) => {
  dispatch({ type: 'customization_filter', payload: newcusts });
}

const updatePlaceOrderStatus = (dispatch) => () => {
  console.log("updatePlaceOrderStatus")
  dispatch({ type: 'place_order_status', payload: false });

  navigate('Orders');
}

const placeOrder = dispatch => async ({ instr, coords, delivery_method, address, date }) => {

  try {
    // dispatch({ type: 'loader' });  //true
    // dispatch({ type: 'loader', payload: true });
    const token = await AsyncStorage.getItem('token');
    const req = axios.create({
      baseURL: 'http://admin.sizzlefoods.ca/public/api/',
      //baseURL: 'https://api.sizzle.sadathussain.com/public/api/',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    response = await req.post('place/order', { "instructions": instr, "lat": coords.latitude, "long": coords.longitude, delivery_method, address, date });
    let data = await response.data;
    console.log('placeOrder', response)
    if (data.status !== "F") {
      dispatch({ type: 'place_order', payload: data.data });
      dispatch({ type: 'loader', payload: false });
      dispatch({ type: 'set_confirm_date', payload: null })

      return Promise.resolve('S');
    } else {
      dispatch({ type: 'place_order_status', payload: false })
      dispatch({ type: 'loader', payload: false });
      dispatch({ type: 'set_confirm_date', payload: null })
      return Promise.resolve('F');
    }
  } catch (err) {
    dispatch({ type: 'update_loader' }); //false 
    dispatch({ type: 'loader', payload: false });
    dispatch({ type: 'place_order_status', payload: false })
    dispatch({ type: 'set_confirm_date', payload: null })
    console.log('errorInPlaceOrder', err)
    return Promise.resolve(false);
  }

}

const getSocialLoginStatus = async (domain) => {
  try {

    if (domain === "google") {
      await GoogleSignin.isSignedIn().then((status) => {
      });
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut().then((status) => {
        return;
      });
    } else if (domain === "facebook") {
      return;
    } else {
      return;
    }
  } catch (error) {
    console.log("errorIngetSocialStatus ", error)
  }

}

const signout = dispatch => async (domain) => {
  getSocialLoginStatus(domain);
  try {
    await AsyncStorage.clear();
    navigate('ResolveAuth');
  } catch (error) {

  }
  // await AsyncStorage.removeItem('token');
  // await AsyncStorage.removeItem('id');
  // await AsyncStorage.removeItem('lat');
  // await AsyncStorage.removeItem('long');

}

const getCard = dispatch => async () => {
  const token = await AsyncStorage.getItem('token');
  dispatch({ type: 'add_loader', payload: true });

  const req = axios.create({
    baseURL: 'http://admin.sizzlefoods.ca/public/api/',
    // baseURL: 'https://api.sizzle.sadathussain.com/public/api/',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  try {
    response = await req.post('customer/card');
    let data = response.data;
    if (data.status != "F") {
      dispatch({ type: 'fetch_card', payload: data.data });
      dispatch({ type: 'add_loader', payload: false });

    } else {
      dispatch({ type: 'add_loader', payload: false });
    }
  } catch (err) {
    dispatch({ type: 'add_loader', payload: false });
    console.log(err)
  }

}

const takeAway = dispatch => async ({ coords }) => {
  const token = await AsyncStorage.getItem('token');
  dispatch({ type: 'add_loader', payload: true });

  const req = axios.create({
    baseURL: 'http://admin.sizzlefoods.ca/public/api/',
    //baseURL: 'https://api.sizzle.sadathussain.com/public/api/',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  try {
    response = await req.post('takeaway/chefs', { "lat": coords.latitude, "long": coords.longitude });
    let data = response.data;
    if (data.status != "F") {
      dispatch({ type: 'set_takeaway', payload: data.chef_banners });
      dispatch({ type: 'add_loader', payload: false });

    } else {
      dispatch({ type: 'add_loader', payload: false });
    }
  } catch (err) {
    dispatch({ type: 'add_loader', payload: false });
    console.log(err)
  }
}
const orderList = dispatch => async () => {
  const token = await AsyncStorage.getItem('token');
  // dispatch({ type: 'orderList_loader', payload: true });


  const req = axios.create({
    baseURL: 'http://admin.sizzlefoods.ca/public/api/',
    //baseURL: 'https://api.sizzle.sadathussain.com/public/api/',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  try {
    const response = await req.post('order/details');
    let data = await response.data;
    if (data.status != "F") {
      console.log("order list", data)
      dispatch({ type: 'fetch_orders', payload: data.data });
    }
    return Promise.resolve(true);
  } catch (err) {
    //dispatch({ type: 'orderList_loader', payload: false });
    console.log(err);
    return Promise.resolve(true);
  }
}

const setConfirmDate = dispatch => async (date, availabilityDate, showDate) => {
  console.log('setConfirmDate', date, ' ', availabilityDate, ' ', showDate);
  const data = {
    date,
    availabilityDate,
    showDate
  };
  dispatch({ type: 'set_confirm_date', payload: data })
}

export const { Provider, Context } = createDataContext(
  dataReducer,
  {
    rate, getReviews, takeAway, help, getOffer, getProfile, getHomeData, getChefData, getOrderData, getFoodData,
    getCustomizatios, updateItem, addToCart, getCart, placeOrder, orderList, updateLocation, updateCard, getCard,
    signout, updateProfile, getChefs, removeCartItem, removeCartDrink, updatePlaceOrderStatus, clearErrors, setConfirmDate,
    updateDrinkTotalPrice, updateTotalDrink, updateCart
  },

  {
    errorMessage: '', isLoading: false, data: false, chefs: [], orderDetails: null, promos: [], cats: [],
    chef_info: {}, food_info: {}, customizatios: [], carts: {}, order: {}, orders: [], is_cart: false, cart_item: 0,
    cart_id: null, location: 'my address', coords: {}, card: null, take_away_chefs: [], profile: {}, offers: {}, reviews: {},
    confirm_date: null, total_drink_price: 0, totalDrink: []
  }
);
