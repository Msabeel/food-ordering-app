import React, { useContext, useState } from "react";
import { View, StyleSheet, Text, TextInput, ToastAndroid, FlatList, ImageBackground, Dimensions, TouchableOpacity, Image, SafeAreaView, ScrollView } from 'react-native';
import { COLORS, DATA_LIST, TEXT, INPUT, BTN_STYLE } from "../helpers/constants";
import { LinearGradient } from "react-native-linear-gradient";
import { Octicons } from '@expo/vector-icons';
import { Button, Icon } from "react-native-elements";
import { FontAwesome } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import Stars from 'react-native-stars';
import { Context as DataContext } from '../context/dataContext';
import Spinner from 'react-native-loading-spinner-overlay';

const ReviewListScreen = ({ navigation }) => {
  const id = navigation.state.params.id;
  const name = navigation.state.params.name;

  const [rating, setRating] = useState(0);
  const [message, setMsg] = useState('');
  const { state, rate, clearErrors } = useContext(DataContext);

  const showMessage = () => {
    const clearData = setTimeout(() => {
      clearErrors();

    }, 3000);
    return <Text style={{
      padding: 16,
      backgroundColor: COLORS.primary,
      color: 'white', marginHorizontal: 16,
      borderRadius: 12, marginVertical: 16
    }}>{state.errorMessage}</Text>
  };

  return <SafeAreaView style={{ paddingTop: 20, backgroundColor: 'white' }}>
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
        <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#748a9d' }}>Rating</Text>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Entypo name="cross" size={24} color="#748a9d" />
        </TouchableOpacity>

      </View>
      {state.errorMessage.length > 3 ? showMessage() : null}

      <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', marginTop: 32 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>How Was {name}'s Food ?</Text>
      </View>
      <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', marginTop: 16 }}>
        <Stars
          default={0.5}
          count={5}
          update={(val) => { setRating(val) }}

          half={true}
          starSize={50}
          fullStar={<FontAwesome name="star" size={32} color="red" style={style.icon} />}
          emptyStar={<FontAwesome name="star-o" size={32} color="red" />}
          halfStar={<FontAwesome name="star-half-full" size={32} color="red" />}
        />





      </View>
      <View style={{
        backgroundColor: '#F0F4F8',
        height: 180,
        borderRadius: 12,
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
          onChangeText={(val) => {
            setMsg(val);
          }}
          placeholder="Please write your Review."
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
        title="SUBMIT RATING"
        onPress={() => {
          //console.log(rating)
          if (rating == 0) {
            ToastAndroid.showWithGravity("you must rate atleast half star", ToastAndroid.LONG, ToastAndroid.CENTER)
          } else {
            const star = rating;
            //console.log(stars);
            rate({ "review": message, "star_count": star, "order_id": id })
          }
        }}
      ></Button>
      <View style={{ flex: 1, justifyContent: 'center', marginBottom: 64, }}>
        <Image style={{ alignSelf: 'center', resizeMode: 'contain' }} source={require('../../assets/logo.png')} />

      </View>

    </ScrollView>
  </SafeAreaView>;
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
ReviewListScreen.navigationOptions = () => {
  return {
    headerShown: false,
  }
}
export default ReviewListScreen;