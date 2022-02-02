import React from 'react';
import { View, StyleSheet,  } from 'react-native';

const Spacer = props => {
  return <View style={{marginBottom:props.marg}}>{props.children}</View>;
};


export default Spacer;
