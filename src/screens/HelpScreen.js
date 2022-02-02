import React, { useContext, useState } from "react";
import { View, StyleSheet, Text, TextInput, FlatList, ImageBackground, ToastAndroid, Dimensions, TouchableOpacity, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, DATA_LIST, TEXT, INPUT, BTN_STYLE } from "../helpers/constants";
import { LinearGradient } from "react-native-linear-gradient";
import { Octicons } from '@expo/vector-icons';
import { Button, Icon } from "react-native-elements";
import { FontAwesome } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { Context as DataContext } from '../context/dataContext';
import Spinner from 'react-native-loading-spinner-overlay';
import { NavigationEvents } from 'react-navigation';



const HelpScreen = ({ navigation }) => {
  const [message, setMessage] = useState('');
  const { state, help, clearErrors } = useContext(DataContext);
  console.log("HelpScreenLoad ", state.isLoading);


  const showMessage = () => {
    const clearData = setTimeout(() => {
      clearErrors();
      setMessage('');
    }, 3000);
    return <Text style={{ padding: 16, backgroundColor: COLORS.primary, color: 'white', marginHorizontal: 16, borderRadius: 12 }}>{state.errorMessage}</Text>
  };

  return <SafeAreaView style={{ backgroundColor: 'white' }}>
    <Spinner visible={state.isLoading} />
    <NavigationEvents
      onWillFocus={() => { clearErrors() }}
    />
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
      <View style={style.header}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Feather name="arrow-left" color='#748a9d' size={24} />

        </TouchableOpacity>

        <Text style={{ fontWeight: 'bold', fontSize: 20, color: '#748a9d' }}>Help</Text>

        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Entypo name="cross" size={24} color="#748a9d" />
        </TouchableOpacity>

      </View>
      {state.errorMessage.length > 3 ? showMessage() : null}

      <View style={{
        backgroundColor: '#F0F4F8',
        height: 180,
        borderRadius: 16,
        marginHorizontal: 16,
        flexDirection: 'row',
        marginVertical: 16,
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
          multiline={true}
          value={message}
          onChangeText={(val) => {
            setMessage(val)
          }}
          placeholder="How can we help you ?"
        />


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
        title="SUBMIT"
        onPress={async () => {
          if (message.length < 4) {
            ToastAndroid.showWithGravity("your message must be greater than 3 cherecters.", ToastAndroid.LONG, ToastAndroid.CENTER)
          } else {
            console.log(message.length)
            await help({ message })
          }
        }}
      ></Button>
      <View style={{ flex: 1, justifyContent: 'center', marginBottom: 64, }}>
        <Image style={{ alignSelf: 'center', resizeMode: 'contain' }} source={require('../../assets/logo.png')} />

      </View>

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
});
HelpScreen.navigationOptions = () => {
  return {
    headerShown: false,
  }
}
export default HelpScreen;