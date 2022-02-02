import * as React from 'react';
import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyBmrBFr3e5kM-IBBINi1BLVtUoFzpOls1U",
    authDomain: "sizzle-foods-310713.firebaseapp.com",
    projectId: "sizzle-foods-310713",
    storageBucket: "sizzle-foods-310713.appspot.com",
    messagingSenderId: "404900215549",
    appId: "1:404900215549:web:541c2f20bfd0494ffedc94",
    measurementId: "G-VMT2X0K8XT"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
};

export default () => {
    return { firebase, auth }
};