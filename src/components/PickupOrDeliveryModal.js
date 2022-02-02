import React, { useState } from "react";
import { Alert, Modal, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { COLORS } from "../helpers/constants";



const PickupOrDeliveryModal = (props) => {
    return (
        <View style={styles.centeredView}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={props.visible}
                onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                    props.setVisible();
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <TouchableOpacity
                            onPress={() => { props.setVisible("pickup") }}
                            style={{
                                width: "100%",
                                justifyContent: "center",
                                alignItems: "center",
                                padding: 10
                            }}
                        >
                            <Text style={{ fontWeight: 'bold', color: '#748a9d', fontSize: 17 }}>Pickup From</Text>
                        </TouchableOpacity>
                        <View style={{ width: "100%", height: 2, backgroundColor: "#000" }}></View>
                        <TouchableOpacity
                            onPress={() => props.setVisible("delivery")}
                            style={{
                                width: "100%",
                                padding: 10,
                                justifyContent: "center",
                                alignItems: "center"
                            }}
                        >
                            <Text style={{ fontWeight: 'bold', color: '#748a9d', fontSize: 17 }}>Delivery To</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View >
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 10,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: "50%"
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    buttonOpen: {
        backgroundColor: "#F194FF",
    },
    buttonClose: {
        backgroundColor: "#2196F3",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    }
});

export default PickupOrDeliveryModal;