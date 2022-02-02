import React, { useContext } from 'react';

import { View, StyleSheet, Text, FlatList } from 'react-native';
import { CATS, COLORS, DATA_LIST } from "../helpers/constants";
import { Context as DataContext } from '../context/dataContext';

const Categories = () => {
  const { state } = useContext(DataContext);

  const renderItem = ({ item }) => (
    <Item key={item.id} title={item.title} id={item.id} />
  );
  const Item = ({ title, id }) => (
    <View style={{ ...style.item, backgroundColor: id == '1' ? COLORS.primary : null, }}>
      <Text style={{ fontSize: 14, color: id == '1' ? 'white' : '#748A9D', }}>{title}</Text>
    </View>
  );

  return (
    <FlatList
      data={CATS}
      horizontal
      renderItem={renderItem}
      keyExtractor={(item, index) => index}
      showsHorizontalScrollIndicator={false}
    />
  );

};

const style = StyleSheet.create({
  item: {
    paddingVertical: 8,
    paddingHorizontal: 24,
    marginVertical: 8,
    marginRight: 8,
    borderRadius: 30,

  },
});

export default Categories;
