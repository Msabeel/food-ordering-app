import React,{useEffect,useContext, useLayoutEffect,useState} from "react";
import { View, StyleSheet, Text, FlatList, ImageBackground, Dimensions, TouchableOpacity, Image, SafeAreaView,ScrollView } from 'react-native';
import { COLORS, DATA_LIST, TEXT } from "../helpers/constants";
import { LinearGradient } from "react-native-linear-gradient";
import { Octicons } from '@expo/vector-icons';
import { Button, Icon } from "react-native-elements";
import { FontAwesome } from '@expo/vector-icons'; 
import { Feather } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons'; 
import {Context as DataContext} from '../context/dataContext';
import Spinner from 'react-native-loading-spinner-overlay';

const ReviewScreen =({navigation})=>{
  const id = navigation.state.params.id;
  const {state,getReviews}=useContext(DataContext);
  useEffect(()=>{
    getReviews({id});
    },[]);

    const stars=length=>{
      let content = [];
      const floor_st=Math.floor(length);//3
      const ceil_st=Math.ceil(length);//4
  
      const half=ceil_st-floor_st;//1
      const empty=5-(floor_st+half);//1
  
      console.log("half"+half);
      console.log("empty"+empty);
      console.log("floor_st"+floor_st);
      if(floor_st!=0){
      for(let i=0;i<floor_st;i++){
  
        content.push(<FontAwesome name="star" size={16} color="red" />)
               
      }
    }
      if(half!=0){
        for(let i=0;i<half;i++){
          content.push(        <FontAwesome name="star-half-full" size={16} color="red" />        )
                 
        }
      }
      if(empty!=0){
        for(let i=0;i<empty;i++){
          content.push(<FontAwesome name="star-o" size={16} color="red" />)
                 
        }
      }
  
  
      return content;
    }
  
    const renderItem = ({ item }) => (
        <View style={{ paddingVertical: 16, borderBottomColor: '#C0C0C0', borderBottomWidth: 1, marginHorizontal: 16 }}>
          <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-between', marginLeft: 16, paddingBottom: 8 }}>
              <Text style={{ fontWeight: 'bold', color: 'gray' ,fontSize:16}}>{item.user_name}</Text>
              <View style={{flex:1,flexDirection:'row'}}>
                {stars(parseFloat(item.star_rating,10))}
              </View>
              <Text style={{ fontWeight: 'bold', color: 'gray' ,fontSize:12,marginTop:8}}>{item.review}</Text>

                            
              </View>
        </View>
      );
    
    return <SafeAreaView style={{ paddingTop: 20}}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1}}>
            <Spinner visible={state.isLoading} />

            <View style={style.header}>
      <TouchableOpacity 
      onPress={()=>{
        navigation.goBack();
    }}
      >
            <Feather name="arrow-left" color='#748a9d' size={24}/>

        </TouchableOpacity>
        
      <Text style={{fontWeight:'bold',fontSize:20,color:'#748a9d'}}>Reviews</Text>

      <TouchableOpacity 
      onPress={()=>{
        navigation.goBack();
    }}
      >
        <Entypo name="cross" size={24} color="#748a9d" />
      </TouchableOpacity>
      
    </View>
   <FlatList
        data={state.reviews}

        renderItem={renderItem}
        keyExtractor={(item, index) => item.id}
        showsHorizontalScrollIndicator={false}
      />
            </ScrollView>
    </SafeAreaView>
  
}

const style=StyleSheet.create({
  header:{
    flex:1,
    flexDirection:'row',
    justifyContent:'space-between',
    backgroundColor: 'white',
    paddingVertical:16,
    paddingHorizontal:16,
    borderBottomLeftRadius:24,
    borderBottomRightRadius: 24,
    shadowColor:'#F0F4F8',
    shadowOpacity:0.9,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    elevation:10
        
  },
});
ReviewScreen.navigationOptions=()=>{
    return {
      headerShown:false,
    }
}
export default ReviewScreen;