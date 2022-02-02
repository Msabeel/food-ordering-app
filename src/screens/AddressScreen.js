import React, { useEffect, useRef, useState, useContext } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    ImageBackground,
    TextInput,
    Platform,
    Image,
    ToastAndroid,
    Alert,
    KeyboardAvoidingView,

} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather, FontAwesome, Ionicons } from '@expo/vector-icons';
import { Button, Icon } from "react-native-elements";
import { LinearGradient } from "react-native-linear-gradient";
import Spinner from 'react-native-loading-spinner-overlay';
import * as Location from 'expo-location';
import { NavigationEvents } from 'react-navigation';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

import { Context as DataContext } from '../context/dataContext';
import { Context as AuthContext } from '../context/authContext';
import Spacer from '../components/Spacer';
import { INPUT, COLORS, BTN_STYLE, GOOGLE_API_KEY } from '../helpers/constants';




const AddressScreen = ({ navigation }) => {
    const { updateLocation, updateProfile } = useContext(DataContext);
    const { clearErrors } = useContext(AuthContext);
    const [mobile, setMobile] = useState('');
    const [address, setAddress] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [lat, setLat] = useState(null);
    const [long, setLong] = useState(null);
    let data = navigation.getParam('details');
    // console.log("data ", data)
    useEffect(() => {
        if (data.mobile !== "0000") {
            setMobile(data.mobile);
        };
        setEmail(data.email);
        setName(data.name);
    }, []);

    const notifyMessage = msg => {
        if (Platform.OS === 'android') {
            ToastAndroid.showWithGravity(msg, ToastAndroid.LONG, ToastAndroid.CENTER)
        } else {
            Alert.alert(msg);
        }
    }


    return (
        <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ flex: 1, backgroundColor: "white" }}
        >

            <NavigationEvents
                onWillFocus={clearErrors}
            />

            <View style={{ alignItems: "center", marginTop: 30 }}>
                <Image
                    // style={styles.img}
                    source={require('../../assets/logo.png')}
                />
            </View>

            <View style={{
                flexDirection: "row",
                alignItems: 'center',
                justifyContent: 'center',
                paddingTop: 20,
            }}>
                <GooglePlacesAutocomplete
                    minLength={1}
                    placeholder='select your address'
                    fetchDetails={true}
                    keyboardShouldPersistTaps={"always"}
                    GooglePlacesDetailsQuery={{ fields: 'geometry' }}
                    onPress={(data, details = null) => {

                        console.log(data, details);
                        let coords = {
                            "latitude": details.geometry.location.lat,
                            "longitude": details.geometry.location.lng
                        };
                        let location = data.description;
                        setLat(coords.latitude);
                        setLong(coords.longitude);
                        setAddress(location);
                        updateLocation({ coords, location })
                    }}
                    debounce={250}
                    query={{
                        key: GOOGLE_API_KEY,
                        language: 'en',
                        components: 'country:ca',
                    }}

                    styles={{
                        container: {
                            paddingHorizontal: 24,
                        },
                        textInputContainer: {
                            // paddingHorizontal: 24,
                            // backgroundColor: "red",
                        },
                        textInput: {
                            height: 60,
                            color: '#5d5d5d',
                            fontSize: 16,
                            backgroundColor: "#F0F4F8"
                        },
                        predefinedPlacesDescription: {
                            color: '#1faadb',
                        },
                    }}
                />
            </View>

            <View style={{ paddingTop: 10, paddingBottom: "50%" }}>
                <View style={INPUT.backgroundStyle}>
                    <Feather name="phone" style={INPUT.iconStyle} />
                    <TextInput label="Mobile"
                        style={INPUT.inputStyle}
                        keyboardType='number-pad'
                        autoCorrect={false}
                        placeholder="Mobile"
                        value={mobile}
                        onChangeText={(value) => {
                            if (value.length < 11) {
                                setMobile(value)
                            }
                        }}
                    />
                </View>
            </View>


            <Spacer marg={16}>
                <Button
                    ViewComponent={require('react-native-linear-gradient').default}
                    // ViewComponent={LinearGradient} // Don't forget this!
                    linearGradientProps={{
                        colors: [COLORS.primary, COLORS.secondary],
                        start: { x: 0.7, y: 1 },
                        end: { x: 0, y: 1 },
                    }}
                    buttonStyle={BTN_STYLE}
                    type="solid"
                    title="Submit"
                    onPress={() => {
                        // setAddress(state.location);
                        // let add = state.location;
                        console.log(lat, " | ", long)
                        console.log(address)
                        if (address == "") {
                            notifyMessage("Enter the address.")
                        }
                        else if (mobile.length < 10 || mobile.length === 0) {
                            notifyMessage("Mobile number must be 10 digits.")
                        }
                        else {
                            console.log("success")

                            updateProfile({ email, mobile, address, lat, long })
                        }
                    }}
                />
            </Spacer>
        </ScrollView>

    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flex: 1,
        justifyContent: "center",
        marginVertical: 20,
    },
    container: {
        flex: 1,
        justifyContent: 'center'
    },
    imgBackground: {
        flex: 1,
        marginVertical: 20,
    },
    imgContainer: {
        flex: 1,
        flexDirection: 'row',
        marginTop: 20
    },
    img: {
        alignSelf: 'center',
        resizeMode: 'contain'
    }
});

export default AddressScreen;