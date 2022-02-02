import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as Notifications from 'expo-notifications';


Notifications.setNotificationHandler({
    handleNotification: async () => {
        return {
            shouldShowAlert: true
        }
    }
})

export default function App() {

    useEffect(() => {
        Notifications.getPermissionsAsync().then((statusObj) => {
            // console.log(statusObj)
            if (statusObj.status !== "granted") {
                return Notifications.requestPermissionsAsync();
            }
            return statusObj;
        })
            .then((statusObj) => {
                console.log(statusObj)
                if (statusObj.status !== "granted") {
                    throw new Error('Permission not granted!');
                }
            })
            .then(() => {
                // return Notifications.getExpoPushTokenAsync();
                return Notifications.getDevicePushTokenAsync();
            })
            .then((response) => {
               alert(`token ${response.data}`)
                console.log(response)
                fetch('https://push-notification-11865-default-rtdb.firebaseio.com/expoToken.json',
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            token: response.data
                        })
                    })
            })
            .catch(err => {
                console.log("error ", err)
                alert(`error ${err}`)
                return null
            })
    }, []);

    useEffect(() => {
        const backgroundSubscription = Notifications.addNotificationResponseReceivedListener(notification => {
            console.log(notification);
        });

        const foregroundSubscription = Notifications.addNotificationReceivedListener(notification => {
            console.log(notification);
        });

        return () => {
            backgroundSubscription.remove();
            foregroundSubscription.remove();
        }
    }, [])

    return (
        <View style={styles.container}>
            <Text>Open up App.js to start working on your app!</Text>
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
