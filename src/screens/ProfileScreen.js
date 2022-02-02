import React, { useState, useContext, useEffect } from "react";
import { View, StyleSheet, Text, TextInput, FlatList, ImageBackground, Dimensions, TouchableOpacity, Image, ScrollView, ToastAndroid, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, DATA_LIST, TEXT, INPUT, BTN_STYLE } from "../helpers/constants";
import { LinearGradient } from "react-native-linear-gradient";
import { Octicons } from '@expo/vector-icons';
import { Button, Icon } from "react-native-elements";
import { FontAwesome } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Spacer from "../components/Spacer";
import { Entypo } from '@expo/vector-icons';
import { Context as DataContext } from '../context/dataContext';
import Spinner from 'react-native-loading-spinner-overlay';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';
import auth from '@react-native-firebase/auth';


const ProfileScreen = ({ navigation }) => {
  const { state, signout, updateProfile } = useContext(DataContext);
  const profile = state.profile;
  console.log("profileScreen", profile)
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [mobile, setMobile] = useState(profile.mobile);
  const [password, setPassword] = useState('');

  const notifyMessage = msg => {
    if (Platform.OS === 'android') {
      ToastAndroid.showWithGravity(msg, ToastAndroid.LONG, ToastAndroid.CENTER)
    } else {
      Alert.alert(msg);
    }
  }
  return <SafeAreaView style={{ backgroundColor: 'white' }}>
    <Spinner visible={state.isLoading} />
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
      <View style={style.header}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Feather name="arrow-left" color='#748a9d' size={24} />

        </TouchableOpacity>

        <Text style={{ alignSelf: 'center', fontWeight: 'bold', fontSize: 16, color: '#748a9d' }}>Account Info</Text>

        <TouchableOpacity
          onPress={async () => {
            const domain = state.socialLoginDomain;
            console.log("domain ", domain)
            signout(domain);
          }}
        >
          <Text style={{ alignSelf: 'center', fontWeight: 'bold', fontSize: 12, color: '#748a9d' }}>Logout</Text>
        </TouchableOpacity>

      </View>
      <View style={{ paddingVertical: 16, paddingHorizontal: 8 }}>
        <Spacer marg={8}>
          <View style={INPUT.backgroundStyle}>

            <TextInput label="Name"
              style={{ ...INPUT.inputStyle, paddingLeft: 16 }}
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="Name"
              value={name}
              onChangeText={(value) => {
                if (/^[a-zA-Z ]+$/.test(value) || value === "") {

                  setName(value);
                }
              }}

            />

          </View>
        </Spacer>
        <Spacer marg={8}>

          <View style={INPUT.backgroundStyle}>

            <TextInput
              style={{ ...INPUT.inputStyle, paddingLeft: 16 }}
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="Phone Number"
              value={mobile}
              onChangeText={(value) => {
                if (value.length < 11) {
                  setMobile(value);
                }
              }}

            />
          </View>
        </Spacer>

        <Spacer marg={8}>

          <View style={INPUT.backgroundStyle}>

            <TextInput
              style={{ ...INPUT.inputStyle, paddingLeft: 16 }}
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}

            />
          </View>
        </Spacer>
        <Spacer marg={8}>

          <View style={INPUT.backgroundStyle}>

            <TextInput
              style={{ ...INPUT.inputStyle, paddingLeft: 16 }}
              autoCapitalize="none"
              autoCorrect={false}

              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <TouchableOpacity style={{ justifyContent: 'center', paddingHorizontal: 16 }}>
              <Text style={{ color: 'red', borderColor: 'black', borderWidth: 1, paddingHorizontal: 8, paddingVertical: 4, }}>RESET</Text>
            </TouchableOpacity>
          </View>
        </Spacer>

        {/* {
          profile && profile.payments.id !== "no" ?
            <Text style={{
              paddingHorizontal: 24, fontSize: 16,
              color: '#748a9d', fontWeight: "bold", marginTop: 8
            }}>Payment Card : {profile.payments.number}</Text> : null
        } */}

        <Button
          // ViewComponent={require('react-native-linear-gradient').default}
          // ViewComponent={LinearGradient} // Don't forget this!
          // linearGradientProps={{
          //   colors: [COLORS.primary, COLORS.secondary],
          //   start: { x: 0.7, y: 1 },
          //   end: { x: 0, y: 1 },
          // }}

          buttonStyle={{
            borderRadius: 28,
            paddingVertical: 15,
            marginHorizontal: 56,
            marginBottom: 16,
            marginTop: 32,
            borderColor: COLORS.primary
          }}
          titleStyle={{
            color: COLORS.primary
          }}
          type="outline"
          title={"UPDATE PROFILE"}
          onPress={() => {
            if (name.length == 0 || name.length < 3) {
              notifyMessage("Length of name must be minimum of 3 cherecters.")
            }
            else if (mobile.length < 10) {
              notifyMessage("Mobile number must be 10 digits.")

            } else {
              updateProfile({ email, mobile, name, password })
              //navigation.navigate('Card')
            }
          }}
        />

        <Button
          ViewComponent={require('react-native-linear-gradient').default}
          // ViewComponent={LinearGradient} // Don't forget this!
          linearGradientProps={{
            colors: [COLORS.primary, COLORS.secondary],
            start: { x: 0.7, y: 1 },
            end: { x: 0, y: 1 },
          }}
          buttonStyle={{
            borderRadius: 28,
            paddingVertical: 15,
            marginHorizontal: 56,
            marginBottom: 16,
            marginTop: 10,
          }}
          type="solid"
          title={profile && profile.payments.id !== "no" ? "EDIT PAYMENT METHOD" : "ADD PAYMENT METHOD"}
          onPress={() => {
            // if (name.length == 0 || name.length < 3) {
            //   notifyMessage("Length of name must be minimum of 3 cherecters.")
            // }
            // else if (mobile.length < 10) {
            //   notifyMessage("Mobile number must be 10 digits.")

            // } else {

            // }
            navigation.navigate('Card')
          }}
        />

        <View style={{ flex: 1, justifyContent: 'center', marginBottom: 30, marginTop: 30 }}>
          <Image style={{ alignSelf: 'center', width: "30%" }} source={require('../../assets/logo.png')} />
        </View>

      </View>
    </ScrollView>

  </SafeAreaView>
    ;
}
ProfileScreen.navigationOptions = () => {
  return {
    headerShown: false,
  }
}
const style = StyleSheet.create({
  header: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: "space-between",
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

export default ProfileScreen;