import React, { useContext, useEffect, useState } from "react";
import {
  View, StyleSheet, Text, TextInput,
  Image, ImageBackground, TouchableOpacity,
  ToastAndroid, Platform, Alert,
  ScrollView, KeyboardAvoidingView,

} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from "react-native-linear-gradient";
import { Button } from "react-native-elements";
import Spinner from 'react-native-loading-spinner-overlay';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import Checkbox from 'expo-checkbox';
import { NavigationEvents } from 'react-navigation'


import { COLORS, BTN_STYLE, INPUT, TEXT } from "../helpers/constants";
import { Context as DataContext } from '../context/dataContext';



const PaymentMethod = ({ navigation }) => {
  const { state, updateCard, getCard, clearErrors } = useContext(DataContext);
  const [cardNumber, setCardNumber] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [cvv, setCvv] = useState('');
  const [isChecked, setChecked] = useState(false);
  const [creditSelect, setCreditSelect] = useState(true);
  const [cashSelect, setCashSelect] = useState(false);


  useEffect(() => {
    getCard();
    clearErrors();
  }, []);
  console.log("PaymentMethodLoad ", state.cart_item);

  const showMessage = () => {
    const clearData = setTimeout(() => {
      clearErrors();

    }, 3000);
    return <Text style={{
      padding: 16,
      backgroundColor: COLORS.primary,
      color: 'white',
      marginHorizontal: 16,
      borderRadius: 12,
      marginTop: 10,
    }}>{state.errorMessage}</Text>
  };

  return (


    <SafeAreaView>
      <ScrollView
        // contentContainerStyle={{ marginTop: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <NavigationEvents
          onWillFocus={() => { clearErrors() }}
        />
        <View contentContainerStyle={styles.container}>
          <View style={{ width: "100%", alignItems: 'center', paddingTop: 15 }}>
            <View style={{
              width: "90%",
              height: 50,
              flexDirection: "row",
              alignItems: 'center',
            }}>
              <TouchableOpacity style={{ width: "10%" }} onPress={() => { navigation.goBack() }}>
                <Ionicons name="ios-close" style={{
                  fontSize: 30,
                  alignSelf: 'center',
                  color: "#748a9d",
                  opacity: 0.5,
                }} />
              </TouchableOpacity>
              <View style={{
                width: "90%",
                // borderColor: "#000",
                // borderWidth: 1,
                paddingLeft: '10%'
                // alignItems: "center",
                // justifyContent: 'flex-start'
              }}>
                <Text style={{ fontSize: 20, fontWeight: "bold" }}>Select Payment Method</Text>
              </View>
            </View>
          </View>
          {
            state.errorMessage ?
              showMessage() :
              null
          }

          <Spinner visible={state.isLoading} />

          <View style={styles.creditContainer}>

            <View style={{ width: "90%", marginTop: 20 }}>
              <View style={[styles.cardNumber, { marginTop: 10 }]}>
                <TextInput label="Email"
                  style={styles.cardNumberInput}
                  keyboardType='number-pad'
                  autoCorrect={false}
                  placeholder="Credit Card Number"
                  value={cardNumber}

                  onChangeText={(val) => {
                    console.log("length ", val.length)
                    if (val.length <= 19) {
                      if (val.length === 4) {
                        setCardNumber(val + " ");
                      } else if (val.length === 9) {
                        setCardNumber(val + " ");
                      } else if (val.length === 14) {
                        setCardNumber(val + " ");
                      } else {
                        setCardNumber(val);
                      }
                    }
                  }}
                />
                <Ionicons name="ios-card" style={styles.cardNumberIcon} />
              </View>
              <View style={{ marginLeft: 15, paddingTop: 5 }}>
                <Text style={{ color: '#c3c0c5', fontWeight: "700" }}>Visa, MasterCard or American Express</Text>
              </View>

              <View style={styles.cardDetail}>
                <View style={[styles.cardNumber, { width: "49%" }]}>
                  <TextInput label="Email"
                    style={styles.cardNumberInput}
                    keyboardType='number-pad'
                    autoCorrect={false}
                    placeholder="Month"
                    value={month}
                    onChangeText={(val) => {
                      if (val.length <= 2 && val <= 12) {
                        setMonth(val)
                      }
                    }}
                  />
                  <FontAwesome
                    name="caret-down"
                    style={styles.cardNumberIcon} />
                </View>
                <View style={[styles.cardNumber, { width: "49%" }]}>

                  <TextInput label="Year"
                    style={styles.cardNumberInput}
                    autoCorrect={false}
                    keyboardType='number-pad'
                    placeholder="Year"
                    value={year}
                    onChangeText={(val) => {
                      if (val.length < 3) {
                        setYear(val)
                      }
                    }}
                  />
                  <FontAwesome
                    name="caret-down"
                    style={styles.cardNumberIcon} />
                </View>
              </View>

              <View style={[styles.cardNumber, {
                marginTop: 20,
                width: "60%"
              }]}>
                <TextInput label="Email"
                  style={styles.cardNumberInput}
                  keyboardType='number-pad'
                  autoCorrect={false}
                  placeholder="CVV (3-4 digit number)"
                  value={cvv}
                  onChangeText={(val) => {
                    if (val.length <= 3) {
                      setCvv(val)
                    }
                  }}
                />
              </View>
              {/* 
              <View style={styles.saveCredit}>
                <Checkbox
                  style={{}}
                  value={isChecked}
                  onValueChange={setChecked}
                  color={isChecked ? '#F07D00' : undefined}
                />
                <Text style={{ fontWeight: "600" }}>Save credit card for future use</Text>
              </View> */}

            </View>

            <View style={{ width: "90%", marginTop: 32, marginBottom: 50 }}>
              <Button
                ViewComponent={require('react-native-linear-gradient').default}
                // ViewComponent={LinearGradient} // Don't forget this!
                linearGradientProps={{
                  colors: [COLORS.primary, COLORS.secondary],
                  start: { x: 0.7, y: 1 },
                  end: { x: 0, y: 1 },
                }}
                buttonStyle={BTN_STYLE}
                titleStyle={{ fontSize: 18, fontWeight: 'bold' }}
                type="solid"
                title="SAVE & SELECT PAYMENT"
                onPress={() => {
                  let expiry = month + "/" + year;
                  console.log("expiry ", expiry);
                  const card = {
                    cvc: cvv,
                    expiry: expiry,
                    number: cardNumber
                  }
                  console.log("card ", card)
                  updateCard({ card });
                  if (state.cart_item !== 0) {
                    navigation.navigate('Cart')
                  } else {
                    navigation.navigate('Home1')
                  }

                  // console.log("ki:" + form.values);
                }}
              ></Button>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>

  );

}

PaymentMethod.navigationOptions = () => {
  return {
    headerShown: false
  }
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    // paddingTop: 16,
    backgroundColor: "#ffffff",
    alignItems: 'center'
  },
  headerContainer: {
    width: "100%",
    height: 50,
    flexDirection: "row",
    borderBottomColor: "#ccc",
    borderBottomWidth: 0.4,
    alignItems: 'center',
  },
  headerBtn: {
    width: '50%',
    height: "100%",
    alignItems: "center",
    justifyContent: "center"
  },
  headerTitle: {
    fontWeight: "bold",
    fontSize: 1
  },
  creditContainer: {
    width: "100%",
    alignItems: 'center'
  },
  useNewCard: {
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20
  },
  useNewCardTitle: {
    color: "#6f707c",
    fontSize: 16
  },
  cancel: {
    color: "#1023f3",
    fontWeight: "bold",
    fontSize: 16
  },
  cardNumber: {
    backgroundColor: '#F0F4F8',
    height: 60,
    borderRadius: 5,
    paddingLeft: 15,
    flexDirection: 'row',
  },
  cardNumberInput: {
    flex: 1,
    fontSize: 16,
    color: '#748a9d',
    fontWeight: "bold"
  },
  cardNumberIcon: {
    fontSize: 24,
    alignSelf: 'center',
    marginHorizontal: 16,
    color: "gray",
    opacity: 0.5,
  },
  cardDetail: {
    flexDirection: 'row',
    width: "100%",
    justifyContent: 'space-between',
    marginTop: 20
  },
  saveCredit: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20
  },
  save: {
    borderRadius: 28,
    paddingVertical: 15,
    marginHorizontal: 56,
    marginBottom: 16,
    marginTop: 32
  }
});

export default PaymentMethod;
