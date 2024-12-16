import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SearchScreen from './SearchScreen';
import CategoryScreen from './CategoryScreen';

const CStack = createNativeStackNavigator();

export default function CategoryScreenNavigator({navigationMain}) {
  return (
    <CStack.Navigator
      initialRouteName="Category"
      screenOptions={{
        headerShown: false,
      }}>
      <CStack.Screen name="CategoryMain">
        {props => <CategoryScreen {...props} navigation={navigationMain} />}
      </CStack.Screen>
      <CStack.Screen name="SearchBar">
        {props => <SearchScreen {...props} navigationMain={navigationMain} />}
      </CStack.Screen>
    </CStack.Navigator>
  );
}

const styles = StyleSheet.create({});
