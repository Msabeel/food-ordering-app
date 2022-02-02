import React, { useState, useContext, useEffect } from "react";
import { View, StyleSheet, Text, TextInput, Image, ImageBackground, ToastAndroid, Platform, Alert } from "react-native";
import { Button, Icon } from "react-native-elements";
import { LinearGradient } from "react-native-linear-gradient";
import Spacer from "../components/Spacer";
import { COLORS, BTN_STYLE, INPUT } from "../helpers/constants";
import { Feather } from '@expo/vector-icons';
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";


import { Context as AuthContext } from '../context/authContext';
import Spinner from 'react-native-loading-spinner-overlay';
import { NavigationEvents } from 'react-navigation'
const ForgotPasswordScreen = ({ navigation }) => {
    const { state, sendOTP, clearErrors, changePassword, clearOtp } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [otp, setOTP] = useState('');
    const [tempotp, setTempOTP] = useState('');
    const [cnfPasswrod, setCnfpassword] = useState('');
    const [password, setPassword] = useState('');
    const [isValid, setValid] = useState(false)
    const [timerCount, setTimer] = useState(120)


    useEffect(() => {
        if (state.otp) {
            setTempOTP(state.otp.otp)
            let interval = setInterval(() => {
                setTimer(lastTimerCount => {
                    if (lastTimerCount === 0) {
                        console.log("lastTimerCount", lastTimerCount)
                        setTempOTP('')
                    }
                    lastTimerCount <= 0 && clearInterval(interval)
                    console.log("lastTimerCount", lastTimerCount)

                    if (lastTimerCount)

                        return lastTimerCount - 1
                })
            }, 1000) //each count lasts for a second
            //cleanup the interval on complete
            return () => clearInterval(interval)
        }
    }, [state.otp]);

    console.log("state", state)
    const notifyMessage = msg => {
        if (Platform.OS === 'android') {
            ToastAndroid.showWithGravity(msg, ToastAndroid.LONG, ToastAndroid.CENTER)
        } else {
            Alert.alert(msg);
        }
    }

    const sendOtptoserver = () => {
        if (email.length == 0 || email.length < 4) {
            notifyMessage("Invalid Email .")

        }
        else {
            let date = (new Date().getTime()).toString();
            let otp = date.substr(-6)
            // alert(otp)
            setTempOTP(otp)
            sendOTP({ email, otp })
        }

    }

    const confirmPassword = (text) => {
        setCnfpassword(text)
        if (password.length === text.length) {
            if (password !== text) {
                notifyMessage('Password not match!')
            }
        }
    }

    const showMessage = () => {
        const clearData = setTimeout(() => {
            clearErrors();
        }, 3000);
        return <Text style={{
            padding: 16,
            backgroundColor: COLORS.primary,
            color: 'white',
            marginHorizontal: 16,
            borderRadius: 12
        }}>{state.errorMessage}</Text>
    };


    return <View style={style.container}>
        <NavigationEvents
            onWillFocus={clearErrors}
        />
        <Spinner visible={state.isLoading} />
        <Spinner visible={loading} />
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
            <ImageBackground source={require('../../assets/login.png')} style={{
                resizeMode: "contain", marginVertical: 20
            }} >
                <Spacer marg={32} style={{ flex: 1, flexDirection: 'row', marginTop: 20, }}>
                    <Image style={{ alignSelf: 'center', resizeMode: 'contain' }} source={require('../../assets/logo.png')} />
                </Spacer>
                {state.errorMessage !== '' ?
                    showMessage() : null}

                {
                    !isValid ?
                        <>
                            <Spacer marg={8}>
                                <View style={INPUT.backgroundStyle}>
                                    <Feather name="mail" style={INPUT.iconStyle} />
                                    <TextInput label="Email"
                                        style={INPUT.inputStyle}
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        placeholder="Email"
                                        value={email}
                                        onChangeText={setEmail}

                                    />

                                </View>
                            </Spacer>

                            {state.otp !== null ?
                                <Spacer marg={8}>
                                    <View style={INPUT.backgroundStyle}>
                                        <Feather name="key" style={INPUT.iconStyle} />
                                        <TextInput label="OTP"
                                            style={INPUT.inputStyle}
                                            autoCapitalize="none"
                                            autoCorrect={false}
                                            placeholder="OTP"
                                            value={otp}
                                            keyboardType="number-pad"
                                            onChangeText={setOTP}

                                        />

                                    </View>


                                </Spacer>
                                :
                                null
                            }

                            <Spacer marg={32}>


                                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                    <Text>Did't receive the code? </Text>
                                    <TouchableOpacity onPress={() => {
                                        sendOtptoserver()
                                    }}
                                    >

                                        <Text style={{ alignSelf: 'center', color: 'red', fontSize: 16 }}>Resend</Text>
                                    </TouchableOpacity>
                                </View>

                            </Spacer>
                        </>
                        :
                        <>
                            <Spacer marg={8}>
                                <View style={INPUT.backgroundStyle}>
                                    <Feather name="key" style={INPUT.iconStyle} />
                                    <TextInput label="New password"
                                        secureTextEntry={true}
                                        style={INPUT.inputStyle}
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        placeholder="New password"
                                        value={password}
                                        onChangeText={setPassword}

                                    />

                                </View>
                            </Spacer>
                            <Spacer marg={8}>
                                <View style={INPUT.backgroundStyle}>
                                    <Feather name="key" style={INPUT.iconStyle} />
                                    <TextInput label="Confirm password"
                                        secureTextEntry={true}
                                        style={INPUT.inputStyle}
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        placeholder="Confirm password"
                                        value={cnfPasswrod}
                                        onChangeText={confirmPassword}

                                    />

                                </View>
                            </Spacer>

                        </>
                }
                <Spacer marg={32}>


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
                        buttonStyle={BTN_STYLE}
                        type="solid"
                        title={state.otp === null ? "Send OTP" : isValid === false ? "Verify" : "Change password"}
                        onPress={() => {
                            if (!isValid) {
                                if (email.length == 0 || email.length < 4) {
                                    notifyMessage("Invalid Email .")

                                }
                                else if (state.otp === null) {
                                    sendOtptoserver()
                                } else {
                                    if (otp.length === 0 || otp.length < 6) {
                                        notifyMessage("Invalid OTP .")
                                    } else {

                                        if (otp === tempotp) {
                                            setValid(true)

                                        } else {
                                            notifyMessage("Invalid OTP .")
                                        }
                                    }
                                }
                            } else {
                                if (password.length == 0 || password.length < 8) {
                                    notifyMessage(" Please set atleast 8 Charactor password .")
                                }
                                else {
                                    if (password == cnfPasswrod) {
                                        changePassword(email, password)
                                    } else {
                                        notifyMessage("Password not match .")
                                    }
                                }
                            }



                        }}

                    ></Button>
                </Spacer>


                <TouchableOpacity
                    style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}
                    onPress={() => {
                        clearOtp()
                        navigation.navigate('Signup')
                    }}
                >
                    <Icon
                        type="feather"
                        name="arrow-left"
                        color="#748a9d"
                        size={18}
                    />
                    <Text style={{ alignSelf: 'center', color: '#748a9d', fontWeight: "bold", fontSize: 16 }}>Back</Text>
                </TouchableOpacity>


            </ImageBackground>

        </ScrollView>
    </View >;
}

const style = StyleSheet.create({
    container: {

        flex: 1,
        justifyContent: 'center',
        marginVertical: 20
    }
});
export default ForgotPasswordScreen;