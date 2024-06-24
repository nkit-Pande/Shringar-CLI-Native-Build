import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CategoryScreen from './CategoryScreen';
import WishlistScreen from './WishlistScreen';
import OrderScreen from './OrderScreen';
import ProfileScreen from './ProfileScreen';
import * as Icon from 'react-native-feather';
import { Colors } from '../color';
import CartScreen from './CartScreen';
import DashBoard from './DashBoard';
import ProfileNavigatorScreen from './ProfileNavigatorScreen';

const Tab = createBottomTabNavigator();

export default function StarterScreen({ navigation }) {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      backBehavior="firstRoute"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Home':
              iconName = 'Home';
              break;
            case 'Category':
              iconName = 'List';
              break;
            case 'Order':
              iconName = 'ShoppingBag';
              break;
            case 'Account':
              iconName = 'User';
              break;
            case 'Cart':
              iconName = 'ShoppingCart';
              break;
            default:
              iconName = 'Circle';
              break;
          }

          const IconComponent = Icon[iconName];
          return <IconComponent color={color} size={size} />;
        },
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: '#BCBDBF',
        tabBarHideOnKeyboard: true,
        tabBarStyle: { 
          backgroundColor: Colors.e_orange,
          display: route.name === 'Cart' ? 'none' : 'flex',
        },
        tabBarLabelStyle:{
          fontFamily:'Poppins-SemiBold'
        }
      })}
    >
      <Tab.Screen name="Home" component={DashBoard} />
      <Tab.Screen name="Category">
        {(props) => <CategoryScreen {...props} navigation={navigation} />}
      </Tab.Screen>
      <Tab.Screen name="Order" component={OrderScreen} />
      <Tab.Screen name="Cart" component={CartScreen} />
      <Tab.Screen name="Account">
        {(props) => <ProfileNavigatorScreen {...props} navigationMain={navigation} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({});
