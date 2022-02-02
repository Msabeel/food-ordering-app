import React, { useEffect, useContext, useLayoutEffect, useState, useRef } from "react";
import { View, StyleSheet, Text, Image } from "react-native";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { COLORS, GOOGLE_API_KEY, MAP_STYLE } from "../helpers/constants";
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { Context as DataContext } from '../context/dataContext';

const PickupScreen = (props) => {
  const { state, takeAway } = useContext(DataContext);
  const { take_away_chefs } = state;


  const mapRef = useRef();
  useEffect(() => {
    console.log("props", props.navigation)
    let coords = state.coords;
    takeAway({ coords });
  }, []);
  console.log('state.take_away_chefs', take_away_chefs)
  return <MapView
    ref={mapRef}
    customMapStyle={MAP_STYLE}
    style={{ flex: 1 }}
    // provider={PROVIDER_GOOGLE}
    initialRegion={{
      latitude: parseFloat(state.coords.latitude),
      longitude: parseFloat(state.coords.longitude),
      latitudeDelta: 0.0922, longitudeDelta: 0.0421
    }}
    zoomEnabled={true}
  >


    {state.take_away_chefs.map(marker => (
      <MapView.Marker
        coordinate={{ latitude: parseFloat(marker.lat), longitude: parseFloat(marker.long) }}
        title={marker.chef_name}
        onPress={() => {
          console.log("checf,", marker)
          props.navigation.navigate('Chefs', {
            id: marker.chef_id
          })
        }}
      >
        <Image source={require('../../assets/marker.png')} />
      </MapView.Marker>

    ))}

  </MapView>
}

const style = StyleSheet.create({
  map: {
    flex: 1,
  }
});

export default PickupScreen;