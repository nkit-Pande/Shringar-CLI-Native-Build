import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import OrderScreen from './OrderScreen';
import * as Icon from 'react-native-feather';
import {Colors} from '../color';
import CartScreen from './CartScreen';
import DashBoard from './DashBoard';
import ProfileNavigatorScreen from './ProfileNavigatorScreen';
import CategoryScreenNavigator from './CategoryScreenNavigator';
import { OrderProvider } from '../context/orderContext';

const Tab = createBottomTabNavigator();

export default function StarterScreen({navigation}) {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      backBehavior="firstRoute"
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarIcon: ({color, size}) => {
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
        tabBarActiveTintColor: Colors.dark,
        tabBarInactiveTintColor: Colors.charcoal,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          backgroundColor: 'white',
          display: route.name === 'Cart' ? 'none' : 'flex',
        },
        tabBarLabelStyle: {
          fontFamily: 'Poppins-SemiBold',
        },
      })}>
      <Tab.Screen name="Home" component={DashBoard} />
      <Tab.Screen name="Category">
        {props => <CategoryScreenNavigator {...props} navigationMain={navigation} />}
      </Tab.Screen>
      <Tab.Screen name="Order">
        {props => (
          <OrderProvider>
            <OrderScreen {...props} />
          </OrderProvider>
        )}
      </Tab.Screen>
      <Tab.Screen name="Cart" component={CartScreen} />
      <Tab.Screen name="Account">
        {props => (
          <ProfileNavigatorScreen {...props} navigationMain={navigation} />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({});
