import React, { useEffect, useContext, useLayoutEffect, useState } from "react";
import { View, StyleSheet, Text, ScrollView, Dimensions, ImageBackground, FlatList, Image } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { COLORS, DATA_LIST, TEXT, CATS, BTN_STYLE } from "../helpers/constants";
import { Octicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import CircleCheckBox, { LABEL_POSITION } from 'react-native-circle-checkbox';
import { Entypo } from '@expo/vector-icons';
import { Button, Icon } from "react-native-elements";
import { Fontisto } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Context as DataContext } from '../context/dataContext';
import Spinner from 'react-native-loading-spinner-overlay';
import { AntDesign } from '@expo/vector-icons';

const FoodScreen = ({ navigation }) => {
    const id = navigation.state.params.id;
    const { state, getFoodData, getCustomizatios, updateItem, addToCart } = useContext(DataContext);
    const [loading, setLoading] = useState(false);


    const fetchFoodData = async () => {
        setLoading(true);
        try {
            const response = await getFoodData({ id });
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchFoodData();

        return () => {
            fetchFoodData;
        };
    }, []);





    const renderFreq = ({ item }) => {
        <View style={{ backgroundColor: "#F0F4F8", padding: 16, }}>
            <Text style={{ color: '#748a9d', fontSize: 14, fontWeight: 'bold' }}>Red Peppers Sauce </Text>

        </View>
    }
    const renderCustomization = (itemData) => {
        return itemData.item.customizations.map((item) => {
            return (
                <TouchableOpacity
                    key={item.name + item.id}
                    onPress={() => {
                        let custom = [...state.customizatios];
                        let food = state.food_info;
                        let filt = custom.filter(obj => obj.customizations.map((o) => {
                            if (o.id === item.id) {
                                o.isChecked = !o.isChecked;
                                food = state.food_info;
                                if (o.isChecked === true) {
                                    food.food_total = parseFloat(food.food_total, 10) + parseFloat(o.price, 10)
                                } else {
                                    food.food_total = parseFloat(food.food_total, 10) - parseFloat(o.price, 10)
                                }
                            }
                            return o;
                        }));
                        getCustomizatios({ "newcusts": filt });
                        updateItem({ "filt": food })
                    }}
                >
                    <View style={style.customizations}>
                        <Text style={{ color: '#748a9d', textAlign: 'center', fontSize: 12, fontWeight: 'bold' }}>{item.name}</Text>
                        <Text style={{ color: '#748a9d', alignSelf: 'center', paddingVertical: 8, fontSize: 10 }}>+ ${item.price}</Text>
                        {item.isChecked ? <AntDesign name="checkcircle" size={16} color="red" /> : <Entypo name="circle" size={16} color="red" />}
                    </View>
                </TouchableOpacity>
            );
        });

    };
    const renderDrink = ({ item }) => (
        <Drink title={item.name} id={item.id} price={item.price} qty={item.qty} />
    );
    const Drink = ({ title, id, price, qty }) => (
        <View style={style.drinks}>
            <Text style={{ color: '#748a9d', alignSelf: 'center', fontSize: 12, fontWeight: 'bold' }}>{title}</Text>
            <Text style={{ color: '#748a9d', alignSelf: 'center', paddingVertical: 2, fontSize: 10 }}>${price}</Text>
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                <TouchableOpacity
                    onPress={() => {
                        let food = state.food_info;
                        let old = [...state.food_info.drinks];
                        let filt = old.filter((o) => {
                            if (o.id == id && qty != 0) {
                                o.qty = qty - 1;
                                food.food_total = parseFloat(food.food_total, 10) - parseFloat(o.price, 10)

                            }
                            return o;
                        });
                        food.drinks = filt;
                        updateItem({ "filt": food });
                    }}
                >

                    <Entypo name="circle-with-minus" size={16} style={{ paddingTop: 2 }} color={COLORS.primary} />
                </TouchableOpacity>
                <Text style={{ color: '#748a9d', paddingVertical: 4, fontSize: 10, color: '#748a9d' }}>{qty}</Text>


                <TouchableOpacity
                    onPress={() => {
                        let food = state.food_info;

                        let old = [...state.food_info.drinks];
                        let filt = old.filter((o) => {
                            if (o.id == id) {
                                o.qty = qty + 1;
                                food.food_total = parseFloat(food.food_total, 10) + parseFloat(o.price, 10)

                            }
                            return o;
                        });
                        food.drinks = filt;
                        updateItem({ "filt": food });
                    }}
                >
                    <Entypo name="circle-with-plus" size={16} style={{ paddingTop: 2 }} color={COLORS.primary} />
                </TouchableOpacity>
            </View>
        </View>
    );

    const getTotal = () => {
        let total = 0;
        if (state.food_info.food_total !== undefined && state.food_info.food_total !== 0) {
            if (state.food_info.qty === 0) {
                total = state.food_info.food_total * 1;
            } else {
                total = state.food_info.food_total * state.food_info.qty;

            }
        }

        return <Text
            style={{
                color: 'white',
                fontSize: 16,
                fontWeight: 'bold'
            }}
        >
            ${isNaN(total) ? 0 : total.toFixed(2)}
        </Text>;
    }
    return <SafeAreaView style={{ flex: 1 }}>
        <Spinner visible={loading} />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', backgroundColor: 'white' }}>
            <View style={style.header}>
                <ImageBackground source={{ uri: state.food_info.food_image }} style={{
                    resizeMode: "contain",
                    height: Dimensions.get('window').height * 0.5,
                }}
                    imageStyle={{
                        borderBottomRightRadius: 24,
                        borderBottomLeftRadius: 24,
                    }}

                >
                    <LinearGradient
                        // Background Linear Gradient
                        colors={['transparent', 'rgba(225,0,0,0.2)', 'rgba(225,0,0,0.8)']}
                        style={style.background}
                        start={[0, 0]}

                    />
                    <View style={style.header_container}>
                        <TouchableOpacity
                            onPress={() => {
                                navigation.goBack();
                            }}
                        >
                            <Feather name="arrow-left" color='white' size={24} />
                        </TouchableOpacity>
                        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-end' }}>
                            <Text style={{ fontSize: 20, marginBottom: 16, color: 'white', alignSelf: 'center', fontWeight: 'bold' }}>{state.food_info.name}</Text>
                            <Text style={{ fontSize: 16, marginBottom: 4, color: 'white', alignSelf: 'center' }}>Details & Ingrideints <Feather name="chevron-down"></Feather></Text>
                            <Text style={{ fontSize: 14, marginBottom: 16, color: 'white', alignSelf: 'center', paddingHorizontal: 16, }}>{state.food_info.description}</Text>
                            <Text style={{ fontSize: 16, marginBottom: 4, color: 'white', alignSelf: 'center' }}>Allergic Info</Text>
                            <Text style={{ fontSize: 12, marginBottom: 32, color: 'white', alignSelf: 'center', paddingHorizontal: 16, }}>{state.food_info.allergy_info} </Text>
                            <View style={style.hr}>
                            </View>

                        </View>

                    </View>

                </ImageBackground>


            </View>

            <View style={{ flex: 1, flexDirection: 'row', paddingHorizontal: 16, justifyContent: 'flex-end', paddingTop: 16 }}>
                <Text style={{ color: '#748A9D', alignSelf: 'center', fontWeight: 'bold', paddingHorizontal: 16 }}>Portion Sizes</Text>
                <FlatList
                    data={state.food_info.sizes}
                    horizontal
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => {
                            const id = item.id;
                            let custs = state.food_info.sizes;
                            let food = state.food_info;

                            let newcusts = custs.filter((obj) => {
                                if (obj.id == item.id) {
                                    obj.isSelected = true;
                                    food.food_total = parseFloat(obj.price, 10);
                                } else {
                                    obj.isSelected = false;
                                }
                                return obj.customizations.find((o) => {
                                    if (o.pricing_id == id) {
                                        return o;
                                    }
                                });

                            });
                            getCustomizatios({ newcusts });
                            updateItem({ "filt": food });

                        }
                        }>
                            <View style={item.isSelected ? style.size_sel : style.size} key={item.id}>
                                <Text style={item.isSelected ? { fontWeight: 'bold', color: 'white', fontSize: 14, alignSelf: 'center' } : { fontWeight: 'bold', color: '#748a9d', fontSize: 14, alignSelf: 'center' }}>{item.name}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                    keyExtractor={(item, index) => index}
                    showsHorizontalScrollIndicator={false}
                />
            </View>
            <View style={{ paddingLeft: 16, marginVertical: 16 }}>
                <FlatList
                    data={state.customizatios}
                    horizontal
                    renderItem={renderCustomization}
                    keyExtractor={(item, index) => item.id}
                    showsHorizontalScrollIndicator={false}
                />
            </View>
            {
                state !== undefined && state.food_info.drinks !== undefined && state.food_info.drinks.length !== 0
                && <Text style={{ color: '#748a9d', alignSelf: 'center', fontWeight: 'bold', paddingHorizontal: 16, fontSize: 14 }}>Add Drinks</Text>
            }

            <View style={{ paddingLeft: 16, marginVertical: 16 }}>
                <FlatList
                    data={state.food_info.drinks}
                    horizontal
                    renderItem={renderDrink}
                    keyExtractor={(item, index) => index}
                    showsHorizontalScrollIndicator={false}
                />
            </View>
            <Text style={{ color: '#748a9d', alignSelf: 'flex-start', fontWeight: 'bold', paddingHorizontal: 16, fontSize: 14 }}>Frequently ordered together </Text>
            <View style={{ paddingLeft: 16, marginVertical: 16 }}>

                <FlatList
                    data={CATS}
                    renderItem={renderFreq}
                    keyExtractor={(item, index) => index}
                    showsHorizontalScrollIndicator={false}
                />
            </View>

            <View style={{ paddingLeft: 16, marginTop: 16, marginBottom: 80, flexDirection: 'row', flex: 1, justifyContent: 'center' }}>
                <TouchableOpacity
                    onPress={() => {
                        let food = state.food_info;
                        if (food.qty != 0) {
                            food.qty = food.qty - 1;
                            updateItem({ "filt": food });

                        }

                    }}
                >
                    <Entypo name="circle-with-minus" size={25} style={{ paddingTop: 2 }} color={COLORS.primary} />
                </TouchableOpacity>
                {state.food_info.qty == 0 ? <Text style={{ fontSize: 16, textAlignVertical: 'center', paddingHorizontal: 8 }}> 1 </Text> : <Text style={{ fontSize: 16, textAlignVertical: 'center', paddingHorizontal: 8 }}> {state.food_info.qty} </Text>}
                <TouchableOpacity
                    onPress={() => {
                        let food = state.food_info;
                        food.qty = food.qty + 1;
                        updateItem({ "filt": food });

                    }}
                >
                    <Entypo name="circle-with-plus" size={25} style={{ paddingTop: 2 }} color={COLORS.primary} />
                </TouchableOpacity>
            </View>



        </ScrollView>
        <View style={{ position: 'absolute', bottom: 8, left: 64, right: 64 }}>
            <TouchableOpacity style={style.btn}
                onPress={() => {
                    let size_id;
                    let item_id = state.food_info.id;
                    let qty = state.food_info.qty;
                    if (qty == 0) {
                        qty = 1;
                    }
                    let chef_id = state.food_info.chef_id;

                    let customizations = [];
                    let drinks = [];
                    let custs = state.food_info.sizes;
                    let food_drinks = state.food_info.drinks;
                    let newcusts = custs.filter((obj) => {
                        if (obj.isSelected) {
                            size_id = obj.id;
                        }
                        obj.customizations.find((o) => {
                            if (o.isChecked) {
                                customizations.push(o.id)
                            }
                        });


                    });

                    food_drinks.filter((ob) => {
                        if (ob.qty > 0) {
                            drinks.push({ "drink_id": ob.id, "qty": ob.qty })
                        }
                    });
                    let items = [];
                    items.push({ "item_id": item_id, "size_id": size_id, "qty": qty, "customizations": customizations });
                    let cart = state.carts;
                    let coords = state.coords;
                    addToCart({ drinks, chef_id, items, cart, coords });
                }}
            >
                <LinearGradient
                    // Background Linear Gradient
                    colors={[COLORS.primary, COLORS.secondary]}
                    style={style.background_btn}
                    end={[0, 1]}
                    start={[1, 0]}

                />
                <View style={{ flex: 1, flexDirection: 'row', paddingHorizontal: 24, paddingVertical: 15, borderRadius: 28, justifyContent: 'space-between' }}>
                    <MaterialCommunityIcons name="cart-plus" size={24} color="white" />
                    <Text style={{ color: 'white', fontSize: 16 }}>{`Add ${state.food_info.qty === undefined ? 0 : state.food_info.qty === 0 ? 1 : state.food_info.qty} in Cart`}</Text>
                    {getTotal()}

                </View>
            </TouchableOpacity>
        </View>

    </SafeAreaView>

}

const style = StyleSheet.create({
    header: {
        height: Dimensions.get('window').height * 0.5,
        borderBottomRightRadius: 24,
        borderBottomLeftRadius: 24,

    },
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: Dimensions.get('window').height * 0.5,
        borderRadius: 24,


    },
    header_container: {
        flex: 1,
        flexDirection: 'column',
        paddingHorizontal: 24,
        paddingTop: 40,
        justifyContent: 'flex-start'
    },
    hr: {
        borderBottomColor: 'white',
        borderBottomWidth: 3,
        marginBottom: 16,
        marginHorizontal: 64,
    },
    btn: {
        borderRadius: 36,
        elevation: 6
    },
    background_btn: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: "100%",
        borderRadius: 28
    },
    size: {
        //  width: 80,
        paddingVertical: 8,
        paddingHorizontal: 16,
        marginRight: 8,
        borderRadius: 30,
        borderColor: '#707070',
        borderWidth: 1,
        borderRadius: 18,
        justifyContent: 'center'
    },
    size_sel: {
        //width: 80,
        paddingVertical: 8,
        paddingHorizontal: 16,
        marginRight: 8,
        borderRadius: 30,
        borderColor: 'red',
        borderWidth: 1,
        borderRadius: 18,
        justifyContent: 'center',
        backgroundColor: 'red'
    },
    customizations: {
        backgroundColor: '#F0F4F8',
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderRadius: 8,
        marginRight: 16,
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: 94,
        height: 94
    },
    drinks: {
        backgroundColor: '#F0F4F8',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        marginRight: 16,
        width: 76,
    }
});
FoodScreen.navigationOptions = () => {
    return {
        headerShown: false,
    }
}
export default FoodScreen;