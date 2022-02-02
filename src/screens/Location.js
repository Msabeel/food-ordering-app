import React, { useState, useRef, useContext, useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { COLORS, GOOGLE_API_KEY } from "../helpers/constants";
import { Context as DataContext } from '../context/dataContext';

const LocationScreen = ({ navigation: { goBack } }) => {
  const { state, updateLocation } = useContext(DataContext);

  return <GooglePlacesAutocomplete
    placeholder={state.location}
    fetchDetails={true}
    onPress={(data, details = null) => {
      // 'details' is provided when fetchDetails = true
      let coords = { "latitude": details.geometry.location.lat, "longitude": details.geometry.location.lng }
      let location = data.description;
      console.log(coords, location);
      updateLocation({ coords, location })
      goBack();
    }}
    GooglePlacesDetailsQuery={{ fields: 'geometry' }}
    debounce={250}
    query={{
      key: GOOGLE_API_KEY,
      language: 'en',
      components: 'country:ca',
    }}
    
  />
}

const style = StyleSheet.create({
  map: {
    flex: 1,
  }
});

export default LocationScreen;