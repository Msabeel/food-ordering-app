import React, { useContext } from 'react';
import { View, StyleSheet, Text, FlatList, ImageBackground, Dimensions, TouchableOpacity } from 'react-native';
import { COLORS, DATA_LIST, TEXT, shadowStyle } from "../helpers/constants";
import { LinearGradient } from 'expo-linear-gradient';
import { Context as DataContext } from '../context/dataContext';

const PromoBanner = () => {
  return <Text>helo</Text>
}

const PromotionalBanner = ({ navigation }) => {
  const { state } = useContext(DataContext);

  const findLocation = React.useMemo(() => {
    let add = "Willowdale";
    let address = add.toLowerCase();
    let customerAddress = state.location.toLowerCase();
    let findAddress = customerAddress.includes(address);
    console.log('findaddree', findAddress)
    return findAddress;
  }, [state.location]);

  // console.log('promotionalBanner', state.promos)



  const renderItem = ({ item }) => {
    // console.log('item>>>', item)

    // let check = item.delivery_type !== 'takeaway' && (findLocation === false);
    // let check = item.delivery_type === 'both' ? true : false;

    // console.log('check', check)

    return (
      <TouchableOpacity key={item.id + item.description}
        onPress={() => {
          navigation.navigate('Offers', {
            id: item.id
          })
        }}
      >
        <ImageBackground source={{ uri: item.image }} style={{
          resizeMode: "contain",
          marginRight: 8,
          marginTop: 8,
          marginBottom: 16,
          width: Dimensions.get('window').width * 0.65,
          height: Dimensions.get('window').width * 0.4,


        }}
          imageStyle={{ borderRadius: 24 }}

        >
          <LinearGradient
            // Background Linear Gradient
            colors={['transparent', 'transparent', 'rgba(237,21,57,0.4)']}
            style={style.background}
            start={[0.0, 0.3]}
            end={[0.07, 0.85]}
          />

          <View style={{ flex: 1, }}  >
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
              <Item title={item.description} />
              <View style={{ alignSelf: 'flex-end', padding: 8, }}>
                <TouchableOpacity

                  style={style.roundButton1}>
                  <Text style={{ fontSize: 9, color: 'white', fontWeight: 'bold', }}>{item.discount} %</Text>
                </TouchableOpacity>

              </View>

            </View>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    );


  }

  // const renderItem = ({ item }) => (
  //   <TouchableOpacity
  //     onPress={() => {
  //       navigation.navigate('Offers', {
  //         id: item.id
  //       })
  //     }}
  //   >
  //     <ImageBackground source={{ uri: item.image }} style={{
  //       resizeMode: "contain",
  //       marginRight: 8,
  //       marginTop: 8,
  //       marginBottom: 16,
  //       width: Dimensions.get('window').width * 0.65,
  //       height: Dimensions.get('window').width * 0.4,


  //     }}
  //       imageStyle={{ borderRadius: 24 }}

  //     >
  //       <LinearGradient
  //         // Background Linear Gradient
  //         colors={['transparent', 'transparent', 'rgba(237,21,57,0.4)']}
  //         style={style.background}
  //         start={[0.0, 0.3]}
  //         end={[0.07, 0.85]}
  //       />

  //       <View style={{ flex: 1, }}  >
  //         <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
  //           <Item title={item.description} />
  //           <View style={{ alignSelf: 'flex-end', padding: 8, }}>
  //             <TouchableOpacity

  //               style={style.roundButton1}>
  //               <Text style={{ fontSize: 9, color: 'white', fontWeight: 'bold', }}>{item.discount} %</Text>
  //             </TouchableOpacity>

  //           </View>

  //         </View>
  //       </View>
  //     </ImageBackground>
  //   </TouchableOpacity>
  // );
  const Item = ({ title }) => (
    <View style={style.item}>
      <Text style={TEXT.lableStyle}>{title}</Text>
    </View>
  );

  return (
    <FlatList
      data={state.promos}
      horizontal
      renderItem={renderItem}
      keyExtractor={(item, index) => item.id}
      showsHorizontalScrollIndicator={false}
    />
  );

};

const style = StyleSheet.create({
  item: {
    padding: 16,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end'
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: Dimensions.get('window').width * 0.4,
    borderRadius: 20,
  },
  roundButton1: {
    width: 42,
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    borderRadius: 50,
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,

    shadowOpacity: 1,

    elevation: 5,
  },


});

export default PromotionalBanner;
