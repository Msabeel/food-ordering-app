import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, Text, ScrollView, Dimensions, ImageBackground, FlatList, Image } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { COLORS, DATA_LIST, TEXT } from "../helpers/constants";
import { Octicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Context as DataContext } from '../context/dataContext';
import Spinner from 'react-native-loading-spinner-overlay';
import { Entypo } from '@expo/vector-icons';
import AsyncStorage from '@react-native-community/async-storage';



const ChefScreen = ({ navigation }) => {
    // let add_drinks = [];
    const id = navigation.state.params.id;
    const { state, getChefData, getCart, updateItem, updateTotalDrink, updateCart,
        updateDrinkTotalPrice } = useContext(DataContext);
    const { total_drink_price, totalDrink } = state;
    const [loading, setLoading] = useState(false);
    const [totalPrice, setTotalPrice] = useState('');
    const [drinkCartVisible, setDrinkCartVisible] = useState(false);
    const { chef_info, food_info } = state;


    const fetchChefData = async () => {
        setLoading(true);
        try {
            const response = await getChefData({ id });
            setLoading(false);
        } catch (error) {
            console.log('chefScreenError', error);
            setLoading(false);
        }
    };

    console.log('chefScreen', chef_info);
    console.log('foodInfo', state.chef_info.menus)


    useEffect(() => {
        fetchChefData();

        return () => {
            fetchChefData
        };
    }, []);


    const GetAvailableDate = () => {
        if (Object.keys(chef_info).length === 0) {
            return;
        }
        return (
            chef_info.availability.map(item => {
                if (item.status === 1) {
                    return <Text style={{
                        borderWidth: 0.5,
                        borderColor: '#748A9D',
                        borderRadius: 4,
                        color: '#748A9D',
                        fontSize: 10,
                        fontWeight: 'bold',
                        marginRight: 2,
                        width: 16,
                        height: 16,
                        textAlign: 'center',

                    }}>{item.day.substring(0, 1)}</Text>
                    // return <Text style={{ ...style.chip, backgroundColor: '#748A9D', opacity: 0.36 }}>{item.day.substring(0, 1)}</Text>
                } else {
                    return <Text style={{
                        borderWidth: 0.5,
                        borderColor: '#9DB1C4',
                        borderRadius: 4,
                        color: '#9DB1C4',
                        fontSize: 10,
                        // fontWeight: 'bold',
                        marginRight: 2,
                        width: 16,
                        height: 16,
                        textAlign: 'center',
                        // opacity: 0.6,
                        // backgroundColor: '#ffffff',
                    }}>{item.day.substring(0, 1)}</Text>;
                    // return <Text style={style.chip}>{item.day.substring(0, 1)}</Text>;
                }
            })
        );
    }

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
    };



    const addDrinkItem = (item) => {
        console.log('totalDrink', totalDrink);
        let chef_id = state.chef_info.chef_id;
        let coords = state.coords;
        let cart = state.carts;
        let items = {};

        let total = null;
        let status = false;
        if (totalDrink.length === 0) {
            const data = [{ drink_id: item.id, qty: 1 }];
            let drinks = data;
            updateCart({ drinks, chef_id, items, cart, coords });
            updateTotalDrink(data);
            updateDrinkTotalPrice(item.price);
        } else {
            let filt = totalDrink.filter((drink) => {
                if (drink.drink_id === item.id) {
                    drink.qty = drink.qty + 1;
                    const data = [{ drink_id: item.id, qty: drink.qty }];
                    let drinks = data;
                    updateCart({ drinks, chef_id, items, cart, coords });
                    total = parseFloat(total_drink_price, 10) + parseFloat(item.price, 10);
                    updateDrinkTotalPrice(total);
                    status = true;
                }
                return drink;
            });

            if (status === false) {
                totalDrink.push({ drink_id: item.id, qty: 1 });
                let drinks = totalDrink;
                updateCart({ drinks, chef_id, items, cart, coords });
                console.log('data>>', totalDrink)
                // console.log('data>>', data)
                updateTotalDrink(totalDrink);
                total = parseFloat(total_drink_price, 10) + parseFloat(item.price, 10);
                updateDrinkTotalPrice(total);
            }

        }
    };

    const removeDrinkItem = (item) => {
        console.log('removeDrink', totalDrink)

        let chef_id = state.chef_info.chef_id;
        let coords = state.coords;
        let cart = state.carts;
        let items = {};

        let total = null;
        if (totalDrink.length === 0) {
            //  alert('empty')
        } else {
            // alert('remove');
            totalDrink.filter((drink) => {
                if (drink.drink_id === item.id && drink.qty != 0) {
                    drink.qty = drink.qty - 1;
                    if (drink.qty === 0) {
                        // alert('zero')
                        let findindex = totalDrink.findIndex((a) => a.drink_id === drink.drink_id);
                        findindex !== -1 && totalDrink.splice(findindex, 1)
                    }
                    let drinks = totalDrink;
                    console.log('drink>>>>>>>>>>>>', drinks)
                    updateCart({ drinks, chef_id, items, cart, coords });
                    total = parseFloat(total_drink_price, 10) - parseFloat(item.price, 10);
                    updateDrinkTotalPrice(total);
                }
            })
        }
    };

    const drinkQty = (item) => {
        let status = false;
        console.log('item>>>>>', item.id);
        console.log('length', totalDrink.length)
        if (totalDrink.length === 0) {
            return <Text>0</Text>;
        }
        let check = totalDrink.map((drink) => {
            if (drink.drink_id === item.id) {
                status = true;
                return <Text>{drink.qty}</Text>;
            };
        });

        if (status === false) {
            return <Text>0</Text>;
        } else {
            return check;
        }

    };

    const renderItems = ({ item }) => {

        // foodDrinks = item.drinks != null ? item.drinks : [];

        return <View>
            {/* <Text style={{ color: '#748a9d', alignSelf: 'flex-start', paddingLeft: 16, fontSize: 14, textTransform: 'capitalize', paddingVertical: 16, fontWeight: 'bold' }}>{item.menu_name}</Text> */}
            <View>

                <FlatList
                    data={item.items}
                    renderItem={({ item }) =>
                        <TouchableOpacity
                            onPress={() => {
                                navigation.navigate('Foods', {
                                    id: item.id
                                })
                            }}
                        >
                            <View style={{ paddingVertical: 16, borderBottomColor: '#C0C0C0', borderBottomWidth: 1, marginHorizontal: 16 }}>
                                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Image source={{ uri: item.food_image }} style={{ width: 90, height: 90, borderRadius: 18, }} />
                                    <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-between', marginLeft: 16, paddingBottom: 8 }}>
                                        <Text style={{ fontWeight: 'bold', color: '#748A9D', paddingBottom: 8, fontSize: 12 }}>{item.item_name}</Text>
                                        <Text style={{ color: '#9DB1C4', fontSize: 12 }}> {item.description}</Text>
                                        {/* <Octicons name="primitive-dot" color={COLORS.primary} size={14}><Text style={{ color: '#9DB1C4', fontSize: 12 }}> {item.description}</Text></Octicons> */}
                                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start' }}>
                                            <Text style={{ fontSize: 10, alignSelf: 'flex-end', marginRight: 16, borderRadius: 6, backgroundColor: '#748A9D', overflow: 'hidden', paddingHorizontal: 8, color: 'white' }}>{item.calories}</Text>
                                            <Text style={{ color: COLORS.primary, paddingTop: 4, fontSize: 14, alignSelf: 'flex-end', fontWeight: 'bold' }}>${item.price}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    }
                    keyExtractor={(item, index) => "item" + item.id}
                    showsHorizontalScrollIndicator={false}
                    listKey={"food" + item.id}
                />
            </View>


            {item.drinks != null && item.drinks.length >= 0 ? <Text style={{ color: '#748a9d', alignSelf: 'flex-start', paddingLeft: 16, fontSize: 14, textTransform: 'capitalize', paddingVertical: 16, fontWeight: 'bold' }}>Drinks</Text> : null}
            <View>
                <FlatList
                    data={item.drinks}
                    renderItem={({ item }) =>
                        <View style={{ paddingVertical: 16, borderBottomColor: '#C0C0C0', borderBottomWidth: 1, marginHorizontal: 16, flexDirection: 'row' }}>
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Image source={{ uri: item.image }} style={{ width: 90, height: 90, borderRadius: 18, }} />
                                <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-between', marginLeft: 16, paddingBottom: 8 }}>
                                    <Text style={{ fontWeight: 'bold', color: '#748A9D', paddingBottom: 8, fontSize: 12 }}>{item.name}</Text>
                                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start' }}>
                                        <Text style={{ color: COLORS.primary, paddingTop: 4, fontSize: 14, alignSelf: 'flex-end', fontWeight: 'bold' }}>${item.price}</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={{
                                // alignItems: '',
                                paddingVertical: 10, paddingRight: 15, flexDirection: 'row'
                            }}>
                                <TouchableOpacity style={{ marginRight: 5 }} onPress={() => { removeDrinkItem(item) }} >
                                    <Entypo name="circle-with-minus" size={20} color={COLORS.primary} />
                                </TouchableOpacity>
                                {drinkQty(item)}
                                <TouchableOpacity style={{ marginLeft: 5 }} onPress={() => { addDrinkItem(item) }} >
                                    <Entypo name="circle-with-plus" size={20} color={COLORS.primary} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    }
                    keyExtractor={(item, index) => "drink" + item.id}
                    showsHorizontalScrollIndicator={false}
                    listKey={"drink" + item.id}
                />
            </View>
        </View>
    };

    return (
        <SafeAreaView style={{ backgroundColor: 'white' }}>
            <Spinner visible={loading} />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
                <View style={style.header}>
                    <ImageBackground source={{ uri: state.chef_info.profile_pic }} style={{
                        resizeMode: "contain",
                        height: Dimensions.get('window').height * 0.4,
                    }}
                        imageStyle={{
                            borderBottomRightRadius: 24,
                            borderBottomLeftRadius: 24,
                        }}

                    >

                        <LinearGradient
                            // Background Linear Gradient
                            colors={['transparent', 'transparent', 'transparent', 'rgba(225,0,0,0.2)', 'rgba(225,0,0,0.7)']}
                            style={style.background}
                            end={[0.3, 1]}
                            start={[1, 0]}

                        />
                        <View style={style.header_container}>
                            <TouchableOpacity
                                onPress={() => {
                                    navigation.goBack();
                                }}
                            >
                                <Feather name="arrow-left" color='white' size={24} />
                            </TouchableOpacity>
                            <Text style={{ fontSize: 20, marginTop: 32, marginBottom: 8, color: 'white' }}>{state.chef_info.chef_name}</Text>
                            <Text style={{ color: 'white', fontSize: 16, marginTop: -2, marginBottom: 8 }}>
                                {stars(state.chef_info.rating)}
                                {state.chef_info.rating}</Text>

                            <View style={{ marginTop: 8 }}>
                                <TouchableOpacity onPress={() => {
                                    navigation.navigate('Review', {
                                        id: state.chef_info.chef_id
                                    });
                                }}>
                                    <Text style={{ color: 'white', fontSize: 10 }}>Reviewes <Feather name="chevron-down"></Feather></Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ marginTop: 8 }}>
                                <TouchableOpacity
                                    onPress={() => {
                                        navigation.navigate('Help')
                                    }}
                                >
                                    <Feather name="mail" color='white' size={14}><Text style={{ fontSize: 14, fontWeight: 'bold' }}> Contact this chef.</Text></Feather>
                                </TouchableOpacity>
                            </View>
                            <View style={{ marginTop: 4 }}>
                                <Text style={{ fontSize: 12, color: 'white', textAlign: 'auto' }}>{state.chef_info.description}</Text>
                            </View>
                        </View>
                    </ImageBackground>


                </View>

                <View style={{ flex: 1, flexDirection: 'row', paddingHorizontal: 16, justifyContent: 'space-between', paddingVertical: 16, borderBottomColor: '#C0C0C0', borderBottomWidth: 1, }}>
                    <Text style={{ color: '#748a9d', alignSelf: 'flex-end', fontWeight: 'bold' }}>{state.chef_info.chef_name}'s Menus</Text>
                    <View style={{ flex: 1, flexDirection: 'column' }}>
                        <Text style={{ color: '#748a9d', alignSelf: 'flex-end' }}>Availability<Feather name='chevron-down'></Feather></Text>
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end', marginTop: 4, }}>
                            {GetAvailableDate()}
                        </View>
                    </View>
                </View>
                <View style={{ marginBottom: 72 }}>
                    <FlatList
                        data={state.chef_info.menus}
                        renderItem={renderItems}
                        keyExtractor={(item, index) => item.id}
                        showsHorizontalScrollIndicator={false}
                    />
                </View>

            </ScrollView>



            {state.cart_item !== 0 ?
                <View style={{ position: 'absolute', bottom: 8, left: 64, right: 64 }}>
                    <TouchableOpacity style={style.btn}
                        onPress={() => {
                            getCart();
                        }}
                    >
                        <LinearGradient
                            // Background Linear Gradient
                            colors={[COLORS.primary, COLORS.secondary]}
                            style={style.background_btn}
                            end={[0, 1]}
                            start={[1, 0]}

                        />
                        <View style={{ flex: 1, flexDirection: 'row', paddingHorizontal: 24, paddingVertical: 15, borderRadius: 30, justifyContent: 'space-between' }}>
                            <MaterialCommunityIcons name="cart" size={20} color="white" />
                            <Text style={{ color: 'white', fontSize: 14 }}>View Cart</Text>
                            <Text style={{ color: 'white', fontSize: 14, fontWeight: 'bold' }}>{state.cart_item}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                : null}
        </SafeAreaView>
    );



}

const style = StyleSheet.create({
    header: {
        height: Dimensions.get('window').height * 0.4,
        borderBottomRightRadius: 24,
        borderBottomLeftRadius: 24,

    },
    chip: {
        borderWidth: 0.5,
        borderColor: '#748A9D',
        borderRadius: 4,
        color: '#748A9D',
        fontSize: 10,
        fontWeight: 'bold',
        marginRight: 2,
        width: 16,
        height: 16,
        textAlign: 'center',
    },
    bedg: {
        fontSize: 8,
        color: 'white',
        borderRadius: 8,
        borderColor: 'gray',
        borderWidth: 1,
    },
    icon: {
        paddingHorizontal: 2
    },
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: Dimensions.get('window').height * 0.4,
        borderRadius: 24,
        overflow: 'hidden'
    },
    background_btn: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: "100%",
        borderRadius: 26
    },
    header_container: {
        flex: 1,
        flexDirection: 'column',
        paddingHorizontal: 24,
        paddingTop: 32,
        justifyContent: 'flex-start'
    },
    btn: {
        borderRadius: 26,
        elevation: 6
    },

});
ChefScreen.navigationOptions = () => {
    return {
        headerShown: false,
    }
}
export default ChefScreen;