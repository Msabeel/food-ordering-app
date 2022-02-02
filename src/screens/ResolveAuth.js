import React, { useState, useContext, useEffect } from "react";
import { Context as AuthContext } from '../context/authContext';
import { SafeAreaView, View, Image } from 'react-native';

const ResolveAuth = () => {
  const { localSingnIn } = useContext(AuthContext);


  useEffect(() => {
    setTimeout(() => {
      localSingnIn();
    }, 5000);
  }, []);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ width: '100%', height: '100%' }}>
        <Image style={{ width: '100%', height: '100%', resizeMode: 'stretch' }}
          source={require('../../assets/splash.png')} />
      </View>
    </SafeAreaView>
  );
}

export default ResolveAuth;