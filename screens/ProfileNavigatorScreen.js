import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from './ProfileScreen';
import WishlistScreen from './WishlistScreen';

const ProfileStack = createNativeStackNavigator();

export default function ProfileNavigatorScreen({ navigationMain }) {
  return (
    <ProfileStack.Navigator initialRouteName="Profile" screenOptions={{
        headerShown: false,
    }}>
      <ProfileStack.Screen name="Profile">
        {(props) => <ProfileScreen {...props} navigationMain={navigationMain} />}
      </ProfileStack.Screen>
      <ProfileStack.Screen name='Wishlist' component={WishlistScreen} options={{animation:'slide_from_bottom'}}/>
    </ProfileStack.Navigator>
  );
}
